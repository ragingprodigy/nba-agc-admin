'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'SessionsCtrl', ($scope, Sessions, $rootScope, $modal) ->

  $scope.loadAll = ->
    Sessions.query {}
    .$promise.then (sessions) ->
      $scope.sessions = sessions

  $scope.loadAll()

  $scope.showDetails = (session) ->
    $modal.open
      animation: true
      controller: 'SessionCtrl'
      size: 'lg'
      backdrop: 'static'
      templateUrl: 'app/sessions/session.html'
      resolve:
        selectedSession: ->
          session

  $rootScope.$on 'reloadSessions', ->
    $scope.loadAll()

.controller 'SessionCtrl', ($scope, Sessions, Speakers, $state, selectedSession, $modalInstance) ->

  # Fetch Session Afresh
  Sessions.get id:selectedSession._id, (session) ->
    $scope.session = session
    $scope.rate = _.reduce $scope.session.ratings, (sum, r) ->
      sum + r.score
    , 0

    $scope.paper =
      speaker: ""
      title: ""
      document: ""
      _id: $scope.session._id

  $scope.newPaper = (theForm) ->
    if theForm.$valid
      $scope.paper.speaker = $scope.paper.speaker._id
      Sessions.addPaper $scope.paper, (resp) ->
        $scope.session = resp
        theForm.$setPristine()
        $scope.paperForm = false

  Speakers.query {}
  .$promise.then (speakers) ->
    $scope.speakers = speakers

  $scope.close = ->
    $modalInstance.dismiss 'cancel'

  $scope.deletePaper = (id) ->
    if confirm 'Are you sure? '
      Sessions.deletePaper
        id:$scope.session._id
        paperId: id
      , (response) ->
          $scope.session = response
          alert "Operation Successful"

  $scope.deleteQuestion = (id) ->
    if confirm 'Are you sure? '
      Sessions.deleteQuestion
        id:$scope.session._id
        questionId: id
      , (response) ->
          $scope.session = response
          alert "Operation Successful"

  $scope.editSession = ->
    $state.go 'sessions.edit', id: $scope.session._id
    $scope.close()

.controller 'NewSessionCtrl', ($scope, Sessions, Speakers, $rootScope, $state) ->

  Speakers.query {}
  .$promise.then (speakers) ->
    $scope.speakers = speakers
    $scope.session =
      speakers: []

  $scope.cancel = ->
    $state.go 'sessions'

  $scope.createSession = (form) ->
    if form.$valid
      $scope.session.speakers = _.pluck $scope.session.speakers, '_id'

      session = new Sessions $scope.session
      session.$save ->
        $rootScope.$broadcast 'reloadSessions'
        $scope.cancel()

.controller 'EditSessionCtrl', ($scope, Sessions, Speakers, $rootScope, $state, $stateParams) ->

  Speakers.query {}
  .$promise.then (speakers) ->
    $scope.speakers = speakers

  Sessions.get id: $stateParams.id, (session) ->
    $scope.session = session

  $scope.cancel = ->
    $state.go 'sessions'

  $scope.createSession = (form) ->
    if form.$valid
      payLoad = _.pick $scope.session, ['title','description','venue','start_time','end_time','rating_start']
      payLoad.speakers = _.pluck $scope.session.speakers, '_id'
      Sessions.update id:$stateParams.id, payLoad, ->
        $rootScope.$broadcast 'reloadSessions'
        $scope.cancel()