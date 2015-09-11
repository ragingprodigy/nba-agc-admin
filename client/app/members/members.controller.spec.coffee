'use strict'

describe 'Controller: MembersCtrl', ->

  # load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  MembersCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    MembersCtrl = $controller 'MembersCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
