'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'sponsors',
    url: '/sponsors'
    requireLogin: true
    templateUrl: 'app/sponsors/sponsors.html'
    controller: 'SponsorsCtrl'
