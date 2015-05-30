/**
 * Created by Michael on 5/24/2015.
 */
angular.module('joynRideApp').controller('MyDrivesController', function ($scope, Request) {
    window.scope = $scope;
    function arraysToObjects(obj) {
        var newObj = {};
        for (var key in obj) {
            newObj[key] = {};
            for (var i = 0; i < obj[key].length; i++) {
                newObj[key][obj[key][i]] = {}
            }
        }
        return newObj;
    }

    $scope.isEmpty = function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    }

    $scope.tagToName = function (tag) {
        tag = tag.charAt(0).toUpperCase() + tag.slice(1);
        return tag.replace(/_/g, ' ');
    }
    //Request.get('/get_my_travels?user_id=' + JSON.parse(localStorage.user).user_id, function (data) {
    Request.get('/get_my_travels?user_id=2', function (data) {
        var dataClone = (JSON.parse(JSON.stringify(data))); //clone object
        $scope.travelWithInfo = arraysToObjects(dataClone);

        for (var key in $scope.travelWithInfo) {
            for (var travel in $scope.travelWithInfo[key]) {
                (function (travel, key) {
                    Request.get('/get_transaction_info?tran_id=' + travel, function (travelInfo) {
                        $scope.travelWithInfo[key][travel] = travelInfo;
                        var driver_id = travelInfo["driver_id"];
                        Request.get('/get_personal_info?id=' + travelInfo['driver_id'], function (personInfo) { //TODO:add support for passengers info
                            delete $scope.travelWithInfo[key][travel]['driver_id'];
                            $scope.travelWithInfo[key][travel]['driver'] = personInfo;
                            $scope.travelWithInfo[key][travel]['driver'].id = driver_id;
                        });

                    });
                })(travel, key)
            }
        }
    }, function (err) {
        console.log("err= ", err);
    })
});