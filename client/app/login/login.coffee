'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'login',
    url: '/login'
    requireLogin: false
    templateUrl: 'app/login/login.html'
    controller: 'LoginCtrl'
