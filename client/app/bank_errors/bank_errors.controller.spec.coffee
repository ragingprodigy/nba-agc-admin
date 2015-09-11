'use strict'

describe 'Controller: BankErrorsCtrl', ->

  # load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  BankErrorsCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    BankErrorsCtrl = $controller 'BankErrorsCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
