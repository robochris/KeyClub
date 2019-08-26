window.agApp.directive('animateClick', ['$animate',
    function ($animate) {
        return {
            link: function (scope, elem, attrs) {
                elem.on('mousedown', function () {
                    var self = angular.element(this);
                    $animate.addClass(self, 'spin-once').then(function () {
                        self.removeClass('spin-once');
                    });
                });
            }
        };
}]);
