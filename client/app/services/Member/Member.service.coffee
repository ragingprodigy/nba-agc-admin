'use strict'

angular.module 'nbaAgcAdminApp'
.service 'Member', ($resource) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  $resource '/api/members/:id', null,

      'update': { method:'PUT' },
      findName:
        method: 'POST'
        url: '/api/members'
        isArray:true

