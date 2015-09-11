'use strict'

describe 'Controller: FastTrackCtrl', ->

  # load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  FastTrackCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    FastTrackCtrl = $controller 'FastTrackCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
