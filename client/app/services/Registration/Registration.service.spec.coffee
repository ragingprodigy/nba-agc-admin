'use strict'

describe 'Service: Registration', ->

  # load the service's module
  beforeEach module 'nbaAgcAdminApp'

  # instantiate service
  Registration = undefined
  beforeEach inject (_Registration_) ->
    Registration = _Registration_

  it 'should do something', ->
    expect(!!Registration).toBe true
