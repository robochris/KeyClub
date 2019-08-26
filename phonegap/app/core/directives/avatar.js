(function() {
    'use strict';

    // example usage: <avatar person="myController.person"></avatar>
    window.agApp.directive('avatar', Directive);

    function Directive(SettingsService) {
        return {
            restrict: 'E',
            template: '<div class="kc-avatar"><img ng-src="{{avatarUrl}}" error-src="assets/default-avatar.png" class="img-circle"><img class="officer-icon" src="assets/star-circle.svg"  title="officer" ng-show="person.isOfficer"></div>',
            replace: true,
            scope: {
                person: '='
            },
            link: function(scope, element, attrs, ngModelCtrl) {
                scope.$watch(function() {
                    return scope.person;
                }, function() {
                    if (!scope.person) return '';

                    if (scope.person.avatarDataHash) {
                        scope.avatarUrl = SettingsService.apiBaseUrl + 'people/avatar/' + scope.person._id + '?hash=' + scope.person.avatarDataHash;
                    } else {
                        scope.avatarUrl = scope.person.avatarUrl;
                    }
                })
            }
        };
    }
})();
