'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'NameTagsCtrl', ($scope, printed, RegisteredUser, $state) ->
  $scope.printed = printed
  $scope.selectedAll = false

  $scope.checkAll = ->

    $scope.selection = []
    if $scope.selectedAll
      _.forEach $scope.users, (u) ->
        $scope.toggleSelection u._id

  RegisteredUser.query tagPrinted:printed, (users) ->
    $scope.users = users

  $scope.selection = []
  $scope.selectedAll = false

  $scope.checkAll = ->

    $scope.selection = []
    if $scope.selectedAll
      _.forEach $scope.users, (u) ->
        $scope.toggleSelection u._id

  # toggle selection for a given user
  $scope.toggleSelection = (_id) ->
    idx = $scope.selection.indexOf _id
    # is currently selected
    if idx > -1 then $scope.selection.splice idx, 1
    else if $scope.selection.length < 20 then $scope.selection.push _id

  $scope.printSelected = ->
    #if $scope.selection.length
    $state.go 'print_tags', ids: $scope.selection


.controller 'LNameTagsCtrl', ($scope, RegisteredUser, $state, printed, $localStorage) ->
  $scope.perPage = $localStorage.usersPerPage or 50
  $scope.currentPage = 1
  $scope.pageSizes = [25, 50, 100]
  $scope.printed = printed
  $scope.term = ''

  $scope.selection = []
  $scope.selectedAll = false

  $scope.pageChanged = ->
    $localStorage.usersPerPage = $scope.perPage
    $scope.load $scope.currentPage

  $scope.checkAll = ->
    $scope.selection = []
    if $scope.selectedAll
      _.forEach $scope.users, (u) ->
        $scope.toggleSelection u.user._id

  $scope.load = (page) ->
    RegisteredUser.query
      page: page
      perPage: $scope.perPage
    , (result, headers) ->
      $scope.users = result
      $scope.total = parseInt headers "total_found"
      $scope.pages = Math.ceil($scope.total / $scope.perPage)

  $scope.load 1

  $scope.doLookup = ->
    RegisteredUser.query name: $scope.term
    .$promise.then (users) ->
      $scope.users = users

  # toggle selection for a given user
  $scope.toggleSelection = (_id) ->
    idx = $scope.selection.indexOf _id
    # is currently selected
    if idx > -1 then $scope.selection.splice idx, 1
    else if $scope.selection.length < 100 then $scope.selection.push _id

  $scope.printSelected = ->
    #if $scope.selection.length
    $state.go 'print_tags', ids: $scope.selection


.controller 'TagPrintedCtrl', ($scope, Registration, $state) ->
  $scope.printed = true
  $scope.term = ''

  $scope.selection = []
  $scope.selectedAll = false

  $scope.checkAll = ->

    $scope.selection = []
    if $scope.selectedAll
      _.forEach $scope.users, (u) ->
        $scope.toggleSelection u._id

  Registration.withTags (users) ->
    $scope.users = users

  $scope.doLookup = ->
    Registration.withTags name: $scope.term
    .$promise.then (users) ->
      $scope.users = users
#      console.log users

  # toggle selection for a given user
  $scope.toggleSelection = (_id) ->
    idx = $scope.selection.indexOf _id
    # is currently selected
    if idx > -1 then $scope.selection.splice idx, 1
    else if $scope.selection.length < 20 then $scope.selection.push _id

  $scope.printSelected = ->
    if $scope.selection.length
      $state.go 'print_tags', ids: $scope.selection


.controller 'NameTagPrintCtrl', ($stateParams, $scope, RegisteredUser) ->
  $scope.toPrint = $stateParams.ids
  RegisteredUser.getTags tags: $scope.toPrint, (tags) ->
    $scope.nameTags = tags
