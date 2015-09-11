'use strict'

describe 'Service: bags', ->

  # load the service's module
  beforeEach module 'nbaAgcAdminApp'

  # instantiate service
  bags = undefined
  beforeEach inject (_bags_) ->
    bags = _bags_

  it 'should do something', ->
    expect(!!bags).toBe true
