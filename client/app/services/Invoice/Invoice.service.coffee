'use strict'

angular.module 'nbaAgcAdminApp'
.service 'Invoice', ($resource) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  $resource '/api/invoices/:id', null,
    update: method: 'PUT'
    GroupFastTracked:
      method: 'POST'
      url: '/api/invoices/groupFastTracked'
