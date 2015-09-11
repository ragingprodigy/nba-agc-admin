'use strict'

angular.module 'nbaAgcAdminApp'
.service 'Bags', ($resource)->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  $resource '/api/bags'