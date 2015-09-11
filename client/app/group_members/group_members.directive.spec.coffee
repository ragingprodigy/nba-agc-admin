'use strict'

describe 'Directive: groupMembers', ->

  # load the directive's module and view
  beforeEach module 'nbaAgcAdminApp'
  beforeEach module 'app/group_members/group_members.html'
  element = undefined
  scope = undefined
  beforeEach inject ($rootScope) ->
    scope = $rootScope.$new()

  it 'should make hidden element visible', inject ($compile) ->
    element = angular.element '<group-members></group-members>'
    element = $compile(element) scope
    scope.$apply()
    expect(element.text()).toBe 'this is the groupMembers directive'

