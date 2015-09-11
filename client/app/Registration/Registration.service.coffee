'use strict'

angular.module 'nbaAgcAdminApp'
.service 'Registration', ($resource) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  $resource '/api/registrations/:id', null,
    update: method: 'PUT'
    stats:
      method: 'GET'
      url: '/api/registrations/stats'
    doFastTrack:
      method: 'POST'
      params: 'id':'@_id'
    fastTrack:
      method: 'GET'
      isArray: true
      url: '/api/registrations/fastTrack'
    withTags:
      method: 'GET'
      isArray: true
      url: '/api/registrations/withTags'