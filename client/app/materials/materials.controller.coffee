'use strict'
angular.module 'nbaAgcAdminApp'

.controller 'ByBranchCtrl', ($scope,Branch,Registration,toastr) ->
  $scope.load = ->
    Branch.query {}
    .$promise.then (branches) ->
      if branches?
        $scope.branchData = branches
  $scope.load()
  $scope.selectedBranch

  $scope.getConfirmed = (branch) ->
    if branch?
      Registration.query {paymentSuccessful:true,branch:branch}
      .$promise.then (registrations) ->
        $scope.registrations =  registrations

  $scope.changePickup = (reg) ->
    if reg?
      if reg.material is 'branch'
        reg.material = 'onsite'
      else if reg.material is 'onsite'
        reg.material = 'branch'
      Registration.update id:reg._id, reg, ->
        toastr.success 'Conference Material Location changed to '+reg.material
        $scope.load()
