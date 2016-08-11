'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'CustomTagPrinterCtrl', ($scope, Registration, toastr) ->
  $scope.tag = {}

  $scope.doingPrint = false

  $scope.printTags = (form) ->
    if form.$valid
      $scope.doingPrint = true

  $scope.cancelPrint = ->
    $scope.doingPrint = false
    $scope.tag = {}

  $scope.registerAndPrint = (form) ->
    if form.$valid
      Registration.createOfflineReg $scope.tag, (response) ->
        $scope.printTags form
        toastr.info response.surname+' was created Onsite!'
      , (e) ->
        $scope.doingPrint = false
        toastr.error 'Data was not saved..please try again!'
        console.error e.data.err