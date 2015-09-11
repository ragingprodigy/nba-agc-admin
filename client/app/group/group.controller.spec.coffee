'use strict'

describe 'Controller: GroupCtrl', ->

  # load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  GroupCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    GroupCtrl = $controller 'GroupCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
