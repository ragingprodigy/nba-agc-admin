'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'fast_track',
    url: '/fast_track'
    templateUrl: 'app/fast_track/fast_track.html'
    controller: 'FastTrackCtrl'
