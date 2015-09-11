'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'name_tags',
    url: '/name_tags/'
    abstract: true
    templateUrl: 'app/name_tags/main.html'

  .state 'print_tags',
    url: '/name_tags/print?ids'
    requireLogin: true
    templateUrl: 'app/name_tags/print.html'
    controller: 'NameTagPrintCtrl'

  .state 'name_tags.tag_printed',
    url: 'tag_printed'
    requireLogin: true
    templateUrl: 'app/name_tags/printed.html'
    controller: 'TagPrintedCtrl'

  .state 'name_tags.staged_unprinted',
    url: 'unprinted_light'
    requireLogin: true
    templateUrl: 'app/name_tags/name_tags_staged.html'
    controller: 'LNameTagsCtrl'
    resolve:
      printed: ->
        false

  .state 'name_tags.unprinted',
    url: 'unprinted'
    requireLogin: true
    templateUrl: 'app/name_tags/name_tags.html'
    controller: 'NameTagsCtrl'
    resolve:
      printed: ->
        false

  .state 'name_tags.printed',
    url: 'printed'
    requireLogin: true
    templateUrl: 'app/name_tags/name_tags.html'
    controller: 'NameTagsCtrl'
    resolve:
      printed: ->
        true
