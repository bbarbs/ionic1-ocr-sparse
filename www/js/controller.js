angular.module('ocr_trial.controller', [])

.controller('ScanCtrl', function ($scope, $rootScope, $state, $http, $ionicPopup, $ionicBackdrop, $ionicPopover, $cordovaNetwork, $ionicLoading, $timeout, Utility) {
    // Image file.
    $scope.imageToUpload = null;
    // Programmatically hide floatin buttons.
    $scope.closeMfbButton = closed;

    // Take image.
    $scope.processImage = function (index) {
        // Image source, from camera or album.
        var sourceType = index === 0 ? Camera.PictureSourceType.PHOTOLIBRARY : Camera.PictureSourceType.CAMERA;
        // Camera options.
        var options = {
            quality: 100,
            targetWidth: 640,
            targetHeight: 640,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            encodingType: Camera.EncodingType.JPEG,
            saveToPhotoAlbum: true,
            correctOrientation: true
        };
        // Success callback.
        function onSuccess(imageData) {
            // Display image to img tag.
            var image = document.getElementById('pic');
            image.src = "data:image/jpeg;base64," + imageData;
            // Get base64 string.
            $scope.imageToUpload = "data:image/jpeg;base64," + imageData;
        }
        // Error callback.
        function onFail(message) {
            console.error('Error: ' + message);
        }
        // Do getpicture.
        navigator.camera.getPicture(onSuccess, onFail, options);
    };

    // Choose photo.
    $scope.choosePhoto = function () {
        $scope.closeMfbButton = closed;
        $timeout(function () {
            $scope.processImage(0);
        }, 650);
    };

    // Take photo.
    $scope.takePhoto = function () {
        $scope.closeMfbButton = closed;
        $timeout(function () {
            $scope.processImage(1);
        }, 600);
    };

    // Extract text from image.
    $scope.extractText = function () {
        try {
            // Clear text.
            $rootScope.ocrMessage = '';
            // Close buttons.
            $scope.closeMfbButton = closed;
            // Show network error if offline.
            if ($cordovaNetwork.isOffline()) {
                // Show connection error message.
                Utility.showToast('network_error');
            } else if ($scope.imageToUpload === null) {
                // Show message that no image display.
                Utility.showToast('no_image');
            } else {
                // Show loading bar.
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner><span style="font-size: 12px; float: right; margin: 0 0 0 15px; padding: 5px;">Extracting....</span>'
                });
                // Form data for ajax.
                var formData = new FormData();
                formData.append("file", Utility.imageURItoBlob($scope.imageToUpload), "upload_image.jpeg");
                formData.append("url", "");
                formData.append("language", "eng");
                formData.append("apikey", "helloworld");

                // Do http request.
                $http.post('https://ocr.space/api/Parse/Image', formData, {
                        headers: {
                            'Content-Type': undefined
                        },
                        transformRequest: function (data) {
                            return data;
                        }
                    })
                    .then(function (res) {
                            // Hide loading bar on success.
                            $timeout(function () {
                                $ionicLoading.hide();
                            }, 500);

                            // Loop to results.
                            angular.forEach(res.data.ParsedResults, function (item) {
                                // Get parse code.
                                var exitCode = item.FileParseExitCode;

                                switch (exitCode) {
                                case 1:
                                    // Get parse result.
                                    $rootScope.ocrMessage = item.ParsedText;
                                    // Display toast message.
                                    Utility.showToast('success_scanning');
                                    break;
                                case 0:
                                case -10:
                                case -20:
                                case -30:
                                case -99:
                                default:
                                    // Get error message.
                                    $rootScope.ocrMessage += "Error: " + item.ErrorMessage;
                                    // Display error message.
                                    Utility.showToast('error_scanning');
                                    break;
                                }
                            });
                            // Display result.
                            $state.go('ocr.info');
                        },
                        function (err) {
                            // Hide loading bar on error.
                            $timeout(function () {
                                $ionicLoading.hide();
                            }, 500);
                            console.error(err);
                        });
            }
        } catch (err) {
            $timeout(function () {
                $ionicLoading.hide();
            }, 500);
            console.error(err);
        }
    };

    // Popover template.
    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope
    }).then(function (popover) {
        $scope.popover = popover;
    });

    // Show popover.
    $scope.openPopover = function ($event) {
        $scope.popover.show($event);
    };

    // Show extracted text.
    $scope.showExtractedText = function () {
        // Close floating button.
        $scope.closeMfbButton = closed;
        // Hide popover.
        $scope.popover.hide();
        if ($rootScope.ocrMessage !== '') {
            // See result.
            $state.go('ocr.info');
        } else {
            // Show message.
            Utility.showToast('no_extracted_text');
        }
    };

    // Content click
    $scope.onBackDropClick = function () {
        // Close buttons.
        $scope.closeMfbButton = closed;
    };
})

.controller('ImageInfoCtrl', function ($rootScope) {

});