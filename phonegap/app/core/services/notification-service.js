(function () {
    'use strict';

    window.agApp.service('NotificationService', Service);

    function Service() {
        var service = {
            addNotification: addNotification,
            removeNotification: removeNotification,
        };
        return service;
        // uses https://github.com/katzer/cordova-plugin-local-notifications
        return;
        // public functions -----------------------------------------------------------
        function addNotification(event) {
            // temporarily remove the notification functionality.
            if (!window.isPhoneGap) return;
            // todo
            // see if a notification already exists (https://github.com/katzer/cordova-plugin-local-notifications/wiki/08.-Querying#check-presence)
            // if it exists, call updateNotification
            // else, call createNewNotification
            cordova.plugins.notification.local.getAll(function (notifications) {
                var existing24Notification = undefined;
                var existing1Notification = undefined;
                for (var i in notifications) {
                    var notification = notifications[i];
                    alert(notification.data.eventId)
                    alert(notification.data.time)
                    if (notification.data.eventId === event._id && notification.data.time === 24) {
                        existing24Notification = notification;
                    }
                    if (notification.data.eventId === event._id && notification.data.time === 1) {
                        existing1Notification = notification;
                    }
                }
                // create or update
                if (existing24Notification===undefined){
                    createNewNotification(event);
                } else {
                    updateNotification(existing24Notification, event);
                }
            });
        }

        function removeNotification(event) {
            if (!window.isPhoneGap) return;
            // todo
            // given the provided event, find and remove the associated notification 
        }

        // private functions ----------------------------------------------------------

        function createNewNotification(event) {
            alert("created")
            // todo
            //given the provided event, create a notification 
            //notification at: 1 day before the event date
            //notification id: Math.floor(Math.random() * Number.MAX_VALUE) + 1
            //notification tile: event.title
            //notification text: event.text
            //notification data: {  eventId: event._id}
            var now = new Date().getTime();
            var _5_sec_from_now = new Date(now + 15 * 1000);

            cordova.plugins.notification.local.schedule({
                id: Math.floor(Math.random() * Number.MAX_VALUE) + 1,
                title: event.title,
                text: event.description,
                at: _5_sec_from_now,
                data: {
                    eventId: event._id,
                    time: 24
                }
            });

        }

        function updateNotification(notification, event) {
            alert("update")
            // todo
            // given the provided event, update the provided notification using the same rules as above
        }

        // this function will take a string, and return a unique number
    }
})();