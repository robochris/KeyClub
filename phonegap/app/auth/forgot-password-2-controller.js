(function () {
    'use strict';

    window.agApp.controller('ForgotPassword2Controller', Controller);

    function Controller($state, $stateParams, DialogService, AuthService, PersonService) {
        var vm = this;
        vm.form = undefined;
        vm.resetToken = $stateParams.resetToken;

        vm.resetForgottenPassword = resetForgottenPassword;

        activate();

        function activate() {
            if (AuthService.currentUserId !== null) {
                $state.go('event-list');
            }
            vm.submitted = false;
        }

        function resetForgottenPassword() {
            if (vm.form.$invalid) {
                vm.submitted = true;
                return;
            }

            var ResetPromise = AuthService.resetForgottenPassword(vm.resetToken, vm.newPassword);

            ResetPromise.then(function (data) {
                $state.go('start-page');
                DialogService.Alert({
                    title: 'Thank You',
                    message: 'Your password has been reset sucessfully.  You may now log in using your new password.'
                });
                })
                .catch(function (data) {
                    DialogService.Alert({
                        title: 'Oops!',
                        message: 'Something went wrong'
                    });
                });
        }
    }
})();
