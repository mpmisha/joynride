/**
 * Created by Michael on 6/7/2015.
 */
angular.module('joynRideApp').factory('NotificationService', ['Request',function (Request) {
    var notifications = {};

    return {
        updateNotifications : function(callback){
            Request.get('/notifications.php?user_id='+JSON.parse(localStorage.user).user_id,function(notif){
                if(Object.keys(notifications).length === 0){
                    console.log("here i am")
                    notifications = notif;
                }else{
                    for(var key in notif){
                        for(var subkey in notif[key]){
                            (notifications[key])[subkey] = (notif[key])[subkey];
                        }
                    }
                }
                if(callback) callback(notif);
                return notif;
            })
        },
        getNotifications : function(callback){
            if(callback) callback(notifications);
            return notifications;

        },
        countNotifications : function(callback){
            var count=0;
            for(var key in notifications){
                for(var subkey in notifications[key]){
                count++;
                }
            }
            if(callback) callback(count);
            return count;
        },
        resetNotifications : function(callback){
            notifications={};
            if(callback) callback();
        }
    }
}]);