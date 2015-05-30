/**
 * Created by Michael on 5/30/2015.
 */
angular.module('joynRideApp').factory('NotifyService', function (notify) {
    var notifyParams = {
        duration: 3000,
        messageTemplate:'',
        classes: []
    };
    function showNotification(msg,duration){
        notifyParams.messageTemplate =msg;
        notifyParams.duration=duration||notifyParams.duration;
        notify(notifyParams);
    }
    return {
        success: function (msg,duration) {
            notifyParams.classes=['alert-success'];
            showNotification(msg,duration);
        },
        fail: function (msg,duration) {
            notifyParams.classes=['alert-danger'];
            showNotification(msg,duration);
        },
        warning : function(msg,duration){
            notifyParams.classes=['alert-warning'];
            showNotification(msg,duration);
            }
    }
});