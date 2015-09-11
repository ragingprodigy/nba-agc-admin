'use strict'

describe 'Controller: OfflineRegistrationsCtrl', ->

  # load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  OfflineRegistrationsCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    OfflineRegistrationsCtrl = $controller 'OfflineRegistrationsCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
