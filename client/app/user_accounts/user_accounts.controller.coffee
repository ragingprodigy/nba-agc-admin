'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'UserAccountsCtrl', ($scope, Users, $auth, $state) ->

  $scope.users = Users.query {}


  $scope.toggleForm = ->
    $scope.user = {}
    $scope.newUser = !$scope.newUser

  $scope.changePassword = (user)->
    $state.go 'user_accounts.password', user: user._id

  $scope.createUser = (formName) ->
    if formName.$valid
      $auth.signup $scope.user
      .then ->
        $scope.users.push $scope.user
        $scope.toggleForm()
      , (err) ->
        console.log err
        $scope.error = err.data.message

    else alert "Form not filled accurately"

.controller 'PasswordCtrl', ($scope, Users, $stateParams, $state) ->

  if not $stateParams.user? then $scope.cancel()

  $scope.user = Users.get {id: $stateParams.user}

  $scope.cancel = ->
    $state.go 'user_accounts'

  $scope.updatePassword = (form) ->
    if form.$valid

      Users.update {id: $stateParams.user}, { password: $scope.new_password }, ->
        alert "Update Successful!"
        $scope.cancel()

    else

      $scope.error = 'Form not filled correctly'