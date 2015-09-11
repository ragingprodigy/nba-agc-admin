'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'MembersCtrl', ($scope, Member) ->
  $scope.term = ''

  $scope.doLookup = ->
    Member.query name: $scope.term
    .$promise.then (members) ->
      $scope.members = members


.controller 'MemberEditCtrl', ($scope, $stateParams, $state, Member) ->

  if not $stateParams.id? then $scope.cancel()

  $scope.member = Member.get id: $stateParams.id

  $scope.years = [2014..1960]

  $scope.cancel = ->
    $state.go 'members'

  $scope.updateMember = (form) ->

    if form.$valid
      Member.update id: $stateParams.id, $scope.member, ->
        alert 'Update Complete'
        $scope.cancel()
      , (error) ->
        console.log 'Error updating member info: ', error
        $scope.error = error.data.message