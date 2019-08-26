(function () {
    'use strict';

    window.agApp.controller('ForgotPasswordController', Controller);

    function Controller($state, DialogService, AuthService, PersonService) {
        var vm = this;
        vm.form = undefined;
        vm.email = undefined;
        vm.forgotPassword = forgotPassword;
        activate();

        function activate() {
            if (AuthService.currentUserId !== null) {
                $state.go('event-list');
            }
            vm.submitted = false;
        }

        function forgotPassword() {
            if (vm.form.$invalid) {
                vm.submitted = true;
                return;
            }

            var ForgotPromise = AuthService.forgotPassword(vm.email);

            ForgotPromise.then(function (data) {
                    DialogService.Alert({
                        title: 'Thank You',
                        message: 'If ' + vm.email + ' is a registed account, you will receive an email within the next 24 hours with instructions on how to proceed.  You can also email us at <a href="mailto:hello@keychainforkeyclub.com">hello@keychainforkeyclub.com</a>'
                    });
                })
                .catch(function (data) {
                    DialogService.Alert({
                        title: 'Oops!',
                        message: 'Thats not an email'
                    });
                });
        }
    }
})();
