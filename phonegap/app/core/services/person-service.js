(function() {
    'use strict';

    window.agApp.service('PersonService', Service);

    function Service($q, CacheService, HttpRequestService, SettingsService) {
        var service = {
            GetAllPeople: GetAllPeople,
            GetCachedAllPeople: GetCachedAllPeople,
            GetMe: GetMe,
            GetPerson: GetPerson,
            SavePerson: SavePerson,
            SubmitApprovalCode: SubmitApprovalCode,
            SaveMe: SaveMe
        };
        return service;

        function SaveMe(person) {
            var promise = HttpRequestService({
                method: 'PUT',
                url: SettingsService.apiBaseUrl + 'people/me',
                data: person
            });
            promise.then(function(data) {
                CacheService.ClearCache('all-people');
            });
            return promise;
        }

        function GetMe() {
            return HttpRequestService({
                method: 'GET',
                url: SettingsService.apiBaseUrl + 'people/me'
            });
        }

        function GetPerson(personId) {
            return HttpRequestService({
                method: 'GET',
                url: SettingsService.apiBaseUrl + 'people/' + personId
            });
        }

        function GetAllPeople() {
            var promise = HttpRequestService({
                method: 'GET',
                url: SettingsService.apiBaseUrl + 'people/'
            });
            promise.then(function(data) {
                CacheService.SetCache('all-people', data, 2);
            });
            return promise;
        }

        function GetCachedAllPeople() {
            return CacheService.GetCache('all-people');
        }

        function SavePerson(person) {
            var promise = HttpRequestService({
                method: 'PUT',
                url: SettingsService.apiBaseUrl + 'people/' + person._id,
                data: person
            });
            promise.then(function(data) {
                CacheService.ClearCache('all-people');
            });
            return promise;
        }

        function SubmitApprovalCode(code) {
            var data = {
                approvalCode: code
            };
            return HttpRequestService({
                method: 'PUT',
                url: SettingsService.apiBaseUrl + 'people/approvalCode',
                data: data
            });
        }
    }
})();
