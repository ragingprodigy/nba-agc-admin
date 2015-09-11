'use strict'

angular.module 'nbaAgcAdminApp'
.controller 'SponsorsCtrl', ($scope, Sponsors, $modal) ->

  $scope.sponsors = Sponsors.query()

  $scope.sponsor = {}

  $scope.saveSponsor = (theForm) ->
    sponsor = new Sponsors $scope.sponsor

    sponsor.$save().then (response) ->
      theForm.$setPristine()
      $scope.sponsor = {}
      $scope.sponsors.push response
      $scope.newForm = false
    , (err) ->
      $scope.error = err.message

  $scope.showDetails = (id) ->
    $modal.open
      animation: true
      controller: 'SponsorCtrl'
      size: 'lg'
      backdrop: 'static'
      templateUrl: 'app/sponsors/sponsor.html'
      resolve:
        selectedSponsor: ->
          id

.controller 'SponsorCtrl', ($scope, $modalInstance, Sponsors, selectedSponsor, Registration) ->

  Sponsors.get id:selectedSponsor, (data) ->
    $scope.sponsor = data

  $scope.years = [2014..1960]

  $scope.saveSponsor = (theForm)->
    if theForm.$valid
      $scope.sponsor.$update id:selectedSponsor
      .then ->
        alert "Update Successful!"
        $scope.editingSponsor = false

  $scope.clearFormModels = ->
    $scope.lp =
      conferenceFee: 0
      sponsor: selectedSponsor
      accountCreated: true
      paymentSuccessful: true
      responseGotten: true
      statusConfirmed: true
      formFilled: true
      country: "NG"
      company: $scope.sponsor.name
      completed: true
      registrationType: 'legalPractitioner'

    $scope.other = angular.copy $scope.lp
    $scope.other.registrationType =  'others'

  $scope.newDelegate = (type) ->
    $scope.clearFormModels()
    $scope.delegateForm = true
    if type is 'lp' then $scope.data = $scope.lp else $scope.data = $scope.other

  $scope.addDelegate = (theForm) ->
    if theForm.$valid
      reg = new Registration $scope.data
      reg.$save().then (resp) ->
        $scope.sponsor._delegates.push resp
        alert "Op Successful!"
        $scope.data = {}
        theForm.$setPristine()
        $scope.delegateForm = false
      , (err) ->
        $scope.error = err.message

  $scope.editSponsor = ->
    $scope.editingSponsor = true

  $scope.close = ->
    $modalInstance.dismiss 'cancel'