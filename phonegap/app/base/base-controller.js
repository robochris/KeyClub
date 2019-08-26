(function () {
    'use strict';

    window.agApp.controller('BaseController', Controller);


    function Controller($http, $log, $modal, $rootScope, $state, $stateParams, AdService, EventService, PersonService, AuthService, SettingsService) {
        var vm = this;
        vm.currentUserId = null;
        vm.currentUser = null;
        vm.$http = $http;
        vm.isPhoneGap = window.isPhoneGap;
        vm.settingsService = SettingsService;

        vm.refresh = refresh;
        vm.signOut = signOut;

        activate();

        function activate() {
            getCurrentUser();
        }

        function getCurrentUser() {
            vm.currentUser = AuthService.currentUser;
            vm.currentUserId = AuthService.currentUserId;
        }

        $rootScope.$on('CurrentUserChanged', function (data) {
            getCurrentUser();
        });

        function refresh() {
            $rootScope.$broadcast("Base:Refresh");

        }

        function signOut() {
            AuthService.setApiToken(null);
            $state.go('start-page');
        }
    }
})();
