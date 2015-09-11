'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'SpeakersCtrl', ($scope, Speakers, $rootScope) ->

  $scope.loadAll = ->
    Speakers.query {}
    .$promise.then (speakers) ->
      $scope.speakers = speakers

  $scope.loadAll()

  $rootScope.$on 'reloadSpeakers', ->
    $scope.loadAll()

.controller 'NewSpeakerCtrl', ($scope, Speakers, $rootScope, $state, AWS) ->

  $scope.speaker = {}
  $scope.type = 'speaker-picture/'

  $scope.cancel = ->
    $state.go 'speakers'

  $scope.createSpeakerProfile = (form) ->
    if form.$valid
      $scope.formSubmitted = true
      $('.center-form :input').attr("disabled", true);
      if $scope.file then AWS.upload $scope.file, $scope.type, (err, fileName) ->
        $scope.speaker.photo = fileName if not err?
        $scope.saveSpeaker()
      else $scope.saveSpeaker()

  $scope.saveSpeaker = ->
    speaker = new Speakers $scope.speaker
    speaker.$save ->
      $rootScope.$broadcast 'reloadSpeakers'
      $state.go 'speakers'

.controller 'SpeakerCtrl', ($scope, Speakers, $stateParams, $state, AWS, $rootScope) ->

  Speakers.get id: $stateParams.id, (data) ->
    $scope.speaker = data
    $scope.type = 'speaker-picture/'

  $scope.cancel = ->
    $state.go 'speakers'

  $scope.createSpeakerProfile = (form) ->
    if form.$valid
      $scope.formSubmitted = true
      $('.center-form :input').attr "disabled", true

      if $scope.file then AWS.upload $scope.file, $scope.type, (err, fileName) ->
        $scope.speaker.photo = fileName if not err?
        $scope.saveSpeaker()
      else $scope.saveSpeaker()

  $scope.saveSpeaker = ->
    Speakers.update id: $stateParams.id, $scope.speaker, ->
      $rootScope.$broadcast 'reloadSpeakers'
      $state.go 'speakers'
