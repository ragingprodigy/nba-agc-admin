'use strict'

describe 'Controller: SessionsCtrl', ->

  # load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  SessionsCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    SessionsCtrl = $controller 'SessionsCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
