'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider
  .state 'group',
    url: '/group'
    templateUrl: 'app/group/group.html'
    abstract: true

  .state 'group.successful',
    url: '/successful'
    requireLogin: true
    templateUrl: 'app/group/successful.html'
    controller: 'GroupCtrl'

  .state 'group.pending',
    url: '/pending'
    requireLogin: true
    templateUrl: 'app/group/pending.html'
    controller: 'PendingInvoicesCtrl'

  .state 'group.pending.update',
    url: '/:id'
    requireLogin: true
    templateUrl: 'app/group/update.html'
    controller: 'PendingInvoicesUpdateCtrl'

  .state 'group.successful_web',
    url: '/successful/web'
    requireLogin: true
    templateUrl: 'app/group/successful_web.html'
    controller: 'WebInvoicesCtrl'

  .state 'group.successful_bank',
    url: '/successful/bank'
    requireLogin: true
    templateUrl: 'app/group/successful_bank.html'
    controller: 'BankInvoiceSuccessCtrl'

  .state 'group.failed_web',
    url: '/failed/web'
    requireLogin: true
    templateUrl: 'app/group/failed_web.html'
    controller: 'WebInvoiceFailedCtrl'
