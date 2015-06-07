/**
 * Created by Michael on 4/22/2015.
 */
angular.module('joynRideApp').controller('UpdatesController', ['$scope', 'NotificationService', 'Request', function ($scope, NotificationService, Request) {
    $scope.messages={
        Accepted:'We are glad to inform you that you were accepted to the following rides!',
        Rejected:'unfortunately your request to join the following rides has been rejected by the driver!',
        Join:'Hey! The following people would like to join your rides!'
    }
    var rideId;
    window.s = $scope;
    //reset notification after they have been viewed
    //wait 2 sec until all page is loaded

    setTimeout(function(){
        NotificationService.resetNotifications();
    },2000);

    NotificationService.getNotifications(function (notif) {
        console.log('norif - ', notif);
        $scope.notifications = notif;
        for (var key in $scope.notifications) {
            for (var subKey in $scope.notifications[key]) {
                (function (obj, i) {
                    rideId = obj[i];
                    Request.get('/get_transaction_info?tran_id=' + rideId, function (data) {
                        obj[i].showInfo=false;
                        obj[i] = data;

                        obj[i].id = rideId;
                    })
                })($scope.notifications[key], subKey)
            }
        }
    })
    $scope.getDriverInfo = function (id, obj) {
        if (!obj.driver) {
            Request.get('/get_personal_info?id=' + id, function (info) {
                obj.driver = info;
                obj.driver.id=id;
            });
        }
    }
}]);