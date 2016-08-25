'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'CertificatesCtrl', ($scope, Branch, $state) ->
  $scope.branches = Branch.list()

  $scope.doPrint = (branch) ->
    $state.go 'print_branch', branch: branch

.controller 'OnsiteCertificatesCtrl', ($scope, Branch, $state) ->
  $scope.branches = Branch.listOnsite()

  $scope.doPrint = (branch) ->
    $state.go 'print_onsite_branch', branch: branch

.controller 'PrintCtrl', ($scope, Branch, $stateParams) ->
  $scope.branch = $stateParams.branch
  $scope.data = []

  Branch.getPrintData branch: $stateParams.branch, (data) ->
    $scope.printData = data

    $scope.currentFirstPage = 1
    $scope.lastPage = $scope.printData.length
    $scope.showing = $scope.printData.length
    $scope.offset = 0

    $scope.prefaceList = angular.copy data

    while $scope.prefaceList.length > 45
      $scope.data.push $scope.prefaceList.splice 0, 45

    $scope.data.push $scope.prefaceList.splice 0, 45

  $scope.remove100 = ->
    $scope.offset += 1
    cPages = angular.element '.bp'
    i = 0
    while i < 100
      cPages[i].remove()
      i++

    $scope.showing = cPages.length
    $scope.currentFirstPage = ($scope.offset * 100) + 1

.controller 'PrintOnsiteCtrl', ($scope, Branch, $stateParams) ->
  $scope.branch = $stateParams.branch
  $scope.data = []

  Branch.getOnsitePrintData branch: $stateParams.branch, (data) ->
    $scope.printData = data

    $scope.currentFirstPage = 1
    $scope.lastPage = $scope.printData.length
    $scope.showing = $scope.printData.length
    $scope.offset = 0

    $scope.prefaceList = angular.copy data

    while $scope.prefaceList.length > 45
      $scope.data.push $scope.prefaceList.splice 0, 45

    $scope.data.push $scope.prefaceList.splice 0, 45

  $scope.remove100 = ->
    $scope.offset += 1
    cPages = angular.element '.bp'
    i = 0
    while i < 100
      cPages[i].remove()
      i++

    $scope.showing = cPages.length
    $scope.currentFirstPage = ($scope.offset * 100) + 1

.controller 'VipPrintCtrl', ($scope, Branch, $stateParams) ->
  $scope.branch = $stateParams.branch
  $scope.data = []

  Branch.getVipPrintData vip: $stateParams.type, (data) ->
    $scope.printData = data
    $scope.prefaceList = angular.copy data

    while $scope.prefaceList.length > 45
      $scope.data.push $scope.prefaceList.splice 0, 45

    $scope.data.push $scope.prefaceList.splice 0, 45

.controller 'CustomCertsController', ($scope, $state, $stateParams, Branch) ->
  $scope.printOne = false
  $scope.cert = {}

  Branch.query (branches) ->
    $scope.branches = branches

  $scope.printCerts = (form) ->
    if form.$valid
      $scope.printOne = true

  $scope.cancelPrint = ->
    $scope.printOne = false
    $scope.cert = {}
