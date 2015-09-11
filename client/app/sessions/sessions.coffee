'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'sessions',
    url: '/sessions'
    requireLogin: true
    templateUrl: 'app/sessions/sessions.html'
    controller: 'SessionsCtrl'

  .state 'sessions.new',
    requireLogin: true
    templateUrl: 'app/sessions/form.html'
    controller: 'NewSessionCtrl'

  .state 'sessions.edit',
    url: '/:id'
    requireLogin: true
    templateUrl: 'app/sessions/form.html'
    controller: 'EditSessionCtrl'
