'use strict'

describe 'Controller: SponsorsCtrl', ->

  # load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  SponsorsCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    SponsorsCtrl = $controller 'SponsorsCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
