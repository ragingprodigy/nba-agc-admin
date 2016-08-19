'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider
  .state 'fast_track.bySearch',
    url: '/bySearch'
    templateUrl: 'app/fast_track/searchResult.html'
    controller: 'FastTrackCtrl'
  .state 'fast_track',
    url: '/fast_track'
    templateUrl: 'app/fast_track/fast_track.html'
    controller: 'FastTrackCtrl'
  .state 'fast_track.bybranch',
    url: '/bybranch'
    requireLogin: true
    templateUrl: 'app/fast_track/bybranch.html'
    controller: 'FastTrackCtrl'
  .state 'fast_track.byGroup',
    url: '/byGroup'
    requireLogin: true
    templateUrl: 'app/fast_track/byGroup.html'
    controller: 'FastTrackGroupCtrl'
  .state 'fast_track.byVip',
    url: '/byVip'
    requireLogin: true
    templateUrl: 'app/fast_track/byVip.html'
    controller: 'FastTrackVipCtrl'
  .state 'fast_track.byIndividual',
    url: '/byIndividual'
    requireLogin: true
    templateUrl: 'app/fast_track/byIndividual.html'
    controller: 'FastTrackCtrl'

