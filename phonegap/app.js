(function () {
    'use strict';

    window.agApp = angular.module('agApp', ['ngAnimate', 'ngImgCrop', 'ngStorage', 'nzToggle', 'offClick', 'ui.bootstrap', 'ui.router'])
        .config(Config)
        .run(Run);


    function Config($stateProvider, $urlRouterProvider) {
        console.log('config');

        var permissionResolver = ['$log', '$rootScope', '$q', '$state', 'AuthService', function ($log, $rootScope, $q, $state, AuthService) {
            var deferred = $q.defer();

            var toState = $rootScope.toState.name;
            $log.debug('checking auth for ' + toState);
            if (toState === 'start-page') {
                deferred.resolve();
            }
            else {
                AuthService.getCurrentUser().then(function (data) {
                    if (AuthService.currentUser && AuthService.currentUser.approved) {
                        $log.debug('allowing ' + toState);
                        deferred.resolve();
                        return;
                    }
                    else if (!AuthService.currentUser) {
                        $rootScope.rejectReason = 'Not_Logged_In';
                    }
                    else if (AuthService.currentUser.approved !== false) {
                        $rootScope.rejectReason = 'Denied';
                    }
                    $log.debug('rejecting ' + toState + ' ' + $rootScope.rejectReason);
                    deferred.reject('Not approved');
                })
                .catch(function(data) {
                    $log.debug('error: ' + data);
                    $log.debug('rejecting ' + toState);
                    deferred.reject('Not approved');
                });
            }
            return deferred.promise;
        }];
        //
        // For any unmatched url, redirect to home
        $urlRouterProvider.otherwise('/start-page');

        //
        // Now set up the states

        $stateProvider.state('base', {
            url: '/',
            templateUrl: 'app/base/base.html'
        });

        $stateProvider.state('approved-base', {
            parent: 'base',
            template: '<ui-view />',
            resolve: {
                approved: permissionResolver
            }
        });

        $stateProvider.state('event-list', {
            url: 'event-list',
            parent: 'approved-base',
            templateUrl: 'app/event-list/event-list.html',
        });

        $stateProvider.state('my-events', {
            url: 'my-events',
            parent: 'approved-base',
            templateUrl: 'app/my-events/my-events.html'
        });

        $stateProvider.state('person-list', {
            url: 'person-list',
            parent: 'approved-base',
            templateUrl: 'app/person-list/person-list.html'
        });

        $stateProvider.state('event-details', {
            url: 'event-details/{eventId}',
            parent: 'approved-base',
            templateUrl: 'app/event-details/event-details.html'
        });

        $stateProvider.state('edit-person', {
            url: 'edit-person/{personId}',
            parent: 'approved-base',
            templateUrl: 'app/edit-person/edit-person.html'
        });

        $stateProvider.state('edit-event', {
            url: 'edit-event/{eventId}',
            parent: 'approved-base',
            templateUrl: 'app/edit-event/edit-event.html'
        });

        $stateProvider.state('sign-up', {
            url: 'sign-up',
            parent: 'base',
            templateUrl: 'app/auth/sign-up.html'
        });

        $stateProvider.state('start-page', {
            url: 'start-page',
            parent: 'base',
            templateUrl: 'app/start-page/start-page.html'
        });

        $stateProvider.state('login', {
            url: 'login',
            parent: 'base',
            templateUrl: 'app/auth/login.html'
        });

        $stateProvider.state('account-denied', {
            url: 'account-denied',
            parent: 'base',
            templateUrl: 'app/auth/account-denied.html'
        });

        $stateProvider.state('my-profile', {
           url: 'my-profile',
           parent: 'base',
           templateUrl: 'app/my-profile/my-profile.html'
        });

        $stateProvider.state('forgot-password', {
           url: 'forgot-password',
           parent: 'base',
           templateUrl: 'app/auth/forgot-password.html'
        });

        $stateProvider.state('forgot-password-2', {
            url: 'forgot-password-2/{resetToken}',
            parent: 'base',
            templateUrl: 'app/auth/forgot-password-2.html'
        });

        $stateProvider.state('select-group', {
           url: 'select-group',
           parent: 'base',
           templateUrl: 'app/auth/select-group.html'
        });
    }

    function Run($rootScope, $state) {
        console.log('run');
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            // track the state the user wants to go to; authorization service needs this
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;
        });


        $rootScope.$on('$stateChangeError', function () {
            if ($rootScope.rejectReason === 'Denied') {
                $state.go('account-denied');
            }
            else {
                $state.go('start-page');
            }
        });
    }
})();
