'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'FastTrackCtrl', ($scope, Registration, $modal, toastr, Bags) ->
  $scope.term = ''

  $scope.bags = Bags.query()

  $scope.doLookup = ->
    Registration.fastTrack q: $scope.term
    .$promise.then (registrations) ->
      $scope.registrations = registrations

  $scope.processUser = (reg) ->
    if reg.user?
      if not reg.user.bag?.length
        c = $modal.open
          animation: true
          controller: 'BagChooser'
          backdrop: 'static'
          templateUrl: 'app/fast_track/choose_bag.html'
          resolve:
            bags: ->
              $scope.bags

        c.result.then (selectedItem) ->
          if not reg.user then reg.user = {}
          reg.user.bag = selectedItem
          $scope.updateUser reg
        , ->
          toastr.info "Bag not selected"
      else $scope.updateUser reg

  $scope.updateUser = (reg) ->
    # Update the Delegate Status and Bag Count
    reg.$doFastTrack().then (result) ->
      toastr.success "Update SUCCESSFUL!", "YIPEE!!!"
      $scope.registrations = []

.controller 'BagChooser', ($scope, $modalInstance, bags) ->

  $scope.bags = bags

  $scope.close = ->
    $modalInstance.dismiss 'close'

  $scope.selectBag = (index) ->
    $scope.selected = $scope.bags[index].name
    $modalInstance.close $scope.selected
