(function () {
    'use strict';

    window.agApp.controller('EventListController', Controller);


    function Controller($log, $stateParams, $scope, $state, $timeout, AuthService, DialogService, EventService) {
        var vm = this;
        vm.allEvents = [];
        vm.eventsLoaded = false;
        vm.eventsPromise = undefined;
        activate();

        function activate() {
            getEvents();
        }

        function getEvents(force) {
            vm.eventsLoaded = false;

            var cacheResults = EventService.GetCachedEvents();
            if (cacheResults) {
                vm.allEvents = cacheResults.data;
                if (!cacheResults.expired && !force) {
                    // cache is fresh, we're done here
                    vm.eventsLoaded = true;
                    return;
                }
            }

            // cache was either expired or it didn't exist at all.  lets fetch from the api
            vm.eventsPromise = EventService.GetEvents();

            vm.eventsPromise.then(function(data) {
                populateEvents(data);
                vm.eventsLoaded = true;
            })
            .catch(function(data) {
                // data contains errors
                DialogService.Error('An error happened while getting events!');
            });
        }

        function populateEvents(data) {
            for (var i in data) {
                var event = data[i];
                EventService.populateHelperProperties(event, AuthService.currentUserId);
            }

            // clear the list first, so we get the leave animation
            vm.allEvents = [];

            // wait for leave  animation to complete (300ms)
            $timeout(function () {
                vm.allEvents = data;
                vm.allEventsLoaded = true;
            }, 301);
        }

        $scope.$on('Base:Refresh', function (data) {
            getEvents(true);
        });
    }
})();
