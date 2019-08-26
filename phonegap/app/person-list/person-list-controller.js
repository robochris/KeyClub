(function () {
    'use strict';

    window.agApp.controller('PersonListController', Controller);

    function Controller($scope, $state, $stateParams, $timeout, DialogService, PersonService, PersonListControllerService) {
        var vm = this;
        vm.allPeoplePromise = undefined;
        vm.allPeople = undefined;
        vm.filteredPeople = undefined;
        vm.peopleLoaded = false;
        vm.search = '';
        vm.showApproved = true;
        vm.showDenied = false;
        vm.showMembers = true;
        vm.showOfficers = true;
        vm.friendlyFilterString = friendlyFilterString;
        vm.updateFilteredPeople = updateFilteredPeople;


        activate();

        function activate() {
            if (PersonListControllerService.search !== undefined) {
                vm.search = PersonListControllerService.search;
            }
            if (PersonListControllerService.showApproved !== undefined) {
                vm.showApproved = PersonListControllerService.showApproved;
            }
            if (PersonListControllerService.showDenied !== undefined) {
                vm.showDenied = PersonListControllerService.showDenied;
            }
            if (PersonListControllerService.showMembers !== undefined) {
                vm.showMembers = PersonListControllerService.showMembers;
            }
            if (PersonListControllerService.showOffficers !== undefined) {
                vm.showOffficers = PersonListControllerService.showOffficers;
            }

            getAllPeople();
        }

        function getAllPeople(force) {
            vm.peopleLoaded = false;
            var cacheResults = PersonService.GetCachedAllPeople();
            if (cacheResults) {
                vm.allPeople = cacheResults.data;
                updateFilteredPeople();
                if (!cacheResults.expired && !force) {
                    // cache is fresh, we're done here
                    vm.peopleLoaded = true;
                    return;
                }
            }

            vm.allPeoplePromise = PersonService.GetAllPeople();
            vm.allPeoplePromise.then(function (data) {
                    vm.filteredPeople = vm.allPeople = [];
                    $timeout(function () {
                        vm.allPeople = data.sort(function (a, b) {
                            // sort  by display name
                            return a.displayName.localeCompare(b.displayName);
                        });
                        updateFilteredPeople();
                        vm.peopleLoaded = true;
                    }, 301);
                })
                .catch(function (data) {
                    DialogService.Error('An error happened while getting people.');
                });
        }

        function updateFilteredPeople() {
            console.log('updating filtered people');
            vm.allPeople.forEach(function (person) {
                if (person.approved === null) {
                    person.approved = undefined;
                }
            });
            PersonListControllerService.search = vm.search;
            PersonListControllerService.showApproved = vm.showApproved;
            PersonListControllerService.showDenied = vm.showDenied;
            PersonListControllerService.showMembers = vm.showMembers;
            PersonListControllerService.showOffficers = vm.showOfficers;

            vm.filteredPeople = vm.allPeople.filter(function shouldShowPerson(person) {
                var statusInclude = false;
                var typeInclude = false;
                var searchInclude = false;

                if (vm.showApproved && person.approved === true)
                    statusInclude = true;
                if (vm.showDenied && person.approved !== true)
                    statusInclude = true;

                if (vm.showMembers && person.isOfficer === false)
                    typeInclude = true;
                if (vm.showOfficers && person.isOfficer === true)
                    typeInclude = true;

                if (vm.search.length > 0) {
                    searchInclude = person.displayName.toLowerCase().indexOf(vm.search.toLowerCase()) > -1;
                } else {
                    searchInclude = true;
                }

                return statusInclude && typeInclude && searchInclude;
            });
        }

        function friendlyFilterString() {
            var filterString1 = '';
            var filterString2 = '';
            if (vm.showApproved) {
                filterString1 += 'Approved, ';
            }
            if (vm.showDenied) {
                filterString1 += 'Denied, ';
            }

            if (vm.showApproved && vm.showDenied) {
                filterString1 = 'All, ';
            }

            if (filterString1.length === 0) {
                return 'No People';
            }
            filterString1 = filterString1.substr(0, filterString1.length - 2) + ' ';


            if (vm.showMembers) {
                filterString2 += 'Members, ';
            }
            if (vm.showOfficers) {
                filterString2 += 'Officers, ';
            }
            if (vm.showMembers && vm.showOfficers) {
                filterString2 = 'People, ';
            }

            if (filterString2.length === 0) {
                return 'No People';
            }
            filterString2 = filterString2.substr(0, filterString2.length - 2);

            return filterString1 + filterString2;
        }



        $scope.$on('Base:Refresh', function (data) {
            getAllPeople(true);
        });
    }
})();
