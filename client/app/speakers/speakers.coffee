'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'speakers',
    url: '/speakers'
    requireLogin: true
    templateUrl: 'app/speakers/speakers.html'
    controller: 'SpeakersCtrl'

  .state 'speakers.new',
    requireLogin: true
    templateUrl: 'app/speakers/form.html'
    controller: 'NewSpeakerCtrl'

  .state 'speakers.edit',
    url: '/:id'
    requireLogin: true
    templateUrl: 'app/speakers/form.html'
    controller: 'SpeakerCtrl'