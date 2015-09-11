'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'user_accounts',
    url: '/user_accounts'
    requireLogin: true
    templateUrl: 'app/user_accounts/user_accounts.html'
    controller: 'UserAccountsCtrl'

  .state 'user_accounts.password',
    url: '/change_password/:user'
    requireLogin: true
    templateUrl: 'app/user_accounts/password.html'
    controller: 'PasswordCtrl'
