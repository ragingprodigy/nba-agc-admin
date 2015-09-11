'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'dashboard',
    url: '/'
    requireLogin: true
    templateUrl: 'app/dashboard/dashboard.html'
    controller: 'DashboardCtrl'
