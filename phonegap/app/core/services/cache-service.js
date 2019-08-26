(function () {
    'use strict';

    window.agApp.service('CacheService', Service);

    function Service($localStorage, $log, SettingsService) {
        var service = {
            ClearAllCache: ClearAllCache,
            ClearCache: ClearCache,
            GetCache: GetCache,
            SetCache: SetCache
        };
        activate();
        return service;

        function activate() {
            if ($localStorage.cacheService === undefined)
                $localStorage.cacheService = {};
        }

        function ClearAllCache() {
            $localStorage.cacheService = {};
        }

        function ClearCache(cacheKey) {
            $localStorage.cacheService[cacheKey] = undefined;
        }

        function GetCache(cacheKey) {
            var cacheObject = $localStorage.cacheService[cacheKey];
            if (cacheObject) {
                var now = new Date();
                var cacheTimeout = new Date(cacheObject.timeout);
                cacheObject.expired = cacheTimeout < now;
            }
            return cacheObject;
        }

        function SetCache(cacheKey, data, expireMinutes) {
            $localStorage.cacheService[cacheKey] = {
                cacheTime: new Date().toJSON(),
                timeout: new Date(new Date().getTime() + expireMinutes * 60000).toJSON(),
                data: data
            };
        }

    }
})();
