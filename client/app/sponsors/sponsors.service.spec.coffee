'use strict'

describe 'Service: sponsors', ->

  # load the service's module
  beforeEach module 'nbaAgcAdminApp'

  # instantiate service
  sponsors = undefined
  beforeEach inject (_sponsors_) ->
    sponsors = _sponsors_

  it 'should do something', ->
    expect(!!sponsors).toBe true
