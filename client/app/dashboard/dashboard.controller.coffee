'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'DashboardCtrl', ($scope,$rootScope, Registration, Invoice, $state) ->
  $scope.user = $rootScope.$user

  Invoice.query().$promise.then (invoices) ->

    # All Confirmed Groups
    $scope.confirmedGroups = _.filter invoices, (i) ->
      i.statusConfirmed and i.paymentSuccessful
    .length

    # All Pending Groups
    $scope.pendingGroups = _.filter invoices, (i) ->
      not i.statusConfirmed and not i.paymentSuccessful and not i.responseGotten and (i.webpay or i.bankpay) and i.finalized
    .length

  Registration.stats().$promise.then (stats) ->

    $scope.stats = stats

    # All Confirmed Registrations
    """$scope.confirmed = _.filter registrations, (r)->
      r.statusConfirmed and r.paymentSuccessful
    .length

    # Confirmed Individuals
    $scope.confirmedIndividuals = _.filter registrations, (r)->
      not r.isGroup and r.statusConfirmed and r.paymentSuccessful
    .length

    # Confirmed Group Delegates
    $scope.confirmedDelegates = _.filter registrations, (r)->
      r.isGroup and r.statusConfirmed and r.paymentSuccessful
    .length

    # Pending Group Delegates
    $scope.pendingDelegates = _.filter registrations, (r)->
      r.isGroup and not r.statusConfirmed and not r.paymentSuccessful and not r.responseGotten
    .length

    # Confirmed Direct
    $scope.confirmedDirect = _.filter registrations, (r)->
      r.isDirect and r.statusConfirmed and r.paymentSuccessful
    .length

    # Pending Direct
    $scope.pendingDirect = _.filter registrations, (r)->
      r.isDirect and not r.statusConfirmed and not r.paymentSuccessful and not r.responseGotten
    .length

    # Confirmed WebPay
    $scope.confirmedWeb = _.filter registrations, (r)->
      not r.isDirect and r.webpay and r.statusConfirmed and r.paymentSuccessful
    .length

    # Pending WebPay
    $scope.pendingWeb = _.filter registrations, (r)->
      not r.isDirect and r.webpay and not r.statusConfirmed and not r.paymentSuccessful and not r.responseGotten
    .length

    # Confirmed Bank
    $scope.confirmedBank = _.filter registrations, (r)->
      not r.isDirect and r.bankpay and r.statusConfirmed and r.paymentSuccessful
    .length

    # Pending Bank
    $scope.pendingBank = _.filter registrations, (r)->
      not r.isDirect and r.bankpay and not r.statusConfirmed and not r.paymentSuccessful and not r.responseGotten
    .length"""
  $scope.dataSheetOffline = ->
    $state.go 'accessSheetOffline'
  $scope.dataSheetOnline = ->
    $state.go 'accessSheetOnline'
