'use strict'

describe 'Controller: CustomTagPrinterCtrl', ->

  # load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  CustomTagPrinterCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    CustomTagPrinterCtrl = $controller 'CustomTagPrinterCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
