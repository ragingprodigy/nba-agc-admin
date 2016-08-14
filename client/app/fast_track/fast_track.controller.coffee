'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'FastTrackCtrl', ($scope, Registration,Branch, $modal,$state, toastr, Bags) ->
  $scope.term = ''

  $scope.load = ->
    Branch.query {}
    .$promise.then (branches) ->
      if branches?
        $scope.branchData = branches
  $scope.load()
  $scope.byBranch = (branch)->
    if branch?
      Registration.Fast {paymentSuccessful:true,branch:branch, material:'branch',isGroup:false, vip:false }
      .$promise.then (registrations) ->
        $scope.registrations =  registrations

  $scope.byIndividual = (branch)->
    if branch?
      Registration.Fast {paymentSuccessful:true,branch:branch, material:'onsite',isGroup:false, vip:false }
      .$promise.then (registrations) ->
        $scope.registrations =  registrations

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


.controller 'FastByGroupCtrl', ($scope,$modal,Invoice) ->
  Invoice.query { statusConfirmed: true }
  .$promise.then (invoices) ->
    $scope.invoices = invoices

  $scope.showMembers = (r) ->
    $scope.selectedInvoice = r

.controller 'FastTrackVipCtrl', ($scope,Registration) ->
  $scope.condition = {}
  $scope.byVip = ->
    $scope.condition.paymentSuccessful=true;
    $scope.condition.vip = true;
    $scope.condition.isGroup = false;
    Registration.Fast $scope.condition
    .$promise.then (registrations) ->
      $scope.registrations =  registrations
  $scope.byVip()
  $scope.category = [
    {name:'SANs, Honorable, AGs & Benchers', value:'sanAndBench'},
    {name:'Magistrate & Other Judicial Officers', value:'magistrate'},
    {name:'Governor & Political Appointees', value:'others'},
    {name:'Honorable Justices, Judges & Khadis', value:'judge'}
  ]
