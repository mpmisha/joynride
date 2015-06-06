/**
 * Created by Michael on 5/24/2015.
 */
angular.module('joynRideApp').controller('MyDrivesController', function ($scope, Request) {
    window.scope = $scope;
    function arraysToObjects(obj) {
        var newObj = {};
        for (var key in obj) {
            newObj[key] = {status: obj[key]};
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
    Request.get('/traveller_all_transactions?user_id='+JSON.parse(localStorage.user).user_id, function (data) {
        var dataClone = (JSON.parse(JSON.stringify(data))); //clone object
        $scope.travellerDrives = arraysToObjects(dataClone);

        for (var key in $scope.travellerDrives) {
            (function (key) {
                Request.get('/get_transaction_info?tran_id=' + key, function (travelInfo) {
                    if(!travelInfo.error){
                        var status = $scope.travellerDrives[key].status;
                        $scope.travellerDrives[key] = travelInfo;
                        $scope.travellerDrives[key].status = status;
                        $scope.travellerDrives[key].showInfo = false;
                    }else{
                        delete $scope.travellerDrives[key]
                        console.error('error getting key '+key+', message - ',travelInfo.error);
                    }

                });
            })(key)
        }
    }, function (err) {
        console.log("err= ", err);
    })



    //how does it work?
    Request.get('/driver_all_transactions?user_id='+JSON.parse(localStorage.user).user_id, function (data) {
        var dataClone = (JSON.parse(JSON.stringify(data))); //clone object
        $scope.driverDrives = dataClone;

        for (var key in $scope.driverDrives) {
            (function (key) {
                Request.get('/get_transaction_info?tran_id=' + key, function (travelInfo) {
                    if(!travelInfo.error){
                        var passengers = $scope.driverDrives[key];
                        $scope.driverDrives[key] = travelInfo;
                        $scope.driverDrives[key].passengers = passengers;
                        $scope.driverDrives[key].showInfo = false;
                    }else{
                        delete $scope.driverDrives[key]
                        console.error('error getting key '+key+', message - ',travelInfo.error);
                    }

                });
            })(key)
        }
    }, function (err) {
        console.log("err= ", err);
    })
    $scope.getPassengers = function(passengerArray){
        for(var i=0;i<passengerArray.length;i++){
            (function(i,passengerArray){
                Request.get('/get_personal_info?id=' + passengerArray[i].trav_id, function (info) {
                    if(!info.error){
                        console.log('info - ',info);
                        passengerArray[i].info=info;
                    }else{
                        console.error('error getting info for passenger '+passengerArray[i].trav_id+', message - ',travelInfo.error);
                    }
                })
            })(i,passengerArray)

        }
    };

    $scope.getDriverInfo = function (id, obj) {
        if (!obj.driver) {
            Request.get('/get_personal_info?id=' + id, function (info) {
                window.scope.drives = info;
                obj.driver = info;
            });
        }
    }

});