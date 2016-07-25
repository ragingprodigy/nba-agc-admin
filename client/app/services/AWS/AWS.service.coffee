'use strict'

angular.module 'nbaAgcAdminApp'
.service 'AWS', ($resource, Upload, $rootScope) ->
  # AngularJS will instantiate a singleton by calling 'new' on this function
  backend:
    $resource '/s3Upload'

  upload: (file, folder, callback) ->
    url = "https://nba-agc.s3.amazonaws.com/"
    if not file.type? then fileType = 'application/octect-stream' else fileType = file.type

    # Sign the request first
    this.backend.get
      mimeType: fileType
      type: folder
    , (response) ->

      tm = new Date().getTime()
      fileNameAfterUpload = "#{btoa(tm).substring 0, 8}_#{tm}#{file.name.substr file.name.lastIndexOf '.' }"

      Upload.upload
        url: url
        skipAuthorization: true
        method: 'POST'
        fields :
          key: "#{folder}#{fileNameAfterUpload}"
          AWSAccessKeyId: response.AWSAccessKeyId
          acl: 'public-read'
          policy: response.s3Policy
          signature: response.s3Signature
          "Content-Type": fileType
        file: file
      .progress (evt) ->
        $rootScope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total)
      .success ->
        callback null, "#{url+folder+fileNameAfterUpload}"
      .error (data) ->
        callback data
