/**
 * Created by Michael on 4/22/2015.
 */
angular.module('joynRideApp').controller('RankController', function ($scope,Request,NotifyService) {
    window.scope=$scope;
    $scope.rankConfig = {
        maxRating: 5,
        isReadonlyRank: false,
        questions: [{
            text: 'how accurate was the driver?',
            model:'punc_rate'
        }, {
            text: 'How safe did you feel during the ride?',
            model:'safety_rate'
        }, {
            text: 'please rank the atmosphere:',
            model:'atmo_rate'
        },{
            text: 'how was your general feeling:',
            model:'gen_rate'
        }]
    };

    Request.get('/need_to_rate?user_id='+JSON.parse(localStorage.user).user_id,function(needToRank){
        if(!needToRank.error){
            //TODO: make it work with real output!
            needToRank = {
                toRate:[10,4,47]
            };
            for (var i = 0; i < needToRank.toRate.length; i++) {
                (function(i,needToRank){
                    Request.get('/get_transaction_info?tran_id='+needToRank.toRate[i],function(travelInfo){
                        Request.get('/get_personal_info?id='+travelInfo.driver_id,function(driverInfo){
                            rideToRank = {
                                id:needToRank.toRate[i],
                                info:travelInfo,
                                rate: 3,
                                driverInfo:driverInfo,
                                date:travelInfo.date,
                                time:travelInfo.time
                            };
                            $scope.ridesToRank.push(rideToRank);
                        })
                    });
                })(i,needToRank)
            };
        }
    });

    $scope.ridesToRank = [];
    var rideToRank;



    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };

    $scope.ratingStates = [
        {stateOn: 'star full', stateOff: 'star empty'},
    ];

    $scope.dynamicPopover = {
        rateTemplate: 'rateTemplate.html',
        driverTemplate: 'driverTemplate.html',
        title: 'driver rates'
    };
    function removeRide(id){
        for(var i=0;i<$scope.ridesToRank.length;i++){
            if($scope.ridesToRank[i].id == id){
                $scope.ridesToRank.splice(i, 1);
            }
        }
    }
    $scope.submit = function(ride){
        if(!ride.punc_rate || !ride.safety_rate || !ride.atmo_rate || !ride.gen_rate){
            NotifyService.fail('<span>Your need to rank all categories<br/>');
        }else{
            Request.get('/rate_insertion?tran_id='+ride.id+'&pass_id='+JSON.parse(localStorage.user).user_id+'&driver_id='+ride.info.driver_id+'&punc_rate='+ride.punc_rate.rate+'&safety_rate='+ride.safety_rate.rate+'&atmo_rate='+ride.atmo_rate.rate+'&gen_rate='+ride.gen_rate.rate,function(data){
                if(!data.error){
                    NotifyService.success('<span>Your rank has been submitted!<br/>');
                    removeRide(ride.id);
                }
            })
        }

    }

});