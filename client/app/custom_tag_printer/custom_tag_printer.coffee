'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'custom_tag_printer',
    url: '/custom_tag_printer'
    requireLogin: true
    templateUrl: 'app/custom_tag_printer/custom_tag_printer.html'
    controller: 'CustomTagPrinterCtrl'
