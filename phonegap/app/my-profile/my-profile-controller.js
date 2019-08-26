(function () {
    'use strict';

    window.agApp.controller('MyProfileController', Controller);


    function Controller($log, $stateParams, $scope, $state, AuthService, DialogService, PersonService, SettingsService) {
        var vm = this;
        vm.myProfilePromise = undefined;
        vm.myImage = '';
        vm.myCroppedImage = '';
        vm.oldPassword = undefined;
        vm.newPassword = undefined;

        vm.changePassword = changePassword;
        vm.setPhoto = setPhoto;
        vm.cropOk = cropOk;

        vm.save = save;
        activate();

        function activate() {
            getProfile();

            // the fileInput is hidden, but triggered for non phonegap clients
            angular.element(document.querySelector('#fileInput')).on('change', function handleFileSelect(evt) {
                var file = evt.currentTarget.files[0];
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.$apply(function ($scope) {
                        vm.myImage = evt.target.result;
                    });
                };
                reader.readAsDataURL(file);
                vm.cropVisible = true;
            });
        }

        function changePassword() {
            var changePasswordPromise = AuthService.changePassword(vm.oldPassword, vm.newPassword);

            changePasswordPromise.then(function (data) {
                    DialogService.Alert({
                        title: 'Well done!',
                        message: 'Your password was changed.'
                    })
                    vm.oldPassword = undefined;
                    vm.newPassword = undefined;
                })
                .catch(function (data) {
                    var errorMessage = 'An error happened while changing your password';
                    if (data.message) {
                        errorMessage += ': ' + data.message;
                    }
                    DialogService.Error(errorMessage);
                    vm.oldPassword = undefined;
                    vm.newPassword = undefined;
                });
        }

        function setPhoto(method) {
            var cameraOptions = {
                quality: 50,
                destinationType: 0, // DATA_URL
                targetWidth: 1000,
                targetHeight: 1000
            };

            if (method === 'camera') {
                getImageFromDevice(cameraOptions);
            } else if (method === 'browse') {
                cameraOptions.sourceType = 0;
                getImageFromDevice(cameraOptions);
            }

            vm.setPhotoOptionsVisible = false;
        }

        function getImageFromDevice(cameraOptions) {
            try {
                navigator.camera.getPicture(
                    function onSuccess(imageData) {
                        $scope.$apply(function ($scope) {
                            vm.myImage = "data:image/jpeg;base64," + imageData;
                            vm.cropVisible = true;
                        });
                    },
                    function onFail(message) {
                        if (message.indexOf('Selection cancelled') >= 0 || // android
                            message.indexOf('Camera cancelled') >= 0 || // android
                            message.indexOf('no image selected') >= 0 // ios
                        ) {
                            return;
                        }

                        DialogService.Error('An error happened while getting the picture.  ' + message);
                    },
                    cameraOptions);
            } catch (ex) {
                var dialogPromise = DialogService.Error('An error happened while getting the picture.');

                dialogPromise.then(function () {
                    // fall back to the file browser.  this is primarily for non phonegap.
                    document.querySelector('#fileInput').click();
                });
            }
        }





        function cropOk() {
            vm.avatarUrl = vm.profile.avatarData = vm.myCroppedImage;
            vm.myImage = '';
        }

        function getProfile() {
            vm.myProfilePromise = AuthService.getCurrentUser(true);
            vm.myProfilePromise.then(function (data) {
                    vm.profile = data;
                    if (vm.profile.avatarDataHash) {
                        vm.avatarUrl = SettingsService.apiBaseUrl + 'people/avatar/' + vm.profile._id + '?hash=' + vm.profile.avatarDataHash;
                    } else {
                        vm.avatarUrl = vm.profile.avatarUrl;
                    }
                })
                .catch(function (data) {
                    DialogService.Error('An error happened while getting your profile.');
                });
        }

        function save() {
            var savePromise = PersonService.SaveMe(vm.profile);

            savePromise.then(function (data) {
                    DialogService.Alert({
                        title: 'Well done!',
                        message: 'Your Profile was saved.'
                    })
                    getProfile();
                    AuthService.getCurrentUser(true);
                })
                .catch(function (data) {
                    DialogService.Error('An error happened while saving your profile.');
                });
        }

        $scope.$on('Base:Refresh', function (data) {
            getProfile();
        });
    }
})();
