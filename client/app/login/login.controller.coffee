'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'LoginCtrl', ($scope, $auth, $window) ->
  $scope.login = ->
    $auth.login {
      email: $scope.email
      password: $scope.password
    }
    .then ->
      $window.location.href = '/'
    , (e) ->
      $scope.error = e.data.message