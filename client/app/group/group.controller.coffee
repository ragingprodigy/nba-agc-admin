'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'GroupCtrl', ($scope,$modal,Invoice) ->
  $scope.closeModal = ->
    $scope.modal.dismiss()

  $scope.groupForm = ->
    alert 'i got here'
    $scope.modal = $modal.open
      templateUrl: "app/group/newGroup.html"
      scope: $scope
      backdrop: 'static'

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
