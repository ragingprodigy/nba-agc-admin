'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'accessSheetOnline',
    url: '/accessSheetOnline'
    templateUrl: 'app/access_sheet/accessDataOnline.html'
    controller: 'AccessSheetCtrl'
    requireLogin: true
  .state 'accessSheetOffline',
    url: '/accessSheetOffline'
    templateUrl: 'app/access_sheet/accessDataOffline.html'
    controller: 'AccessSheetCtrl'
    requireLogin: true
