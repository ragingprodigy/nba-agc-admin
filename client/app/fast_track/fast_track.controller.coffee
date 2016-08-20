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

  $scope.branchCollected =(registrations,branchRep) ->
    branchUser = []
    _.each(registrations,(reg)->
      registrant = _.pick reg, ['email', 'mobile', 'firstName', 'branch','registrationCode']
      branchUser.push registrant
    )
    .$promise.then () ->
      Registration.BranchFastTracked branchRep, branchUser, ()->
        toastr.success 'Branch Successfully FastTracked'

  $scope.byBranch = (branch)->
    $scope.BranchRep = {
      id: branch._id
      repEmail:branch.repEmail,
      repPhone:branch.repPhone,
      repName:branch.repName
    }
    if branch.fastTracked is true
      $scope.BranchRep.fastTracked = branch.fastTracked
    if branch?
      Registration.Fast {paymentSuccessful:true,branch:branch.name, material:'branch',isGroup:false, vip:false }
      .$promise.then (registrations) ->
        $scope.registrations =  registrations

  $scope.byIndividual = (branch)->
    if branch?
      Registration.Fast {paymentSuccessful:true,branch:branch, material:'onsite',isGroup:false, vip:false }
      .$promise.then (registrations) ->
        $scope.registrations =  registrations

  $scope.bags = Bags.query()

  $scope.doLookup = ->
    $state.go 'fast_track.bySearch'
    Registration.fastTrack q: $scope.term
    .$promise.then (registrations) ->
      $scope.registrations = registrations

  $scope.processUser = (reg) ->
    if confirm 'Are you sure you want to fastTrack this Delegate?'
      if !reg.fastTracked
        registrant = _.pick reg, ['_id','email','surname', 'mobile', 'firstName', 'branch','registrationCode']
        registrant.fastTracked = true

        Registration.IndividualFastTracked id:registrant._id, registrant,(response) ->
          toastr.success response.message
          reg.fastTracked = true
          reg.fastTrackTime = response.fastTrackTime

#    if reg.user?
#      if not reg.user.bag?.length
#        c = $modal.open
#          animation: true
#          controller: 'BagChooser'
#          backdrop: 'static'
#          templateUrl: 'app/fast_track/choose_bag.html'
#          resolve:
#            bags: ->
#              $scope.bags
#
#        c.result.then (selectedItem) ->
#          if not reg.user then reg.user = {}
#          reg.user.bag = selectedItem
#          $scope.updateUser reg
#        , ->
#          toastr.info "Bag not selected"
#      else $scope.updateUser reg

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


.controller 'FastTrackGroupCtrl', ($scope,$modal,Invoice,Registration,toastr) ->
  Invoice.query { paymentSuccessful: true }
  .$promise.then (invoices) ->
    $scope.invoices = invoices

  $scope.showMembers = (r) ->
    $scope.selectedInvoice = r

  $scope.toggle = false

  $scope.individualView = ->
    Registration.Fast {paymentSuccessful:true,isGroup:true}
    .$promise.then (registrations) ->
      $scope.registrations =  registrations
  $scope.individualView()



  $scope.groupCollected =(r) ->
    groupUser = []
    _.each(r.registrations,(reg)->
      registrant = _.pick reg, ['email', 'mobile', 'firstName', 'branch','registrationCode']
      groupUser.push registrant
    )
    Invoice.GroupFastTracked {id:r._id,repEmail:r._group.email,repPhone:r._group.email}, groupUser, (response)->
        toastr.success response.message
        r.fastTracked = true
        r.fastTrackTime = response.fastTrackTime

.controller 'FastTrackVipCtrl', ($scope,Registration,toastr) ->
  $scope.processUser = (reg) ->
    if confirm 'Are you sure you want to fastTrack this Delegate?'
      if !reg.fastTracked
        registrant = _.pick reg, ['_id','email','surname', 'mobile', 'firstName', 'branch','registrationCode']
        registrant.fastTracked = true

        Registration.IndividualFastTracked id:registrant._id, registrant,(response) ->
          toastr.success response.message
          reg.fastTracked = true
          reg.fastTrackTime = response.fastTrackTime

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
