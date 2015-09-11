'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'offline_registrations',
    url: '/offline_registrations'
    requireLogin: true
    templateUrl: 'app/offline_registrations/offline_registrations.html'
    controller: 'OfflineRegistrationsCtrl'

  .state 'new_offline',
    url: '/offline_registrations/new'
    requireLogin: true
    templateUrl: 'app/offline_registrations/new.html'

  .state 'new_offline.legalPractitioner',
    url: '/legal_practitioner'
    requireLogin: true
    templateUrl: 'app/offline_registrations/forms/legal_practitioner.html'
    controller: 'LegalPractitionerCtrl'

  .state 'offline_registrations.legalPractitioner',
    url: '/legal_practitioner/:id'
    requireLogin: true
    templateUrl: 'app/offline_registrations/forms/legal_practitioner.html'
    controller: 'LegalPractitionerCtrl'

  .state 'new_offline.sanAndBench',
    url: '/san_and_benchers'
    requireLogin: true
    templateUrl: 'app/offline_registrations/forms/bench.html'
    controller: 'SanAndBenchCtrl'

  .state 'offline_registrations.sanAndBench',
    url: '/san_and_benchers/:id'
    requireLogin: true
    templateUrl: 'app/offline_registrations/forms/bench.html'
    controller: 'SanAndBenchCtrl'

  .state 'new_offline.magistrate',
    url: '/magistrates'
    requireLogin: true
    templateUrl: 'app/offline_registrations/forms/magistrates.html'
    controller: 'MagistratesCtrl'

  .state 'offline_registrations.magistrate',
    url: '/magistrates/:id'
    requireLogin: true
    templateUrl: 'app/offline_registrations/forms/magistrates.html'
    controller: 'MagistratesCtrl'

  .state 'new_offline.judge',
    url: '/justices'
    requireLogin: true
    templateUrl: 'app/offline_registrations/forms/judges.html'
    controller: 'JudgesCtrl'

  .state 'offline_registrations.judge',
    url: '/justices/:id'
    requireLogin: true
    templateUrl: 'app/offline_registrations/forms/judges.html'
    controller: 'JudgesCtrl'

  .state 'new_offline.others',
    url: '/political_appointees'
    requireLogin: true
    templateUrl: 'app/offline_registrations/forms/others.html'
    controller: 'OthersCtrl'

  .state 'offline_registrations.others',
    url: '/political_appointees/:id'
    requireLogin: true
    templateUrl: 'app/offline_registrations/forms/others.html'
    controller: 'OthersCtrl'
