(function () {
    'use strict';

    window.agApp.factory('AdService', Service);

    function Service($log, $rootScope, $state) {
        var adsCreated = false;
        var statesWithNoAds = [
            'start-page',
            'select-group',
            'sign-up',
            'login',
            'forgot-password'
        ]
        activate();
        return {
        };

        /////////////////

        function activate() {
            CreateAd();
            setupEvents();
        }
        
        function setupEvents() {
            
            // set up state change watcher
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                toggleAdsBasedOnState();
            });
            
            window.addEventListener('native.keyboardshow', hideAd);
            window.addEventListener('native.keyboardhide', toggleAdsBasedOnState);
        }
        
        function toggleAdsBasedOnState() {
            $log.debug('toggling ad based on state');
            if (statesWithNoAds.indexOf($state.current.name) >= 0) {
                hideAd();
            }
            else {
                showAd();
            }
        }
        
        function CreateAd() {
            $log.debug('Creating Ad');
            if (window.admob) {
                // Set AdMobAds options:
                var options = {
                    publisherId: "ca-app-pub-9314458948355399/9861687266", // Required
                    autoShowBanner: false
                }

                // Start showing banners (automatic when autoShowBanner is set to true)
                admob.createBannerView(options);
            }
        }
        
        function showAd() {
            $log.debug('Showing Ad');
            if (window.admob) {
                admob.showBannerAd(true);
            }
        }
        
        function hideAd() {
            $log.debug('Hiding Ad');
            if (window.admob) {
                admob.showBannerAd(false);
            }
        }

    }
})();