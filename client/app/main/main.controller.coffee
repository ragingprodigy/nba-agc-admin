'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'MainCtrl', ($scope, Registration, $rootScope) ->

  $scope.term = ''

  $scope.doLookup = ->
    # Fetch Confirmed Registrations
    Registration.query { term: $scope.term, statusConfirmed: true, isGroup: false }
    .$promise.then (registrations) ->
      $scope.registrations = registrations

  #$scope.getAll()
#  $scope.doLookup()
  $rootScope.$on 'reloadSuccess', ->
    #$scope.getAll()

.controller 'PendingRegistrationsCtrl', ($scope, Registration, $state) ->

  #$scope.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withDisplayLength 10

  # Fetch Pending Registrations
  Registration.query { statusConfirmed: false, responseGotten: false, completed: true, isGroup: false, pending:true}
  .$promise.then (registrations) ->
    $scope.registrations = registrations

  $scope.updateBank = (reg) ->

    $state.go 'main.pending.update', id: reg._id if reg.bankpay

    if reg.webpay and confirm 'Are you sure this registrant has paid to the bank?' then $state.go 'main.failed_web.update', id: reg._id

.controller 'PendingRegistrationsUpdateCtrl', ($scope, Registration, $stateParams, $state) ->

  if $stateParams.id?
    Registration.get id: $stateParams.id
    .$promise.then (registration) ->
      if not registration.bankpay then $scope.cancel()
      else
        $scope.registration = registration
        $scope.registration.bankDatePaid = new Date $scope.registration.bankDatePaid

  else $scope.cancel()

  $scope.cancel = ->
    $state.go 'main.pending'

  $scope.updateBank = (form)->
    if form.$valid

      Registration.update id:$scope.registration._id, $scope.registration, ->
        alert 'Update Successful!'
        $scope.cancel()
      , (error) ->
        console.log 'Error while Updating Record: ', error
        $scope.error = error.data.message

.controller 'WebFailedUpdateCtrl', ($scope, Registration, $stateParams, $state) ->

  if $stateParams.id?
    Registration.get id: $stateParams.id
    .$promise.then (registration) ->
      if not registration.webpay then $scope.cancel()
      else
        $scope.registration = registration
        $scope.registration.bankpay = true
        $scope.registration.webpay = false

  else $scope.cancel()

  $scope.cancel = ->
    $state.go 'main.failed_web'

  $scope.updateBank = (form)->
    if form.$valid

      Registration.update id:$scope.registration._id, $scope.registration, ->
        alert 'Update Successful!'
        $scope.cancel()
      , (error) ->
        console.log 'Error while Updating Record: ', error
        $scope.error = error.data.message

.controller 'NameChangeCtrl', ($scope, Registration, $stateParams, $state, $rootScope) ->
  if $stateParams.id?
    Registration.get id: $stateParams.id
    .$promise.then (registration) ->
      if not registration.statusConfirmed then $scope.cancel()
      else
        $scope.registration = registration

  else $scope.cancel()

  $scope.cancel = ->
    $state.go 'main.successful'

  $scope.saveDetails = (form)->
    if form.$valid

      Registration.update id:$scope.registration._id, $scope.registration, ->
        alert 'Update Successful!'
        $rootScope.$broadcast 'reloadSuccess'
        $scope.cancel()
      , (error) ->
        console.log 'Error while Updating Record: ', error
        $scope.error = error.data.message

.controller 'WebRegistrationsCtrl', ($scope, Registration) ->

  $scope.term = ''

  $scope.doLookup = ->
    # Fetch Successful Web Payments
    Registration.query { term: $scope.term, statusConfirmed: true, responseGotten: true, completed: true, webpay: true, isGroup: false }
    .$promise.then (registrations) ->
      $scope.registrations = registrations

.controller 'WebFailedCtrl', ($scope, Registration) ->

  $scope.term = ''

  $scope.doLookup = ->
    # Fetch Failed Web Payments
    Registration.query { term: $scope.term, statusConfirmed: false, responseGotten: true, completed: true, webpay: true, isGroup: false }
    .$promise.then (registrations) ->
      $scope.registrations = registrations

  $scope.doLookup()
.controller 'BankSuccessCtrl', ($scope, Registration) ->

  $scope.term = ''

  $scope.doLookup = ->
    # Fetch Successful Bank Payments
    Registration.query { term: $scope.term, statusConfirmed: true, responseGotten: true, completed: true, bankpay: true, isGroup: false }
    .$promise.then (registrations) ->
      $scope.registrations = registrations
