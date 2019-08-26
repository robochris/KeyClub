(function () {
    'use strict';

    window.agApp.controller('EditEventController', Controller);

    function Controller($log, $modal, $state, $stateParams, DialogService, EventService) {
        var vm = this;
        vm.event = undefined;
        vm.eventPromise = undefined;
        vm.eventId = $stateParams.eventId;
        vm.form = undefined;
        vm.today = undefined;

        vm.save = save;

        activate();

        function activate() {
            vm.submitted = false;
            vm.today = new Date(new Date().setHours(0,0,0,0));
            vm.eventPromise = EventService.GetEvent(vm.eventId);

            vm.eventPromise.then(function (data) {
                    // data contains events
                    vm.event = data;
                    if (vm.event) {
                        vm.event.date = new Date(vm.event.date);
                        vm.event.endDate = new Date(vm.event.endDate);
                    }
                })
                .catch(function (data) {
                    // data contains errors
                    DialogService.Error('An error happened while getting this event.');
                });
        }

        function save() {
            if (vm.form.$invalid) {
                vm.submitted = true;
                return;
            }

            var savePromise = EventService.saveEvent(vm.event);
            savePromise.then(function (data) {
                    DialogService.Alert({
                        title: 'Well done!',
                        message: 'Your event was saved.'
                    });
                    $state.go('event-list');
                })
                .catch(function (data) {
                    DialogService.Error('An error happened while saving the event.')
                });
        }
    }
})();
