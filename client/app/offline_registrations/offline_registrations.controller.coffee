'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'OfflineRegistrationsCtrl', ($scope, Registration) ->

  Registration.query isDirect: true
  .$promise.then (registrations) ->
    $scope.registrations = registrations

.controller 'LegalPractitionerCtrl', ($scope, $state, Member, Registration, $stateParams,Branch) ->
  Branch.query {}
  .$promise.then (branches) ->
    $scope.branchData = branches

  if $stateParams.id?
    Registration.get id: $stateParams.id
    .$promise.then (registration) ->
      $scope.registration = registration
      $scope.registration.bankDatePaid = new Date $scope.registration.bankDatePaid
      $scope.showForm = $scope.lookup = true
  else
    $scope.registration = {}

  $scope.doLookup = (form) ->
    if form.$valid
      Member.query $scope.member
      .$promise.then (members) ->
        $scope.members = members
        $scope.lookup = true

  $scope.startRegistration = (member) ->
    $scope.registration.member = member._id
    $scope.registration.yearCalled = member.yearCalled
    $scope.registration.nbaId = member.nbaId
    $scope.registration.isDirect = true
    $scope.registration.completed = true
    $scope.registration.formFilled = true
    $scope.registration.bankpay = true
    $scope.registration.registrationType = 'legalPractitioner'

    # Get the Fee Due
    currentYear = new Date().getFullYear()
    atTheBar = currentYear - member.yearCalled
    feeDue = 50000

    if atTheBar <= 5 then feeDue = 8000
    else if atTheBar <= 10 then feeDue = 15000
    else if atTheBar <= 14 then feeDue = 20000
    else if atTheBar <= 20 then feeDue = 30000

    $scope.registration.conferenceFee = feeDue
    $scope.registration.bankDeposit = feeDue

    $scope.showForm = true

  $scope.doSubmit = (form) ->
    if form.$valid and confirm "Are you sure?"
      if $stateParams.id?
        Registration.update { id: $stateParams.id } , $scope.registration, ->
          $state.go "offline_registrations"
      else
        registration = new Registration $scope.registration

        registration.$save ->
          $state.go "offline_registrations"
        , (err) ->
          console.log "Save Error: ", err

.controller 'SanAndBenchCtrl', ($scope, $state, Registration, $stateParams,Branch) ->
  Branch.query {}
  .$promise.then (branches) ->
    $scope.branchData = branches

  $scope.years = [2014..1960]

  if $stateParams.id?
    Registration.get id: $stateParams.id
    .$promise.then (registration) ->
      $scope.registration = registration
      $scope.registration.bankDatePaid = new Date $scope.registration.bankDatePaid
  else
    $scope.registration =
      isDirect: true
      completed: true
      bankpay: true
      formFilled: true
      member: ''
      registrationType: 'sanAndBench'
      conferenceFee: 100000
      bankDeposit: 100000

  $scope.doSubmit = (form) ->
    if form.$valid and confirm "Are you sure?"
      if $stateParams.id?
        Registration.update { id: $stateParams.id } , $scope.registration, ->
          $state.go "offline_registrations"
      else
        registration = new Registration $scope.registration

        registration.$save ->
          $state.go "offline_registrations"
        , (err) ->
          console.log "Save Error: ", err

.controller 'MagistratesCtrl', ($scope, $state, Registration, $stateParams,Branch) ->
  Branch.query {}
  .$promise.then (branches) ->
    $scope.branchData = branches
  $scope.years = [2014..1960]

  if $stateParams.id?
    Registration.get id: $stateParams.id
    .$promise.then (registration) ->
      $scope.registration = registration
      $scope.registration.bankDatePaid = new Date $scope.registration.bankDatePaid
  else
    $scope.registration =
      isDirect: true
      completed: true
      bankpay: true
      formFilled: true
      member: ''
      registrationType: 'magistrate'
      conferenceFee: 50000
      bankDeposit: 50000

  $scope.doSubmit = (form) ->
    if form.$valid and confirm "Are you sure?"
      if $stateParams.id?
        Registration.update { id: $stateParams.id } , $scope.registration, ->
          $state.go "offline_registrations"
      else
        registration = new Registration $scope.registration

        registration.$save ->
          $state.go "offline_registrations"
        , (err) ->
          console.log "Save Error: ", err

.controller 'JudgesCtrl', ($scope, $state, Registration, $stateParams, Branch) ->
  Branch.query {}
  .$promise.then (branches) ->
    $scope.branchData = branches
  $scope.years = [2014..1960]

  if $stateParams.id?
    Registration.get id: $stateParams.id
    .$promise.then (registration) ->
      $scope.registration = registration
      $scope.registration.bankDatePaid = new Date $scope.registration.bankDatePaid
  else
    $scope.registration =
      isDirect: true
      completed: true
      bankpay: true
      formFilled: true
      member: ''
      registrationType: 'judge'
      conferenceFee: 75000
      bankDeposit: 75000

  $scope.doSubmit = (form) ->
    if form.$valid and confirm "Are you sure?"
      if $stateParams.id?
        Registration.update { id: $stateParams.id } , $scope.registration, ->
          $state.go "offline_registrations"
      else
        registration = new Registration $scope.registration

        registration.$save ->
          $state.go "offline_registrations"
        , (err) ->
          console.log "Save Error: ", err

.controller 'OthersCtrl', ($scope, $state, Registration, $stateParams) ->
  
  $scope.years = [2014..1960]

  if $stateParams.id?
    Registration.get id: $stateParams.id
    .$promise.then (registration) ->
      $scope.registration = registration
      $scope.registration.bankDatePaid = new Date $scope.registration.bankDatePaid
  else
    $scope.registration =
      isDirect: true
      completed: true
      bankpay: true
      formFilled: true
      member: ''
      registrationType: 'others'
      conferenceFee: 250000
      bankDeposit: 250000

  $scope.doSubmit = (form) ->
    if form.$valid and confirm "Are you sure?"
      if $stateParams.id?
        Registration.update { id: $stateParams.id } , $scope.registration, ->
          $state.go "offline_registrations"
      else
        registration = new Registration $scope.registration

        registration.$save ->
          $state.go "offline_registrations"
        , (err) ->
          console.log "Save Error: ", err
