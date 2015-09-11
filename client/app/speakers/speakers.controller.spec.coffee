'use strict'

describe 'Controller: SpeakersCtrl', ->

  # load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  SpeakersCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    SpeakersCtrl = $controller 'SpeakersCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
