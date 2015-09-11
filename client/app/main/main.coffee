'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider
  .state 'main',
    url: '/individuals'
    abstract: true
    templateUrl: 'app/main/main.html'

  .state 'main.successful',
    url: '/successful'
    requireLogin: true
    templateUrl: 'app/main/successful.html'
    controller: 'MainCtrl'

  .state 'main.successful.update',
    url: '/update/:id'
    requireLogin: true
    templateUrl: 'app/main/change-name.html'
    controller: 'NameChangeCtrl'

  .state 'main.pending',
    url: '/pending'
    requireLogin: true
    templateUrl: 'app/main/pending.html'
    controller: 'PendingRegistrationsCtrl'

  .state 'main.pending.update',
    url: '/:id'
    requireLogin: true
    templateUrl: 'app/main/update.html'
    controller: 'PendingRegistrationsUpdateCtrl'

  .state 'main.successful_web',
    url: '/successful/web'
    requireLogin: true
    templateUrl: 'app/main/successful_web.html'
    controller: 'WebRegistrationsCtrl'

  .state 'main.successful_bank',
    url: '/successful/bank'
    requireLogin: true
    templateUrl: 'app/main/successful_bank.html'
    controller: 'BankSuccessCtrl'

  .state 'main.failed_web',
    url: '/failed/web'
    requireLogin: true
    templateUrl: 'app/main/failed_web.html'
    controller: 'WebFailedCtrl'

  .state 'main.failed_web.update',
    url: '/update/:id'
    requireLogin: true
    templateUrl: 'app/main/update.html'
    controller: 'WebFailedUpdateCtrl'
