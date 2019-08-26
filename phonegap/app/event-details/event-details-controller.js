(function() {
    'use strict';

    window.agApp.controller('EventDetailsController', Controller);


    function Controller($log, $modal, $scope, $state, $stateParams, AuthService, DialogService, EventService, PersonService, NotificationService) {
        var vm = this;
        vm.registrationPromise = undefined;
        vm.unregistrationPromise = undefined;
        vm.allPeople = undefined;
        vm.filterPeople = filterPeople;

        vm.Event = undefined;
        vm.eventPromise = undefined;

        vm.addPerson = addPerson;
        vm.Delete = Delete;
        vm.register = register;
        vm.unregister = unregister;
        vm.removePerson = removePerson;

        vm.eventId = $stateParams.eventId;
        activate();

        function activate() {
            getEvent();
            if (AuthService.currentUser.isOfficer) {
                getAllPeople();
            }
        }

        function getEvent() {
            vm.Event = undefined;
            vm.eventPromise = EventService.GetEvent(vm.eventId);

            vm.eventPromise.then(function(data) {
                    // data contains event
                    vm.Event = data;
                    vm.Event.full = vm.Event.totalSlots - vm.Event.volunteers.length <= 0;
                    populateVolunteers(vm.Event);
                    populateRegistered(vm.Event);
                    populateOfficers(vm.Event);
                })
                .catch(function(data) {
                    // data contains errors
                    DialogService.Error('An error happened while getting this event.');
                });
        }

        function getAllPeople() {
            vm.allPeoplePromise = PersonService.GetAllPeople();
            vm.allPeoplePromise.then(function(data) {
                    vm.allPeople = data;
                })
                .catch(function(data) {
                    DialogService.Error('An error happened while getting people.');
                });
        }

        function register() {
            if (vm.Event.registered) {
                return;
            }

            vm.registrationPromise = EventService.register(vm.eventId);
            vm.registrationPromise.then(function(data) {
                    // data contains event
                    vm.Event = data;
                    populateVolunteers(vm.Event);
                    populateRegistered(vm.Event);
                    populateOfficers(vm.Event);
                    //NotificationService.addNotification(vm.event);
                    $modal.open({
                        templateUrl: 'app/event-details/event-registered-popup.html'
                    });

                })
                .catch(function(data) {
                    // data contains errors
                    DialogService.Error('An error happened while registering for this event.');
                });
        }

        function unregister() {
            if (!vm.Event.registered) {
                return;
            }
            var confirmPromise = DialogService.Confirm({
                title: 'Woops!',
                message: 'Did you mean to unregister from this event?'
            });
            confirmPromise.then(function() {
                vm.unregistrationPromise = EventService.unregister(vm.eventId);

                vm.unregistrationPromise.then(function(data) {
                        // data contains event
                        vm.Event = data;
                        populateVolunteers(vm.Event);
                        populateRegistered(vm.Event);
                        populateOfficers(vm.Event);
                    })
                    .catch(function(data) {
                        // data contains errors
                        DialogService.Error('An error happened while unregistering from this event.');
                    });
            });
        }

        function populateVolunteers(Event) {
            Event.volunteerPeople = [];

            for (var i = 0; i < Event.volunteers.length; i++) {
                // go get the person
                var getVolunteersPromise = PersonService.GetPerson(Event.volunteers[i]);

                getVolunteersPromise.then(function(data) {
                        Event.volunteerPeople.push(data);
                    })
                    .catch(function(data) {
                        DialogService.Error('An error happened while getting people.');
                    });
            }
        }

        function populateOfficers(Event) {
            Event.officerPeople = [];

            for (var i = 0; i < Event.officers.length; i++) {
                // go get the person
                var getOfficersPromise = PersonService.GetPerson(Event.officers[i]);

                getOfficersPromise.then(function(data) {
                        Event.officerPeople.push(data);
                    })
                    .catch(function(data) {
                        DialogService.Error('An error happened while getting people.');
                    });
            }
        }

        function isPersonRegistered(personId) {
            if (vm.Event.volunteers && vm.Event.volunteers.indexOf(personId) > -1) {
                return true;
            } else if (vm.Event.officers && vm.Event.officers.indexOf(personId) > -1) {
                return true;
            } else {
                return false;
            }
        }

        function populateRegistered(event) {
            event.registered = isPersonRegistered(AuthService.currentUserId);
        }

        function Delete() {
            var confirmPromise = DialogService.Confirm('Are you sure you want to delete this event?');
            confirmPromise.then(function() {
                var promise = EventService.deleteEvent(vm.Event);
                promise.then(function(data) {
                    $state.go('event-list');
                });
            });
        }

        function addPerson() {
            var promise = EventService.registerOtherPerson(vm.eventId, vm.addPersonId);
            promise.then(function(data) {
                vm.addPersonId = undefined;
                getEvent();
                DialogService.Alert('Added a person to this event.');
            })
        }

        function filterPeople() {
            $log.debug('filterPeople');
            if (!vm.allPeople)
                return null;
            return vm.allPeople.filter(function(person) {
                return !isPersonRegistered(person._id);
            });
        }

        function removePerson(personId) {
            var confirmPromise = DialogService.Confirm('Are you sure you want to unrgister this person?');
            confirmPromise.then(function() {
                var promise = EventService.unregisterOtherPerson(vm.eventId, personId);
                promise.then(function(data) {
                    getEvent();
                })
            });
        }

        $scope.$on('Base:Refresh', function(data) {
            getEvent();
        });

    }
})();
