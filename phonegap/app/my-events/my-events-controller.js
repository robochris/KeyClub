(function () {
    'use strict';

    window.agApp.controller('MyEventsController', Controller);


    function Controller($log, $stateParams, $scope, $state, $timeout, AuthService, DialogService, EventService) {
        var vm = this;
        vm.myEvents = [];
        vm.myEventsLoaded = false;
        vm.myEventsPromise = undefined;
        activate();

        function activate() {
            getEvents();
        }

        function getEvents(force) {
            vm.myEventsLoaded = false;
            var cacheResults = EventService.GetCachedYourEvents();
            if (cacheResults) {
                vm.myEvents = cacheResults.data;
                if (!cacheResults.expired && !force) {
                    // cache is fresh, we're done here
                    vm.myEventsLoaded = true;
                    return;
                }
            }

            vm.myEventsPromise = EventService.GetYourEvent();

            vm.myEventsPromise.then(function (data) {
                    // data contains events
                    for (var i in data) {
                        var event = data[i];
                        EventService.populateHelperProperties(event, AuthService.currentUserId);
                    }

                    // clear the list first, so we get the leave animation
                    vm.myEvents = [];

                    // wait for leave  animation to complete (300ms)
                    $timeout(function () {
                        vm.myEvents = data;
                        vm.myEventsLoaded = true;
                    }, 301);
                })
                .catch(function (data) {
                    // data contains errors
                    DialogService.Error('An error happened while getting events.');
                });
        }

        $scope.$on('Base:Refresh', function (data) {
            getEvents(true);
        });


    }
})();
