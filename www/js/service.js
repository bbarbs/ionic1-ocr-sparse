angular.module('ocr_trial.service', [])

/**
 * Factory for utility function.
 **/
.factory('Utility', function () {
    var self = {};

    // Convert base64 data in blob.
    self.imageURItoBlob = function (dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0) {
            // Decode base64 string.
            byteString = window.atob(dataURI.split(',')[1]);
        } else {
            // Decode uri string.
            byteString = decodeURI(dataURI.split(',')[1]);
        }
        // Separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        // Write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        // Type of file format is base in imageURI.
        return new Blob([ia], {
            type: mimeString
        });
    };

    // Toast message.
    self.toast = function (msg, duration, position) {
        document.addEventListener("deviceready", function () {
            if (window.cordova) {
                window.plugins.toast.showWithOptions({
                    message: msg,
                    duration: duration,
                    position: position,
                    addPixelsY: -82
                });
            }
        }, false);
    };

    // Message for toast.
    self.showToast = function (param) {
        var msg = '';
        if (param === 'success_scanning') {
            msg = 'Successfully Scan Image';
        } else if (param === 'error_scanning') {
            msg = 'Error Scanning Image';
        } else if(param === 'network_error') {
            msg = 'No Internet Connection';
        } else if(param === 'no_image') {
            msg = 'No Image Display';
        } else if(param === 'no_extracted_text') {
            msg = 'No Extracted Text';
        }
        return self.toast(msg, 'long', 'bottom');
    };
    return self;
});