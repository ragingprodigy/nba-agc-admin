'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'CustomTagPrinterCtrl', ($scope, Registration, toastr, Branch, Users) ->
  $scope.tag = {}
  $scope.isGroup = false

  $scope.titles = ['DR', 'PROF', 'HON', 'CHIEF', 'SIR', 'CAPT', 'ALHAJI', 'MAJOR', 'PRINCE', 'ELDER', 'LADY', 'Hon. JUSTICE', 'REV']
  $scope.suffixes = ['JP', 'SAN', 'OFR', 'OON', 'MON', 'GCON', 'CFR']

  Registration.allGroups (groups) ->
    $scope.groups = groups

  $scope.addGroup = (group) ->
    Registration.addGroup group, (response) ->
      $scope.groups = response
      toastr.info 'Group created successfully'
    , (e) ->
      if e.data.message?
        toastr.error e.data.message
      else
        toastr.error 'Group not added'

  Users.getDistinctGroups (distinctGroups) ->
    $scope.distinctGroups = distinctGroups

  Branch.query (branches) ->
    $scope.branches = branches

  $scope.makeGroup = ->
    $scope.isGroup = !$scope.isGroup

  $scope.doingPrint = false

  $scope.printTags = (form) ->
    if form.$valid
      $scope.doingPrint = true

  $scope.cancelPrint = ->
    $scope.doingPrint = false
    $scope.tag = {}

  $scope.registerAndPrint = (form) ->
    if form.$valid
      Registration.createOfflineReg $scope.tag, (response) ->
        $scope.printTags form
        toastr.info response.surname + ' was created Onsite!'
      , (e) ->
        $scope.doingPrint = false
        toastr.error 'Data was not saved..please try again!'
        console.error e.data.err

  $scope.registerAndPrintGroupMember = (form) ->
    if form.$valid
      Registration.createGroupMemberOfflineReg $scope.tag, (response) ->
        $scope.printTags form
        toastr.info response.surname + ' was created on site as a group member!'
      , (e) ->
        $scope.doingPrint = false
        toastr.error 'Data was not saved..please try again!'
        console.error e.data.err

  $scope.registerAndPrintGroupAdmin = (form) ->
    if form.$valid
      Registration.createGroupAdminOfflineReg $scope.tag, (response) ->
        $scope.printTags form
        toastr.info response.surname + ' was created on site as a group admin!'
      , (e) ->
        $scope.doingPrint = false
        toastr.error 'Data was not saved..please try again!'
        console.error e.data.err