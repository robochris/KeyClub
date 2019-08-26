(function () {
    'use strict';

    window.agApp.controller('SignUpController', Controller);


    function Controller($log, $state, AuthService, PersonService, SettingsService, DialogService) {
        var vm = this;
        vm.email = undefined;
        vm.password = undefined;
        vm.firstName = undefined;
        vm.lastName = undefined;
        vm.createAccount = createAccount;
        vm.form = undefined;
        vm.showPrivacy = showPrivacy;
        vm.group = AuthService.group;

        activate();

        function activate() {
            if (AuthService.currentUserId !== null) {
                $state.go('event-list');
            }
            vm.submitted = false;

            // we should have a key code to get here.  if not, bounce the user.
            if (AuthService.keyCode === null || AuthService.group === null) {
                $state.go('select-group');
            }
        }

        function createAccount() {
            if (vm.form.$invalid) {
                vm.submitted = true;
                return;
            }

            var promise = AuthService.signUp(AuthService.keyCode, vm.email, vm.password, vm.firstName, vm.lastName);
            promise.then(function (data) {
                    $state.go('event-list');
                })
                .catch(function (data) {
                DialogService.Alert({
                        title: 'Oops!',
                        message: 'Could not create account. Please try again later.'
                    });
                });
        }

        function showPrivacy(){
            var msg = '';
            msg += '<p>Thank you for using Keychain. We know that you care how information about you is used and shared, and we appreciate your trust. ';
            msg += 'Spam email is the bane of the Internet and we won\'t have anything to do with it. ';
            msg += 'We only use your email address for password recovery reasons.</p>';


            msg += '<ul style="padding-left: 15px;">';
            msg += '<li>We promise that we will never share your email address or other identifiable information with any third party company.</li>';
            msg += '<li>We promise that you will never receive spam from Keychain.</li>';
            msg += '<li>We promise to protect your information through the use of secure databases.</li>';
            msg += '</ul>';


            DialogService.Alert({
                    title: 'Your Privacy',
                    message: msg
                });
        }
    }
})();
