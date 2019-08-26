(function () {
    'use strict';

    //service to wrap the standard usage of $http within services
    //wraps the request in a $q promise
    window.agApp.factory('HttpRequestService', Service);

    function Service($http, $log, $q) {
        return Go;

        /////////////////

        function Go(httpOptions) {
            $log.debug('sending api request', httpOptions);
            var deferred = $q.defer();
            $http(httpOptions)
                .success(function (data, status, headers, config) {
                    deferred.resolve(data);
                })
                .error(function (data, status, headers, config) {
                    $log.warn("Error: ", data);
                    deferred.reject(data);
                });
            return deferred.promise;
        }
    }
})();