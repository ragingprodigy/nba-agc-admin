'use strict'

angular.module 'nbaAgcAdminApp'
.service 'Registration', ($resource) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  $resource '/api/registrations/:id', null,
    update: method: 'PUT'
    saveDelegate:
      method: 'POST'
      url: '/api/registrations/'
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
    AccessIndex:
      method: 'GET'
      url: '/api/registrations/access/index'
      isArray:true
    CheckData:
      method: 'GET'
      url: '/api/registrations/check'
    Resolve:
      method: 'POST'
      url: '/api/registrations/access/resolve'
    createOfflineReg:
      method: 'POST'
      url: '/api/registrations/createOfflineReg'
    createGroupAdminOfflineReg:
      method: 'POST'
      url: '/api/registrations/createGroupAdminOfflineReg'
    createGroupMemberOfflineReg:
      method: 'POST'
      url: '/api/registrations/createGroupMemberOfflineReg'
    Fast:
      method: 'GET'
      isArray: true
      url: '/api/registrations/fast'
    addGroup:
      method: 'POST'
      url: '/api/registrations/addGroup'
      isArray: true
    allGroups:
      method: 'GET'
      url: '/api/registrations/allGroups'
      isArray: true
