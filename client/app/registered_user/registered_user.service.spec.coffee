'use strict'

describe 'Service: registeredUser', ->

  # load the service's module
  beforeEach module 'nbaAgcAdminApp'

  # instantiate service
  registeredUser = undefined
  beforeEach inject (_registeredUser_) ->
    registeredUser = _registeredUser_

  it 'should do something', ->
    expect(!!registeredUser).toBe true
