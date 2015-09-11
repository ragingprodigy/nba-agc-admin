'use strict'

angular.module 'nbaAgcAdminApp'
.service 'Sessions', ($resource)->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  $resource '/api/sessions/:id', null,
    update: method:'PUT'
    addPaper:
      method: 'POST'
      url: '/api/sessions/:id/papers'
      params:
        id:'@_id'
    deletePaper:
      method: 'DELETE'
      url: '/api/sessions/:id/papers/:paperId'
      params:
        id:'@_id'
        paperId:'@paperId'
    deleteQuestion:
      method: 'DELETE'
      url: '/api/sessions/:id/questions/:questionId'
      params:
        id:'@_id'
        questionId:'@questionId'