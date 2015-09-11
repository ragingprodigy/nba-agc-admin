'use strict'

angular.module 'nbaAgcAdminApp', [
  'ngCookies'
  'ngResource'
  'ngSanitize'
  'ui.router'
  'ngStorage'
  'satellizer'
  'datatables'
  '720kb.datepicker'
  'ui.bootstrap'
  'ngFileUpload'
  'toastr'
  #'textAngular'
  'ui.bootstrap.datetimepicker'
  'ui.select'
]
.run ($auth, $rootScope, $window) ->
  $rootScope.$auth = $auth
  $rootScope.$user = $auth.getPayload()

  $rootScope.formatMoney = (m) ->
    parseInt(m).formatMoney 2

  $rootScope.ago = (dt) ->
    moment(dt).fromNow()

  $rootScope.countDelegates = (r) ->
    if not r? then 0
    else
      _.reduce r, (result, reg) ->
        return result + reg.registrations.length
      , 0

  $rootScope.$on '$stateChangeStart', (event, next) ->
    if not $auth.isAuthenticated() and next.requireLogin then $window.location.href = '/login'

.config ($stateProvider, $urlRouterProvider, $locationProvider, $authProvider, $httpProvider) ->

  $httpProvider.interceptors.push("requestInterceptor")

  $authProvider.logoutRedirect = '/login'
  $authProvider.loginOnSignup = false
  $authProvider.signupRedirect = false
  $authProvider.loginUrl = '/auth/login'
  $authProvider.signupUrl = '/auth/create'
  $authProvider.loginRoute = '/login'

  $authProvider.tokenPrefix = '__nba-admin__'

  $authProvider.platform = 'browser'
  $authProvider.storage = 'sessionStorage'

  $urlRouterProvider
  .otherwise '/individuals/successful'

  $locationProvider.html5Mode true

`Number.prototype.formatMoney = function(c, d, t){
    var n = this,
    s = n < 0 ? '-' : '';

  c = isNaN(c = Math.abs(c)) ? 2 : c;
  d = d === undefined ? '.' : d;
  t = t === undefined ? ',' : t;

  var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + '',
    j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : '');
}`