'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'members',
    url: '/members'
    requireLogin: true
    templateUrl: 'app/members/members.html'
    controller: 'MembersCtrl'

  .state 'members.edit',
    url: '/:id'
    requireLogin: true
    templateUrl: 'app/members/edit.html'
    controller: 'MemberEditCtrl'