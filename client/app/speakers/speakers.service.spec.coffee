'use strict'

describe 'Service: speakers', ->

  # load the service's module
  beforeEach module 'nbaAgcAdminApp'

  # instantiate service
  speakers = undefined
  beforeEach inject (_speakers_) ->
    speakers = _speakers_

  it 'should do something', ->
    expect(!!speakers).toBe true
