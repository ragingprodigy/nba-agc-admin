'use strict'
angular.module 'nbaAgcAdminApp'
.controller 'AccessSheetCtrl', ($scope,$rootScope,Registration,uiBlock,$modal,Member,FeeCalculator,toastr) ->
  $scope.load = ->
    d = {}
    $scope.user = $rootScope.$user
    if $scope.user.name != 'Kemi Beatrice'
      d.dataType = 'online'
    else d.dataType = 'offline'
    Registration.AccessIndex d
    .$promise.then (bankData) ->
      $scope.bankData = bankData

  $scope.load()

  $scope.deleted =(m,index) ->
    if confirm "Are you sure you want to delete this data?"
      m.deleted = true
      Registration.Resolve m, (resp) ->
        if resp.id
          $scope.bankData[index].deleted = true
          toastr.success "Access Bank Data Has Been Deleted"

  $scope.checkData =(m,index) ->
    d = {}
    d.PaymentRef = m.PaymentRef
    if m.OrderId isnt undefined
      code = m.OrderId.split('-');
      d.code = code[0]
    if m.email? and m.email.match('@') and m.email isnt ''
      d.email = m.email.toLowerCase()
    Registration.CheckData d
    .$promise.then (response) ->
      $scope.bankData[index].status = response.status
      $scope.bankData[index].payment = response.paymentStatus
      if response.status is true
        $scope.bankData[index].registrationId = response._id

  $scope.processData = (m,index) ->
    uiBlock.block
    d = {}
    d.bankpay = true
    d.bankDeposit = m.AmountRemitted.replace(',','')
    d.bankTeller = m.DepositSlipNo
    date = m.PaymentRef.split('|')
    d.bankDatePaid =moment(date[1],"DD-MMM-YYYY").format('ll')
    if moment(d.bankDatePaid).isBefore(moment("23-jul-2016","DD-MMM-YYYY").format('ll'))
      category = m.Category.toLowerCase()
      if category.indexOf('legal') != -1
        if category.indexOf('1-5') != -1
          d.conferenceFee = 8000
        if category.indexOf('6-10') != -1
          d.conferenceFee = 15000
        if category.indexOf('11-14') != -1
          d.conferenceFee = 20000
        if category.indexOf('15-20') != -1
          d.conferenceFee = 30000
        if category.indexOf('above') != -1
          d.conferenceFee = 50000
        if category.indexOf('magistrate') != -1
          d.registrationType = 'magistrate'
      if category.indexOf('sans') != -1
        d.conferenceFee = 100000
      if category.indexOf('magistrate') != -1
        d.conferenceFee = 50000
      if category.indexOf('student') != -1
        d.conferenceFee = 4500
      if category.indexOf('international') != -1
        d.conferenceFee = 500
      if category.indexOf('judge') != -1
        d.conferenceFee = 75000
      if category.indexOf('non') != -1
        d.conferenceFee = 50000
      if category.indexOf('politic') != -1
        d.conferenceFee = 250000
    if moment(d.bankDatePaid).isAfter(moment("23-jul-2016","DD-MMM-YYYY").format('ll'))
      category = m.Category.toLowerCase()
      if category.indexOf('legal') != -1
          if category.indexOf('1-5') != -1
            d.conferenceFee = 10000
          if category.indexOf('6-10') != -1
            d.conferenceFee = 20000
          if category.indexOf('11-14') != -1
            d.conferenceFee = 30000
          if category.indexOf('15-20') != -1
            d.conferenceFee = 40000
          if category.indexOf('above') != -1
            d.conferenceFee = 65000
      if category.indexOf('sans') != -1
        d.conferenceFee = 120000
      if category.indexOf('magistrate') != -1
        d.conferenceFee = 50000
      if category.indexOf('student') != -1
        d.conferenceFee = 4500
      if category.indexOf('international') != -1
        d.conferenceFee = 750
      if category.indexOf('judge') != -1
        d.conferenceFee = 75000
      if category.indexOf('non') != -1
        d.conferenceFee = 50000
      if category.indexOf('politic') != -1
        d.conferenceFee = 250000
    if moment(d.bankDatePaid).isAfter(moment("17-aug-2016","DD-MMM-YYYY").format('ll'))
      category = m.Category.toLowerCase()
      if category.indexOf('legal') != -1
        if category.indexOf('1-5') != -1
          d.conferenceFee = 15000
        if category.indexOf('6-10') != -1
          d.conferenceFee = 25000
        if category.indexOf('11-14') != -1
          d.conferenceFee = 38000
        if category.indexOf('15-20') != -1
          d.conferenceFee = 48000
        if category.indexOf('above') != -1
          d.conferenceFee = 80000
      if category.indexOf('sans') != -1
        d.conferenceFee = 150000
      if category.indexOf('student') != -1
        d.conferenceFee = 4500
      if category.indexOf('international') != -1
        d.conferenceFee = 1000
      if category.indexOf('judge') != -1
        d.conferenceFee = 75000
      if category.indexOf('non') != -1
        d.conferenceFee = 50000
      if category.indexOf('politic') != -1
        d.conferenceFee = 250000
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
            if resp.id
              toastr.success "Registration Was Updated Successfully"
        else toastr.error "Registration Could Not Be Updated Because User Failed"
    if (m.registrationId is undefined or m.registrationId is '') and confirm "Are you sure you want to create new
 registration
 data"
      d.isDirect = true
      category = m.Category.toLowerCase()
      if category.indexOf('legal') != -1
          d.registrationType = 'legalPractitioner'
      if category.indexOf('magistrate') != -1
          d.registrationType = 'magistrate'
      if category.indexOf('sans') != -1
          d.registrationType = 'sanAndBench'
      if category.indexOf('student') != -1
          d.registrationType = 'law_students'
      if category.indexOf('international') != -1
          d.registrationType = 'international'
      if category.indexOf('judge') != -1
          d.registrationType = 'judge'
      if category.indexOf('non') != -1
          d.registrationType = 'non_lawyer'
      if category.indexOf('politic') != -1
          d.registrationType = 'others'
      d.accountCreated = false
      d.isGroup = false
      d.material = 'branch'
      d.yearCalled = m.YearCalled
      d.nbaId = m.EnrolmentNo
      branch = m.Branch.trim().replace('-',' ')
      branch = branch.toUpperCase()
      if branch is 'ABUJA'
        branch = 'ABUJA (UNITY BAR)'
      d.branch = branch
      d.company = m.Organization
      d.address = m.Address
      d.mobile = m.MobileNumber.toString()
      d.email = m.email
      d.prefix = m.Prefix
      d.suffix = m.Suffix
      d.middleName = m.Call_MiddleName
      d.surname = m.Call_Surname
      d.firstName = m.Call_FirstName

      registration = new Registration d
      registration.$save (data)->
        if data._id
          m.done = true
          m.resolved = true
          toastr.success "Registration Successfully Created"
          Registration.Resolve m, (resp) ->

        else toastr.error "Sorry We Could Not create This Registration"
      , (err) ->
        toastr.error "A Server Error Has Occurred Please Contact The System Administrator"
        console.log err
    uiBlock.clear

  $scope.processOnline = (m,index) ->
    d = {}
    d.bankpay = true
    d.bankDeposit = m.AmountRemitted.replace(',','')
    d.bankTeller = m.DepositSlipNo
    date = m.PaymentRef.split('|')
    d.bankDatePaid =moment(date[1],"DD-MMM-YYYY").format('ll')
    if moment(d.bankDatePaid).isBefore(moment("23-jul-2016","DD-MMM-YYYY").format('ll'))
      category = m.Category.toLowerCase()
      if category.indexOf('legal') != -1
        if category.indexOf('1-5') != -1
          d.conferenceFee = 8000
        if category.indexOf('6-10') != -1
          d.conferenceFee = 15000
        if category.indexOf('11-14') != -1
          d.conferenceFee = 20000
        if category.indexOf('15-20') != -1
          d.conferenceFee = 30000
        if category.indexOf('above') != -1
          d.conferenceFee = 50000
        if category.indexOf('magistrate') != -1
          d.registrationType = 'magistrate'
      if category.indexOf('sans') != -1
        d.conferenceFee = 100000
      if category.indexOf('magistrate') != -1
        d.conferenceFee = 50000
      if category.indexOf('student') != -1
        d.conferenceFee = 4500
      if category.indexOf('international') != -1
        d.conferenceFee = 500
      if category.indexOf('judge') != -1
        d.conferenceFee = 75000
      if category.indexOf('non') != -1
        d.conferenceFee = 50000
      if category.indexOf('politic') != -1
        d.conferenceFee = 250000
    if moment(d.bankDatePaid).isAfter(moment("23-jul-2016","DD-MMM-YYYY").format('ll'))
      category = m.Category.toLowerCase()
      if category.indexOf('legal') != -1
        if category.indexOf('1-5') != -1
          d.conferenceFee = 10000
        if category.indexOf('6-10') != -1
          d.conferenceFee = 20000
        if category.indexOf('11-14') != -1
          d.conferenceFee = 30000
        if category.indexOf('15-20') != -1
          d.conferenceFee = 40000
        if category.indexOf('above') != -1
          d.conferenceFee = 65000
      if category.indexOf('sans') != -1
        d.conferenceFee = 120000
      if category.indexOf('magistrate') != -1
        d.conferenceFee = 50000
      if category.indexOf('student') != -1
        d.conferenceFee = 4500
      if category.indexOf('international') != -1
        d.conferenceFee = 750
      if category.indexOf('judge') != -1
        d.conferenceFee = 75000
      if category.indexOf('non') != -1
        d.conferenceFee = 50000
      if category.indexOf('politic') != -1
        d.conferenceFee = 250000
    if moment(d.bankDatePaid).isAfter(moment("17-aug-2016","DD-MMM-YYYY").format('ll'))
      category = m.Category.toLowerCase()
      if category.indexOf('legal') != -1
        if category.indexOf('1-5') != -1
          d.conferenceFee = 15000
        if category.indexOf('6-10') != -1
          d.conferenceFee = 25000
        if category.indexOf('11-14') != -1
          d.conferenceFee = 38000
        if category.indexOf('15-20') != -1
          d.conferenceFee = 48000
        if category.indexOf('above') != -1
          d.conferenceFee = 80000
      if category.indexOf('sans') != -1
        d.conferenceFee = 150000
      if category.indexOf('student') != -1
        d.conferenceFee = 4500
      if category.indexOf('international') != -1
        d.conferenceFee = 1000
      if category.indexOf('judge') != -1
        d.conferenceFee = 75000
      if category.indexOf('non') != -1
        d.conferenceFee = 50000
      if category.indexOf('politic') != -1
        d.conferenceFee = 250000
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
            if resp.id
              toastr.success "Registration Was Updated Successfully"
        else toastr.error "Registration Could Not Be Updated"

  $scope.checkSCN = (m) ->
    d = {
      firstName: m.Call_FirstName,
      surname: m.Call_Surname
    }
    Member.findName d
    .$promise.then (resp) ->
      console.log(resp)

  $scope.editMember =(m) ->
    $scope.selectedMember = m
    $scope.modal = $modal.open
      templateUrl: "app/access_sheet/accessDataEdit.html"
      scope: $scope
      backdrop: 'static'

  $scope.UpdateRegistration = ->
    Registration.Resolve $scope.selectedMember, (resp) ->
      if resp.id
        toastr.info "Data Has Been Updated"
        $scope.closeModal()
      else toastr.error "Data Could Not Be Updated"

  $scope.closeModal = ->
    $scope.modal.dismiss()
    $scope.selectedMember = null

