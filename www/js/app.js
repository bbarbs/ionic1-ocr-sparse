// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ocr_trial', ['ionic', 'ocr_trial.controller', 'ocr_trial.service', 'ng-mfb', 'ngCordova'])

.run(function ($ionicPlatform, $rootScope, Utility) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    // Global text message from scanned image.
    $rootScope.ocrMessage = '';

    // Wait for device ready.
    document.addEventListener('deviceready', function () {
        // Listen for Offline event
        document.addEventListener("offline", function () {
            // Show connection error message.
            Utility.showToast('network_error');
        }, false);
    }, false);
})

.config(function ($stateProvider, $urlRouterProvider) {
    // Url router.
    $stateProvider
        .state('ocr', {
            url: '/ocr',
            abstract: true,
            templateUrl: 'templates/main-page.html'
        })
        .state('ocr.scan', {
            url: '/scan',
            views: {
                'main-ocr': {
                    templateUrl: 'templates/scan-page.html',
                    controller: 'ScanCtrl'
                }
            }
        })
        .state('ocr.info', {
            url: '/imageinfo',
            views: {
                'main-ocr': {
                    templateUrl: 'templates/image-info.html',
                    controller: 'ImageInfoCtrl'
                }
            }
        });
    $urlRouterProvider.otherwise('ocr/scan');
});