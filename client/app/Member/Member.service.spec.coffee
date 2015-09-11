'use strict'

describe 'Service: Member', ->

  # load the service's module
  beforeEach module 'nbaAgcAdminApp'

  # instantiate service
  Member = undefined
  beforeEach inject (_Member_) ->
    Member = _Member_

  it 'should do something', ->
    expect(!!Member).toBe true
