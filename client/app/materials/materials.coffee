'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider
  .state 'materials',
    url: '/materials'
    templateUrl: 'app/materials/materials.html'
    abstract: true

  .state 'materials.bybranch',
    url: '/bybranch'
    requireLogin: true
    templateUrl: 'app/materials/bybranch.html'
    controller: 'ByBranchCtrl'
