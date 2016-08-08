'use strict'

describe 'Controller: MaterialsCtrl', ->

# load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  MaterialsCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    MaterialsCtrl = $controller 'MaterialsCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
