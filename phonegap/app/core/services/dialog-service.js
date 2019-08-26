(function () {
    'use strict';

    //service to replace JS default alert and confirm dialogs with promise friendly versions
    window.agApp.factory('DialogService', Service);

    function Service($modal) {
        return {
            Alert: Alert,
            Confirm: Confirm,
            Error: Error
        };

        /////////////////

        function Alert(options) {
            //default values
            var opts = {
                title: 'Alert',
                message: 'Please take note of action',
                okText: 'Okay',
                cancelText: 'Cancel',
                type: 'alert'
            };

            if (options && angular.isObject(options))
                angular.extend(opts, options);
            else if (options)
                opts.message = options;

            return showModal(opts);
        }

        function Confirm(options) {
            //default values
            var opts = {
                title: 'Confirm',
                message: 'Please confirm this action',
                okText: 'Okay',
                cancelText: 'Cancel',
                type: 'confirm'
            };

            if (options && angular.isObject(options))
                angular.extend(opts, options);
            else if (options)
                opts.message = options;

            return showModal(opts);
        }

        function Error(options) {
            //default values
            var opts = {
                title: 'Oh snap!',
                message: 'Please take note of action',
                okText: 'Okay',
                cancelText: 'Cancel',
                type: 'alert'
            };

            if (options && angular.isObject(options))
                angular.extend(opts, options);
            else if (options)
                opts.message = options;

            return showModal(opts);
        }

        function showModal(options) {
            return $modal.open({
                templateUrl: 'app/core/services/dialog-service.html',
                keyboard: false,
                controller: [
                    '$scope', '$modalInstance', '$sce',
                    function ($scope, $modalInstance, $sce) {
                        options.message = $sce.trustAsHtml(options.message);
                        $scope.options = options;

                        $scope.ok = function () {
                            $modalInstance.close();
                        };

                        $scope.cancel = function () {
                            $scope = $scope;
                            $modalInstance.dismiss();
                        };
                    }
                ]
            }).result;
        }
    }
})();