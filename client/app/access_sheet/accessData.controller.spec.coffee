'use strict'

describe 'Controller: AccessSheetCtrl', ->

# load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  AccessSheetCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    AccessSheetCtrl = $controller 'AccessSheetCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
