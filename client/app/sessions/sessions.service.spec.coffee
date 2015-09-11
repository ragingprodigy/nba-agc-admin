'use strict'

describe 'Service: sessions', ->

  # load the service's module
  beforeEach module 'nbaAgcAdminApp'

  # instantiate service
  sessions = undefined
  beforeEach inject (_sessions_) ->
    sessions = _sessions_

  it 'should do something', ->
    expect(!!sessions).toBe true
