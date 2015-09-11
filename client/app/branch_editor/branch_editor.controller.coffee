'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'BranchEditorCtrl', ($scope, Branch, toastr) ->

  $scope.branch = {}
  $scope.showingForm = false

  $scope.toggleForm = ->
    $scope.showingForm = !$scope.showingForm
    if $scope.showingForm
      $scope.branch = {}
      $scope.editingBranch = null

  $scope.edit = (branch, $index) ->
    $scope.branch = branch
    $scope.editingBranch = $index
    $scope.showingForm = true

  $scope.addBranch = (form)->
    if form.$valid
      if $scope.branch?._id
        Branch.update id:$scope.branch._id, $scope.branch, ->
          $scope.branches[$scope.editingBranch] = $scope.branch
          $scope.toggleForm()
          toastr.success "Update Successful!"
      else
        b = new Branch $scope.branch
        b.$save().then ->
          $scope.branches.push(b);
          $scope.toggleForm()
          toasts.success "Branch Added Successfully!"

  $scope.branches = Branch.query()

  $scope.getBranchList = ->
    Branch.list {}, (list) ->
      $scope.regBranches = list

  $scope.activateRow = (lH, index) ->
    if $scope.activeRow is index
      $scope.rowActive=false
      $scope.activeRow = undefined
      $scope.activeText = undefined
    else
      $scope.rowActive = true
      $scope.activeText = lH
      $scope.activeRow = index

  $scope.getBranchList()

  $scope.doReplace = (lh) ->
    if $scope.activeRow isnt undefined
      old = $scope.activeText
      if confirm "Replace #{$scope.activeText} with #{lh}?"
        Branch.merge { old: old, new: lh }, ->
          $scope.getBranchList()
          toastr.success "Replacement Successful!"
          $scope.rowActive=false
          $scope.activeRow = undefined
          $scope.activeText = undefined