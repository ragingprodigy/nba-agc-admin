'use strict'

describe 'Controller: BranchEditorCtrl', ->

  # load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  BranchEditorCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    BranchEditorCtrl = $controller 'BranchEditorCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
