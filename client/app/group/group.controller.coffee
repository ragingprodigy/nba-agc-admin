'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'GroupCtrl', ($scope,$modal,Invoice) ->
  # Fetch Confirmed Registrations
  Invoice.query { statusConfirmed: true }
  .$promise.then (invoices) ->
    $scope.invoices = invoices

  $scope.showMembers = (r) ->
    $scope.selectedInvoice = r

.controller 'PendingInvoicesCtrl', ($scope, Invoice, $state) ->

  # Fetch Confirmed Registrations
  Invoice.query { statusConfirmed: false, responseGotten: false, finalized: true }
  .$promise.then (invoices) ->
    $scope.invoices = invoices

  $scope.showMembers = (r) ->
    $scope.selectedInvoice = r

  $scope.updateBank = (reg) ->
    $state.go 'group.pending.update', id: reg._id if reg.bankpay

.controller 'PendingInvoicesUpdateCtrl', ($scope, Invoice, $stateParams, $state) ->

  if $stateParams.id?
    Invoice.get id: $stateParams.id
    .$promise.then (invoice) ->
      if not invoice.bankpay then $scope.cancel()
      else
        $scope.invoice = invoice
        $scope.invoice.bankDatePaid = new Date $scope.invoice.bankDatePaid

  else $scope.cancel()

  $scope.cancel = ->
    $state.go 'group.pending'

  $scope.updateBank = (form)->
    if form.$valid
      $scope.invoice._group = $scope.invoice._group._id

      Invoice.update id:$scope.invoice._id, $scope.invoice, ->
        alert 'Update Successful!'
        $scope.cancel()
      , (error) ->
        console.log 'Error while Updating Record: ', error
        $scope.error = error.data.message

.controller 'WebInvoicesCtrl', ($scope, Invoice) ->

  # Fetch Confirmed Registrations
  Invoice.query { statusConfirmed: true, responseGotten: true, finalized: true, webpay: true }
  .$promise.then (invoices) ->
    $scope.invoices = invoices

  $scope.showMembers = (r) ->
    $scope.selectedInvoice = r

.controller 'WebInvoiceFailedCtrl', ($scope, Invoice) ->

  # Fetch Confirmed Registrations
  Invoice.query { statusConfirmed: false, responseGotten: true, finalized: true, webpay: true }
  .$promise.then (invoices) ->
    $scope.invoices = invoices

  $scope.showMembers = (r) ->
    $scope.selectedInvoice = r

.controller 'BankInvoiceSuccessCtrl', ($scope, Invoice) ->

  # Fetch Confirmed Registrations
  Invoice.query { statusConfirmed: true, responseGotten: true, finalized: true, bankpay: true }
  .$promise.then (invoices) ->
    $scope.invoices = invoices

  $scope.showMembers = (r) ->
    $scope.selectedInvoice = r
.controller 'BankGroupCtrl', ($scope,Users, Invoice, $modal, toastr,RegisteredUser,Registration,Branch) ->
# Fetch Direct bank Group Registrations
  $scope.load = ->
    Invoice.query {paymentSuccessful:false,isDirect:true}
    .$promise.then (groups) ->
      $scope.groups = groups

  $scope.load()
  $scope.newGroup = {
  }
  $scope.selectedGroup = {
  }
  $scope.newDelegate = {
  }
  $scope.paymentDetails = {
  }

  Branch.query {}
  .$promise.then (branches) ->
    $scope.branchData = branches

  $scope.years = [1960..2015]
  $scope.category = [
    {name:'Legal Practitioner', value:'legalPractitioner'},
    {name:'SANs, Honorable, AGs & Benchers', value:'sanAndBench'},
    {name:'Non Lawyers', value:'non_lawyer'},
    {name:'Law Students', value:'law_students'},
    {name:'Magistrate & Other Judicial Officers', value:'magistrate'},
    {name:'Governor & political Appointees', value:'others'},
    {name:'Honorable Justices, Judges & Khadis', value:'judge'}
  ]

  $scope.createGroup = ->
    Users.create $scope.newGroup,(user)->
      if user.message
        toastr.info user.message
      else if user._id
        groupInvoice = {}
        groupInvoice.isDirect = true
        groupInvoice.bankpay = true
        groupInvoice.finalized = true
        groupInvoice._group = user._id

        invoice = new Invoice groupInvoice
        invoice.$save (v)->
          toastr.success 'Group User Created Successfully With Invoice'
          $scope.closeModal()
          $scope.load()
        $scope.newGroup = {}


  $scope.closeModal = ->
    $scope.modal.dismiss()

  $scope.groupForm = ->
    $scope.modal = $modal.open
      templateUrl: "app/group/newGroup.html"
      scope: $scope
      backdrop: 'static'

  $scope.payment = (g)->
    $scope.selectedGroup = {}
    $scope.selectedGroup = g
    $scope.modal = $modal.open
      templateUrl: "app/group/paymentForm.html"
      scope: $scope
      backdrop: 'static'

  $scope.addDelegates =(g) ->
    $scope.selectedGroup = {}
    $scope.selectedGroup = g
    $scope.modal = $modal.open
      templateUrl: "app/group/newDelegates.html"
      scope: $scope
      backdrop: 'static'

#  $scope.getAndUpdateUser =(groupId) ->
#    RegisteredUser.get id:groupId
#    .$promise.then (groupDetails) ->


  $scope.createDelegate = ->
#    currentYear = new Date().getFullYear()
#    atThebar = currentYear - $scope.newDelegate.yearCalled
    $scope.newDelegate.isDirect = true
    $scope.newDelegate.completed = true
    $scope.newDelegate.formFilled = true
    $scope.newDelegate.bankpay = true
    $scope.newDelegate.isGroup = true
    $scope.newDelegate.owner = $scope.selectedGroup._group._id


    registration = new Registration $scope.newDelegate
    registration.$save (user)->
      console.log  $scope.newDelegate
      Invoice.query {_group:$scope.newDelegate.owner,justOne:true}
      .$promise.then (invoice) ->
        delete invoice[0]._group
        groupInvoice = invoice[0]
        groupInvoice.notPaid =true
        groupInvoice.registrations.push(user._id)
        Invoice.update id:groupInvoice._id, groupInvoice, ->
          toastr.success 'Delegate Successfully created'
          $scope.closeModal()
          $scope.newDelegate = {}
          $scope.load()
    ,(err) ->
      console.log(err)

  $scope.submitPayment = ->
    $scope.paymentDetails.invoiceAmount = $scope.paymentDetails.bankDeposit
#    console.log $scope.paymentDetails
    Invoice.update id:$scope.selectedGroup._id, $scope.paymentDetails, ->
      toastr.success 'Group payment Has been Updated And Confirmed'
      $scope.closeModal()
      $scope.selectedGroup = {}
      $scope.load()
