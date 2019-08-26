(function () {
    'use strict';

    window.agApp.controller('StartPageController', Controller);


    function Controller($log, $scope, $state, AuthService, PersonService, SettingsService) {
        var vm = this;

        activate();

        function activate() {
            if ($scope.base.currentUserId !== null) {
                $state.go('event-list');
            }

        }
    }
})();