'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'BankErrorsCtrl', ($scope, RegisteredUser) ->

  $scope.load = ->
    $scope.users = RegisteredUser.query unregistered:true

  $scope.load()

  $scope.$on "reload_bank_errors", ->
    $scope.load()

.controller 'BankErrorCreateCtrl', ($scope, $stateParams, RegisteredUser, type, Member, $state, Registration) ->

  $scope.years = [2014..1960]

  RegisteredUser.get id:$stateParams.id
  .$promise.then (user) ->
    $scope.registration =
      user: user._id
      email: user.email
      isDirect: false
      completed: true
      bankpay: true
      formFilled: true
      registrationType: type

    $scope.doSubmit = (form) ->
      if form.$valid and confirm "Are you sure?"
        registration = new Registration $scope.registration

        registration.$save ->
          $scope.$emit "reload_bank_errors"
          $state.go "bank_errors"

    switch type
      when 'legalPractitioner'
        $scope.doLookup = (form) ->
          if form.$valid
            Member.query $scope.member
            .$promise.then (members) ->
              $scope.members = members
              $scope.lookup = true

        $scope.startRegistration = (member) ->
          $scope.registration.member = member
          $scope.registration.yearCalled = member.yearCalled

          # Get the Fee Due
          currentYear = new Date().getFullYear()
          atTheBar = currentYear - member.yearCalled
          feeDue = 50000

          if atTheBar <= 5 then feeDue = 8000
          else if atTheBar <= 10 then feeDue = 15000
          else if atTheBar <= 14 then feeDue = 20000
          else if atTheBar <= 20 then feeDue = 30000

          $scope.registration.conferenceFee = feeDue

          $scope.showForm = true

      when 'sanAndBench'
        $scope.registration.conferenceFee = 100000

      when 'magistrate'
        $scope.registration.conferenceFee = 50000

      when 'judge'
        $scope.registration.conferenceFee = 75000

      when 'others'
        $scope.registration.conferenceFee = 250000

.controller 'UserAccountMgtCtrl', ($scope, RegisteredUser) ->

  $scope.load = ->
    $scope.users = RegisteredUser.query()

  $scope.load()

  $scope.resetPassword = (user) ->
    if confirm "Are you sure you want to reset the password for this account"
      user.$resetPassword().then ->
        alert "Account password reset to 1234"