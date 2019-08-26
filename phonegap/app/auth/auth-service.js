(function() {
    'use strict';

    window.agApp.service('AuthService', Service);

    function Service($http, $localStorage, $log, $q, $rootScope, DialogService, HttpRequestService, PersonService, SettingsService) {
        var _getCurrentUserPromise;

        var service = {
            keyCode: null,
            group: undefined,
            apiToken: undefined,
            currentUser: undefined,
            currentUserId: undefined,

            changePassword: changePassword,
            getCurrentUser: getCurrentUser,
            setApiToken: setApiToken,
            login: login,
            signUp: signUp,
            forgotPassword: forgotPassword,
            resetForgottenPassword: resetForgottenPassword,
            verifyKeyCode: verifyKeyCode
        };

        activate();

        return service;

        function activate() {
            setApiToken($localStorage.apiToken);
        }

        function changePassword(oldPassword, newPassword) {
            var postData = {
                oldPassword: oldPassword,
                newPassword: newPassword
            }
            return HttpRequestService({
                method: 'POST',
                url: SettingsService.apiBaseUrl + 'auth/changePassword',
                data: postData
            });
        }

        function setApiToken(token) {
            $http.defaults.headers.common.token = token;
            service.apiToken = token;
            $localStorage.apiToken = token;
            getCurrentUser(true);
        }

        function getCurrentUser(force) {
            if (!force && _getCurrentUserPromise !== undefined) return _getCurrentUserPromise;
            var deferred = $q.defer();
            _getCurrentUserPromise = deferred.promise;
            if (service.apiToken) {
                PersonService.GetMe().then(function(data) {
                        service.currentUser = data;
                        service.currentUserId = service.currentUser._id;
                        $rootScope.$broadcast('CurrentUserChanged');
                        deferred.resolve(data);
                    })
                    .catch(function(data) {
                        service.currentUser = null;
                        service.currentUserId = null;
                        $rootScope.$broadcast('CurrentUserChanged');
                        deferred.reject(data);
                    });
            } else {
                service.currentUser = null;
                service.currentUserId = null;
                $rootScope.$broadcast('CurrentUserChanged');
                deferred.resolve(null);
            }
            return _getCurrentUserPromise;
        }

        function login(email, password) {
            var postData = {
                email: email,
                password: password
            }
            var promise = HttpRequestService({
                method: 'POST',
                url: SettingsService.apiBaseUrl + 'auth/login',
                data: postData
            });

            promise.then(function(data) {
                setApiToken(data.token);
            });

            return promise;
        }

        function signUp(keyCode, email, password, firstName, lastName) {
            var postData = {
                keyCode: keyCode,
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName
            }
            var promise = HttpRequestService({
                method: 'POST',
                url: SettingsService.apiBaseUrl + 'auth/signUp',
                data: postData
            });

            promise.then(function(data) {
                setApiToken(data.token);
            });

            return promise;
        }

        function forgotPassword(email) {
            var postData = {
                email: email
            }
            return HttpRequestService({
                method: 'POST',
                url: SettingsService.apiBaseUrl + 'auth/forgotPassword',
                data: postData
            });
        }

        function resetForgottenPassword(resetToken, newPassword) {
            var postData = {
                resetToken: resetToken,
                newPassword: newPassword
            }
            return HttpRequestService({
                method: 'POST',
                url: SettingsService.apiBaseUrl + 'auth/resetForgottenPassword',
                data: postData
            });
        }

        function verifyKeyCode(code) {
            var data = {
                keyCode: code
            };
            return HttpRequestService({
                method: 'POST',
                url: SettingsService.apiBaseUrl + 'auth/verifyKeyCode',
                data: data
            });
        }
    }
})();
