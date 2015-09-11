'use strict'

describe 'Service: AWS', ->

  # load the service's module
  beforeEach module 'nbaAgcAdminApp'

  # instantiate service
  AWS = undefined
  beforeEach inject (_AWS_) ->
    AWS = _AWS_

  it 'should do something', ->
    expect(!!AWS).toBe true
