'use strict'

angular.module 'nbaAgcAdminApp'
.service 'RegisteredUser', ($resource) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  $resource '/api/users/:id', null,
    'update': method:'PUT'
    getTags:
      method: 'GET'
      isArray: true
      url: '/api/users/getTags'
    getRegistrationTags:
      method: 'GET'
      isArray: true
      url: '/api/users/getRegistrationTags'
    resetPassword:
      method: 'POST'
      url: '/api/users/:id/reset'
      params: 'id':'@_id'
    allUsersForNameTags:
      method: 'GET'
      url: '/api/users/allUsersForNameTags'
      isArray: true