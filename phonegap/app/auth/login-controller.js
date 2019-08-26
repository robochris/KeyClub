(function () {
    'use strict';

    window.agApp.controller('LoginController', Controller);


    function Controller($log, $state, AuthService, CacheService, PersonService, SettingsService, DialogService) {
        var vm = this;
        vm.form = undefined;
        vm.email = undefined;
        vm.password = undefined;
        vm.login = login;
        activate();

        function activate() {
            if (AuthService.currentUserId !== null) {
                $state.go('event-list');
            }
            vm.submitted = false;
        }

        function login() {
            if (vm.form.$invalid) {
                vm.submitted = true;
                return;
            }

            var promise = AuthService.login(vm.email, vm.password);
            promise.then(function (data) {
                    CacheService.ClearAllCache();
                    $state.go('event-list');
                })
                .catch(function (data) {
                    DialogService.Error('That\'s the wrong email or password');
                });
        }
    }
})();
