'use strict'

angular.module 'nbaAgcAdminApp'
.service 'Sponsors', ($resource) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  $resource '/api/sponsors/:id', null,
    update: method: 'PUT'
    delegates:
      method: 'GET'
      isArray: true
      url: '/api/sponsors/:id/delegates'