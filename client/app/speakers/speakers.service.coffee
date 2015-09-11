'use strict'

angular.module 'nbaAgcAdminApp'
.service 'Speakers', ($resource) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  $resource '/api/speakers/:id', null, update: method:'PUT'