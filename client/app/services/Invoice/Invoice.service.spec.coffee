'use strict'

describe 'Service: Invoice', ->

  # load the service's module
  beforeEach module 'nbaAgcAdminApp'

  # instantiate service
  Invoice = undefined
  beforeEach inject (_Invoice_) ->
    Invoice = _Invoice_

  it 'should do something', ->
    expect(!!Invoice).toBe true
