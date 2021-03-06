/**
 * Created by Michael on 6/7/2015.
 */
angular.module('joynRideApp').factory('NotificationService', ['Request', function (Request) {
    var counter = 0;
    var notifications;

    var arrs = ['Accepted', 'Rejected', 'CancelAsPassenger', 'RejectedAfterAccepted', 'PendingForCancelledTran'];
    var maps = ['Join', 'CancelAsDriver'];

    function reset() {
        counter=0;
        notifications = {
            Accepted: [],
            Rejected: [],
            Join: [],
            CancelAsDriver: [],
            CancelAsPassenger: [],
            RejectedAfterAccepted: [],
            PendingForCancelledTran: []
        };
    }

    reset();
    return {
        updateNotifications: function (callback) {
            if (localStorage.user) {
                Request.get('/notifications?user_id=' + JSON.parse(localStorage.user).user_id, function (notif) {
                        for (var obj in arrs) {
                            if (notif[arrs[obj]]) {
                                counter += Object.keys(notif[arrs[obj]]).length;
                                for (var ride in notif[arrs[obj]]) {
                                    notifications[arrs[obj]].push((notif[arrs[obj]])[ride]);
                                }
                            }
                        }
                        for(var obj in maps){
                            if (notif[maps[obj]]){
                                counter += Object.keys(notif[maps[obj]]).length;
                                for (var ride in notif[maps[obj]]) {
                                    var output={};
                                    var transaction =[]
                                    for(var passenger in notif[maps[obj]][ride]){
                                        transaction.push(notif[maps[obj]][ride][passenger]);
                                    }
                                    output[ride]=transaction;
                                    notifications[maps[obj]].push(output);
                                }
                            }
                        }
                        console.log('notifications - ', notifications);
                        if (callback) callback(notif);
                        return notif;
                    }
                )
            }
        },
        getNotifications: function (callback) {
            if (callback) callback(JSON.parse(JSON.stringify(notifications)));
            return JSON.parse(JSON.stringify(notifications));
        }
        ,
        countNotifications: function (callback) {
            if (callback) callback(counter);
            return counter;
        }
        ,
        resetNotifications: function (callback) {
            reset();
            if (callback) callback();
        }
    }
}])
;