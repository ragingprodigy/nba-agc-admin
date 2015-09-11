'use strict'

describe 'Controller: UserAccountsCtrl', ->

  # load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  UserAccountsCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    UserAccountsCtrl = $controller 'UserAccountsCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
