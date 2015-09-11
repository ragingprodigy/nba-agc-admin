'use strict'

describe 'Controller: NameTagsCtrl', ->

  # load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  NameTagsCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    NameTagsCtrl = $controller 'NameTagsCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
