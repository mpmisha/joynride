/**
 * Created by Michael on 5/24/2015.
 */
angular.module('joynRideApp').controller('MyDrivesController', function ($scope, Request, NotifyService) {
    window.scope = $scope;
    $scope.passengerStatus = [
        {
            label: 'approved',
            id: 1,
            class: 'text-green'
        }, {
            label: 'pending',
            id: 0,
            class: 'text-blue'
        }, {
            label: 'rejected',
            id: 2,
            class: 'text-red'
        }
    ]
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
    Request.get('/traveller_all_transactions?user_id=' + JSON.parse(localStorage.user).user_id, function (data) {
        var dataClone = (JSON.parse(JSON.stringify(data))); //clone object
        $scope.travellerDrives = arraysToObjects(dataClone);

        for (var key in $scope.travellerDrives) {
            (function (key) {
                Request.get('/get_transaction_info?tran_id=' + key, function (travelInfo) {
                    if (!travelInfo.error) {
                        var status = $scope.travellerDrives[key].status;
                        $scope.travellerDrives[key] = travelInfo;
                        $scope.travellerDrives[key].status = status;
                        $scope.travellerDrives[key].showInfo = false;
                    } else {
                        delete $scope.travellerDrives[key]
                        console.error('error getting key ' + key + ', message - ', travelInfo.error);
                    }

                });
            })(key)
        }
    }, function (err) {
        console.log("err= ", err);
    })


    //how does it work?
    Request.get('/driver_all_transactions?user_id=' + JSON.parse(localStorage.user).user_id, function (data) {
        var dataClone = (JSON.parse(JSON.stringify(data))); //clone object
        $scope.driverDrives = dataClone;

        for (var key in $scope.driverDrives) {
            (function (key) {
                Request.get('/get_transaction_info?tran_id=' + key, function (travelInfo) {
                    if (!travelInfo.error) {
                        var path = JSON.parse(travelInfo.path);
                        var passengers = $scope.driverDrives[key];
                        $scope.driverDrives[key] = travelInfo;
                        $scope.driverDrives[key].hadMsg = travelInfo.msg?1:0;
                        $scope.driverDrives[key].passengers = passengers;
                        $scope.driverDrives[key].showInfo = false;
                        $scope.driverDrives[key].map = {
                            from: {
                                coordinates: {
                                    latitude: path[0].x,
                                    longitude: path[0].y

                                }
                            },
                            to: {
                                coordinates: {
                                    latitude: path[path.length - 1].x,
                                    longitude: path[path.length - 1].y
                                }
                            }
                        }
                        $scope.getPassengers(travelInfo);
                    } else {
                        delete $scope.driverDrives[key]
                        console.error('error getting key ' + key + ', message - ', travelInfo.error);
                    }
                });
            })(key)
        }
    }, function (err) {
        console.log("err= ", err);
    })
    $scope.getPassengers = function (value) {

        if (value) {
            passengerArray = value.passengers || [];
        } else {
            return;
        }

        for (var i = 0; i < passengerArray.length; i++) {
            (function (i, passengerArray) {
                Request.get('/get_personal_info?id=' + passengerArray[i].trav_id, function (info) {
                    if (!info.error) {
                        console.log('info - ', info);
                        if (info.pic == "bullshit" || info.pic == null) {
                            info.pic = '../../../img/profile.jpg';
                        }
                        info.id = passengerArray[i].trav_id;
                        passengerArray[i].info = info;

                    } else {
                        console.error('error getting info for passenger ' + passengerArray[i].trav_id + ', message - ', travelInfo.error);
                    }
                })
            })(i, passengerArray)

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
    $scope.getApprovedPassengers = function (value) {
        var counter = 0;
        if (value.passengers) {
            for (var i = 0; i < value.passengers.length; i++) {
                if (value.passengers[i].status == 'approved') counter++;
            }
        }
        return counter;
    }
    $scope.updatePassengerStatus = function (passenger, rideId) {
        var status = passenger.status == 'rejected' ? 2 : (passenger.status == 'approved' ? 1 : 0);
        console.log('passenger-', passenger);
        if (status == 0) {
            Request.get('/driver_cancel_one_passenger?driver_id=' + JSON.parse(localStorage.user).user_id + '&tran_id=' + rideId + '&pass_id=' + passenger.info.id, function (data) {
                NotifyService.success('<span> status updated !<br/> ' + passenger.info.f_name + ' will be notified</span>');
            })
        } else {
            Request.get('/driver_response_to_request?tran_id=' + rideId + '&pass_id=' + passenger.info.id + '&reply=' + status, function (data) {
                if (!data.error) {
                    NotifyService.success('<span> status updated !<br/> ' + passenger.info.f_name + ' will be notified</span>');
                }
            })
        }
    }
    $scope.driverCancelDrive = function (driveId) {
        Request.get('/driver_cancel?driver_id=' + JSON.parse(localStorage.user).user_id + '&tran_id=' + driveId, function (data) {
            if (!data.error) {
                NotifyService.success('<span> status updated !<br/> all passengers  will be notified</span>');
            }
        })
    };

    $scope.passengerCancelDrive = function(driveId,status){
        if(status=='approved' || status=='denied'){
            Request.get('/hiker_cancel?hiker_id='+JSON.parse(localStorage.user).user_id+'&tran_id=' + driveId, function (data) {
                if (!data.error) {
                    NotifyService.success('<span> status updated !<br/> ' + passenger.info.f_name + ' will be notified</span>');
                }
            });
        }else{
            Request.get('/cancel_request?hiker_id='+JSON.parse(localStorage.user).user_id+'&tran_id=' + driveId, function (data) {
                if (!data.error) {
                    NotifyService.success('<span> status updated !<br/> ' + passenger.info.f_name + ' will be notified</span>');
                }
            });

        }

    };

    $scope.updateMessage = function (key, value) {
        Request.get('/modify_msg?user_id=' + JSON.parse(localStorage.user).user_id + '&tran_id=' + key + '&msg=' + value.msg, function (data) {
            NotifyService.success('<span> Message updated </span>!');
        })
    }
});
