'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'bank_errors',
    url: '/bank_errors'
    requireLogin: true
    templateUrl: 'app/bank_errors/bank_errors.html'
    controller: 'BankErrorsCtrl'

  .state 'bank_errors.createLP',
    url: '/:id/legal_practitioner'
    requireLogin: true
    templateUrl: 'app/bank_errors/forms/legal_practitioner.html'
    controller: 'BankErrorCreateCtrl'
    resolve:
      type: ->
        'legalPractitioner'

  .state 'bank_errors.createBencher',
    url: '/:id/san_and_bencher'
    requireLogin: true
    templateUrl: 'app/bank_errors/forms/bench.html'
    controller: 'BankErrorCreateCtrl'
    resolve:
      type: ->
        'sanAndBench'

  .state 'bank_errors.createMagistrate',
    url: '/:id/magistrate'
    requireLogin: true
    templateUrl: 'app/bank_errors/forms/magistrates.html'
    controller: 'BankErrorCreateCtrl'
    resolve:
      type: ->
        'magistrate'

  .state 'bank_errors.createJudge',
    url: '/:id/judge'
    requireLogin: true
    templateUrl: 'app/bank_errors/forms/judges.html'
    controller: 'BankErrorCreateCtrl'
    resolve:
      type: ->
        'judge'

  .state 'bank_errors.createOther',
    url: '/:id/political_appointees'
    requireLogin: true
    templateUrl: 'app/bank_errors/forms/others.html'
    controller: 'BankErrorCreateCtrl'
    resolve:
      type: ->
        'others'

  .state 'user_account_mgt',
    url: '/user_account/manager'
    requireLogin: true
    templateUrl: 'app/bank_errors/user_account_mgt.html'
    controller: 'UserAccountMgtCtrl'