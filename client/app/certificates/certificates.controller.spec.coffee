'use strict'

describe 'Controller: CertificatesCtrl', ->

  # load the controller's module
  beforeEach module 'nbaAgcAdminApp'
  CertificatesCtrl = undefined
  scope = undefined

  # Initialize the controller and a mock scope
  beforeEach inject ($controller, $rootScope) ->
    scope = $rootScope.$new()
    CertificatesCtrl = $controller 'CertificatesCtrl',
      $scope: scope

  it 'should ...', ->
    expect(1).toEqual 1
