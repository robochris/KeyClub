(function () {
    'use strict';

    window.agApp.controller('AccountDeniedController', Controller);

    function Controller($scope, $state, DialogService, AuthService, PersonService) {
        var vm = this;
        activate();

        function activate() {}

        function refresh(){
            AuthService.getCurrentUser(true).then(function (data) {
                $state.go('event-list');
            });
        }
        
        $scope.$on('Base:Refresh', function (data) {
            refresh();
        });
    }
})();