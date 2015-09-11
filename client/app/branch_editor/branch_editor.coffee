'use strict'

angular.module 'nbaAgcAdminApp'
.config ($stateProvider) ->
  $stateProvider.state 'branch_editor',
    url: '/branch_editor'
    templateUrl: 'app/branch_editor/branch_editor.html'
    controller: 'BranchEditorCtrl'

.directive 'hoverRow', [->
  restrict: 'A'
  link: (s, e, a) ->

    e.on('click', ->
      if not e.hasClass 'highlight'
        e.parent().children().removeClass 'highlight'
        e.addClass 'highlight'
      else e.removeClass 'highlight'
    )
]