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
      console.log response

