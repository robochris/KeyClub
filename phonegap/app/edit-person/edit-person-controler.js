(function() {
    'use strict';

    window.agApp.controller('EditPersonController', Controller);

    function Controller($scope, $state, $timeout, $stateParams, AuthService, DialogService, PersonService, EventService) {
        var vm = this;
        vm.getPersonPromise = undefined;
        vm.selectedPerson = undefined;
        vm.getPersonEventsPromise = undefined;
        vm.eventsLoaded = false;
        vm.personId = $stateParams.personId;
        vm.save = save;
        vm.events = [];
        activate();

        function activate() {
            getPerson();
            getEvents();
        }

        function getPerson() {
            vm.getPersonPromise = PersonService.GetPerson(vm.personId);
            vm.getPersonPromise.then(function(data) {
                    vm.selectedPerson = data;
                    vm.selectedPerson.resetPicture = false;
                })
                .catch(function(data) {
                    DialogService.Error('An error happened while getting person.');
                });
        }

        function getEvents() {
            vm.eventsLoaded = false;
            vm.getPersonEventsPromise = EventService.GetEventsByPerson(vm.personId);

            vm.getPersonEventsPromise.then(function(data) {
                    for (var i in data) {
                        var event = data[i];
                        EventService.populateHelperProperties(event, AuthService.currentUserId);
                    }

                    vm.events = [];

                    $timeout(function() {
                        vm.events = data;
                        vm.eventsLoaded = true;
                    }, 301);
                })
                .catch(function(data) {
                    DialogService.Error('An error happened while getting events.');
                });
        }


        function save() {
            var savePromise = PersonService.SavePerson(vm.selectedPerson);

            savePromise.then(function(data) {
                    $state.go('person-list');
                })
                .catch(function(data) {
                    DialogService.Error('An error happened while saving the person.');
                });
        }
        $scope.$on('Base:Refresh', function(data) {
            getPerson();
            getEvents();
        });

        $scope.$watch('editPerson.selectedPerson.approved', function(newValue, oldValue) {
            if (vm.selectedPerson && newValue !== true) {

                vm.selectedPerson.isOfficer = false;
            }
        });
    }
})();
