/**
 * Created by Michael on 5/24/2015.
 */
angular.module('joynRideApp').controller('MyDrivesController', function ($scope, Request) {
    Request.get('/get_my_travels?user_id=' + JSON.parse(localStorage.user).user_id, function (data) {
        console.log('data - ',data);
    }, function (err) {
        console.log("err= ", err);
    })
});