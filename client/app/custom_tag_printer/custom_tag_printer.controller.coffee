'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'CustomTagPrinterCtrl', ($scope) ->
  $scope.nameTags = [
    {}
    {}
  ]

  $scope.doingPrint = false

  $scope.printTags = (form) ->
    if form.$valid
      $scope.doingPrint = true

  $scope.cancelPrint = ->
    $scope.doingPrint = false
    $scope.nameTags = [
      {}
      {}
    ]