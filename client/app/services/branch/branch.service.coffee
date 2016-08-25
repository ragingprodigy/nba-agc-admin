'use strict'

angular.module 'nbaAgcAdminApp'
.service 'Branch', ($resource) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  $resource '/api/branches/:id', null,
    merge:
      url: '/api/branches/merge'
      method: 'POST'
    update: method: 'PUT'
    list:
      method: 'GET'
      url: '/api/branches/uniqueList'
      isArray: true
    getPrintData:
      method: 'GET'
      url: '/api/branches/printData'
      isArray: true
    listOnsite:
      method: 'GET'
      url: '/api/branches/onSiteUniqueList'
      isArray: true
    getOnsitePrintData:
      method: 'GET'
      url: '/api/branches/printOnsiteData'
      isArray: true
    getVipPrintData:
      method: 'GET'
      url: '/api/branches/printVip'
      isArray: true
