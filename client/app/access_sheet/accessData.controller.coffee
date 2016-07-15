'use strict'
angular.module 'nbaAgcAdminApp'
.controller 'AccessSheetCtrl', ($scope,Registration,uiBlock,$modal,toastr) ->
  Registration.AccessIndex().$promise.then (bankData) ->
    $scope.bankData = bankData


  $scope.checkData =(m,index) ->
    d = {}
    if m.orderId isnt undefined
      d.code = m.orderId
    if m.email isnt undefined and m.email.match('@')
      d.email = m.email.toLowerCase()
    Registration.CheckData d
    .$promise.then (response) ->
      $scope.bankData[index].status = response.status
      if response.status is true
        $scope.bankData[index].registrationId = response._id

  $scope.processData = (m,index) ->
    d = {}
    d.bankpay = true
    d.bankDeposit = m.AmountRemitted.replace(',','')
    d.bankTeller = m.DepositSlipNo
    date = m.PaymentRef.split('|')
    d.bankDatePaid =date[1]
    d.PaymentRef = m.PaymentRef
    d.completed = true
    d.formFilled = true
    d.webpay = false

    if m.registrationId? and m.registrationId isnt '' and confirm "Are you sure want to update this Registration?"
      d.isDirect = false
      Registration.update {id: m.registrationId}, d,(data) ->
        if data.statusConfirmed = true and data.paymentSuccessful = true
          m.resolved = true
          Registration.Resolve m, (resp) ->
            console.log(resp)
            if resp.id
              toastr.success "Registration Was Updated Successfully"
        else toastr.error "Registration Could Not Be Updated"
