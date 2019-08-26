(function () {
    'use strict';

    window.agApp.service('SettingsService', Service);

    function Service($http) {
        var settings = {};

        // #BEGIN INJECT-VERSION
        settings.version = '1.0.15';
        // #END INJECT-VERSION
        $http.defaults.headers.common['client-version'] = settings.version;

        var environments = {
            local: {
                apiBaseUrl: 'http://localhost:8888/api/',
                environment: 'dev'
            },
            phonegapDev: {
                apiBaseUrl: 'https://dev.keychainforkeyclub.com/api/',
                environment: 'dev'
            },
            phonegapProd: {
                apiBaseUrl: 'https://keychainforkeyclub.com/api/',
                environment: 'prod'
            },
            web: {
                apiBaseUrl: '/api/',
                environment: 'prod'
            }
        }

        // #BEGIN INJECT-ENVIRONMENT
        var environment = environments.phonegapDev;
        // #END INJECT-ENVIRONMENT

        var result = angular.extend({}, settings, environment);
        return result;
    }
})();
