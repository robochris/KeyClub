(function () {
    'use strict';

    window.agApp.service('EventService', Service);

    function Service($q, CacheService, HttpRequestService, SettingsService) {
        var service = {
            GetCachedEvents, GetCachedEvents,
            GetCachedYourEvents, GetCachedYourEvents,
            GetEvent: GetEvent,
            GetEvents: GetEvents,
            GetYourEvent: GetYourEvent,
            GetEventsByPerson: GetEventsByPerson,
            populateHelperProperties: populateHelperProperties,
            register: register,
            registerOtherPerson: registerOtherPerson,
            unregister: unregister,
            unregisterOtherPerson: unregisterOtherPerson,
            saveEvent: saveEvent,
            deleteEvent: deleteEvent
        };
        return service;

        function ClearEventCaches() {
            CacheService.ClearCache('all-events');
            CacheService.ClearCache('your-events');
        }

        function GetCachedEvents() {
            return CacheService.GetCache('all-events');
        }

        function GetCachedYourEvents() {
            return CacheService.GetCache('your-events');
        }

        function GetEvents() {
            var promise = HttpRequestService({
                method: 'GET',
                url: SettingsService.apiBaseUrl + 'events'
            });

            promise.then(function(data) {
                CacheService.SetCache('all-events', data, 2);
            });
            return promise;
        }

        function GetYourEvent() {
            var promise = HttpRequestService({
                method: 'GET',
                url: SettingsService.apiBaseUrl + 'events/myevents'
            });

            promise.then(function(data) {
                CacheService.SetCache('your-events', data, 2);
            });
            return promise;
        }

        function GetEventsByPerson(personId) {
            return HttpRequestService({
                method: 'GET',
                url: SettingsService.apiBaseUrl + 'events/eventsByPerson/' + personId
            });
        }

        function GetEvent(eventId) {
            if (eventId) {
                return HttpRequestService({
                    method: 'GET',
                    url: SettingsService.apiBaseUrl + 'events/' + eventId
                });
            }
            else {
                return $q.when(null);
            }
        }

        function populateHelperProperties(event, currentUserId) {
            if (event.totalSlots === null)
                event.totalSlots = 0;
            event.slotsAvailable = Math.max(event.totalSlots - event.volunteers.length, 0);
            event.full = event.slotsAvailable === 0;

            if (event.volunteers.indexOf(currentUserId) > -1) {
                event.registered = true;
            } else if (event.officers.indexOf(currentUserId) > -1) {
                event.registered = true;
            } else {
                event.registered = false;
            }
        }

        function register(eventId) {
            var promise = HttpRequestService({
                method: 'POST',
                url: SettingsService.apiBaseUrl + 'events/' + eventId + '/register'
            });

            promise.then(function(data) {
                ClearEventCaches();
            });
            return promise;
        }

        function unregister(eventId) {
            var promise = HttpRequestService({
                method: 'POST',
                url: SettingsService.apiBaseUrl + 'events/' + eventId + '/unregister'
            });

            promise.then(function(data) {
                ClearEventCaches();
            });
            return promise;
        }

        function registerOtherPerson(eventId, personId) {
            var postData = {
                personId: personId
            }
            var promise = HttpRequestService({
                method: 'POST',
                url: SettingsService.apiBaseUrl + 'events/' + eventId + '/registerOtherPerson',
                data: postData
            });

            promise.then(function(data) {
                ClearEventCaches();
            });
            return promise;
        }

        function unregisterOtherPerson(eventId, personId) {
            var postData = {
                personId: personId
            }
            var promise = HttpRequestService({
                method: 'POST',
                url: SettingsService.apiBaseUrl + 'events/' + eventId + '/unregisterOtherPerson',
                data: postData
            });

            promise.then(function(data) {
                ClearEventCaches();
            });
            return promise;
        }

        function saveEvent(event) {
            if (event._id) {
                return updateEvent(event);
            } else {
                return insertEvent(event);
            }
        }

        function deleteEvent(event) {
            var promise = HttpRequestService({
                method: 'DELETE',
                url: SettingsService.apiBaseUrl + 'events/' + event._id
            });
            promise.then(function(data) {
                ClearEventCaches();
            });
            return promise;
        }

        function updateEvent(event) {
            var promise = HttpRequestService({
                method: 'PUT',
                url: SettingsService.apiBaseUrl + 'events/' + event._id,
                data: JSON.stringify(event)
            });
            promise.then(function(data) {
                ClearEventCaches();
            });
            return promise;
        }

        function insertEvent(event) {
            var promise = HttpRequestService({
                method: 'POST',
                url: SettingsService.apiBaseUrl + 'events/',
                data: JSON.stringify(event)
            });
            promise.then(function(data) {
                ClearEventCaches();
            });
            return promise;
        }
    }
})();
