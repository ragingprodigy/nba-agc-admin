'use strict'

angular.module 'nbaAgcAdminApp'
.factory 'requestInterceptor', ($q, uiBlock) ->

  #This will be called on every outgoing http request
  request: (config)->
    if config.url.match(new RegExp('api/')) then uiBlock.block 'html'

    config || $q.when(config)

  requestError: (rejectReason) ->
    #Unblock the UI
    uiBlock.clear()
    rejectReason

  response: (response) ->
    #Unblock the UI
    uiBlock.clear()
    response

  # This will be called on every incoming response that has en error status code
  responseError: (response) ->
    #Unblock the UI
    uiBlock.clear()

    $q.reject(response)
