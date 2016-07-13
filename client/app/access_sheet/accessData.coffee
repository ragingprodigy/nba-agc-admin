'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'accessSheet',
    url: '/accessSheet'
    templateUrl: 'app/access_sheet/accessData.html'
    controller: 'AccessSheetCtrl'
    requireLogin: true
