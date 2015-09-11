'use strict'

angular.module 'nbaAgcAdminApp'
.service 'Member', ($resource) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  $resource '/api/members/:id', null,
    {
      'update': { method:'PUT' },
    }