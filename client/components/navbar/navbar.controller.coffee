'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'NavbarCtrl', ($scope, $location, $auth, $state, $rootScope) ->

  $scope.logout = ->
    if confirm 'Are you sure?'
      $auth.logout()
      $state.go 'login'

  $scope.isGuest = ->
    !$auth.isAuthenticated()

  $scope.notAdmin = ->
    $rootScope.$user.role isnt 'admin'

  $scope.isCollapsed = true

  $scope.isActive = (route) ->
    route is $location.path()