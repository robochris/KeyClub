(function () {
    'use strict';

    window.agApp.controller('EventRegPopController', Controller);


    function Controller($log, $modal, $state, $stateParams, DialogService, EventService, PersonService) {
        var vm = this;
        vm.Event = undefined;
        vm.eventPromise = undefined;

        vm.eventId = $stateParams.eventId;

        activate();

        function activate() {
            vm.eventPromise = EventService.GetEvent(vm.eventId);

            vm.eventPromise.then(function (data) {
                    // data contains events
                    vm.Event = data;
                })
                .catch(function (data) {
                    // data contains errors
                    DialogService.Error('An error happened while getting events.');
                });
        }
    }
})();
