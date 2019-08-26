(function () {
    'use strict';

    window.agApp.controller('SelectGroupController', Controller);

    function Controller($scope, $state, DialogService, AuthService, PersonService) {
        var vm = this;
        vm.keyCode = undefined;
        vm.verifyKeyCode = verifyKeyCode;
        activate();

        function activate() {
            AuthService.keyCode = undefined;
            AuthService.group = undefined;
            vm.submitted = false;
        }

        function verifyKeyCode() {
            if (vm.form.$invalid) {
                vm.submitted = true;
                return;
            }

            var verifyPromise = AuthService.verifyKeyCode(vm.keyCode);

            verifyPromise.then(function (data) {
                    // key code was accepted, lets move on to sign-up
                    AuthService.keyCode = vm.keyCode;
                    AuthService.group = data;
                    $state.go('sign-up');
                })
                .catch(function (data) {
                    DialogService.Alert({
                        title: 'Oops!',
                        message: 'That Key Code was not accepted. Please double check and try again.'
                    });
                });
        }

        function refresh() {
            AuthService.getCurrentUser(true).then(function (data) {
                $state.go('event-list');
            });
        }

        $scope.$on('Base:Refresh', function (data) {
            refresh();
        });
    }
})();
