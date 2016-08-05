'use strict'

angular.module 'nbaAgcAdminApp'
.service 'Users', ($resource) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  $resource '/auth/:id', null,
    'update': { method:'PUT' },
    create:
      method: 'POST'
      url: '/api/users/create'
    getGroups:
      method:'GET'
      url: '/api/users/getGroups'
      isArray:true
