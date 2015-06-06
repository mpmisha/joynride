/**
 * Created by Michael on 4/22/2015.
 */
angular.module('joynRideApp').controller('MainController', function ($scope, $window, Request, ngTableParams, NotifyService) {
    $scope.displayMap = false;
    $scope.directionsService = new google.maps.DirectionsService();
    $scope.options = {
        driver: false,
        passenger: false

    };
    $scope.ride = {
        time: new Date(),
        date: new Date(),
        maxPrice: 100,
        maxPlaces: 4
    };

    $scope.map = {
        date: new Date(),
        time: null,
        center: {
            latitude: 32.087080,
            longitude: 34.760682
        },
        zoom: 12,
        markers: {
            from: {
                coordinates: {
                    latitude: 31.804,
                    longitude: 34.655
                }
            },
            to: {
                coordinates: {
                    latitude: 32.085,
                    longitude: 34.781
                }
            },
            passing: []
        }
    }

    $scope.types = [{
        name: 'driver',
        h1: 'Publish A Ride',
        h3: 'publish travels you want hitchhikers to join'
    }, {
        name: 'passenger',
        h1: 'Join hitch',
        h3: 'see available travels that suit you best'
    }
    ]

    $scope.dynamicPopover = {
        rateTemplate: 'rateTemplate.html',
        driverTemplate: 'driverTemplate.html',
        title: 'driver rates'
    };

    $scope.alert = function (message) {
        $window.alert(message);
    }
    $scope.selectTransport = function (option) {
        for (var key in $scope.options) {
            if (option === key) {
                $scope.options[key] = !$scope.options[key]
                $("body").animate({scrollTop: "400px"}, 1000);
            } else {
                $scope.options[key] = false;
            }
        }
    }
    $scope.clearForm = function () {
        $scope.map.from = null;
        $scope.map.to = null;
        $scope.map.markers = {
            from: {coordinates: {latitude: 31.804, longitude: 34.655}},
            to: {coordinates: {latitude: 32.085, longitude: 34.781}}
        };
        $scope.ride.date = new Date();
        $scope.ride.maxPrice = 0;
        $scope.hours = 0;
        $scope.minutes = 0;
        $scope.travelInfoArr = null;
    }

    $scope.getMiddle = function (x, y) {
        return (x + y) / 2;
    }
    $scope.showRoute = function () {
        //$scope.displayMap=!$scope.displayMap;
        if ($scope.map.from && $scope.map.to) {
            $scope.map.center.latitude = $scope.getMiddle($scope.map.from.geometry.location.lat(), $scope.map.to.geometry.location.lat());
            $scope.map.center.longitude = $scope.getMiddle($scope.map.from.geometry.location.lng(), $scope.map.to.geometry.location.lng());

            $scope.request = {
                origin: new google.maps.LatLng($scope.map.from.geometry.location.lat(), $scope.map.from.geometry.location.lng()),
                destination: new google.maps.LatLng($scope.map.to.geometry.location.lat(), $scope.map.to.geometry.location.lng()),

                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            initializeRoute();
        }
    };
    $scope.$watch('map.from', function () {
        locationChanged('from');
    });

    $scope.$watch('map.to', function () {
        locationChanged('to');
    });

    $scope.sendRequest = function () { //passenger presses submit button
        //Request.get('/find_travels?srcx=31.773687&srcy=34.684409&dstx=2&dsty=8&date=2010-05-07&time=15:00:00&max_price=15&user_id='+JSON.parse(localStorage.user).user_id
        Request.get('/find_travels?srcx=' + $scope.map.from.geometry.location.A + '&srcy=' + $scope.map.from.geometry.location.F + '&dstx=' + $scope.map.to.geometry.location.A + '&dsty=' + $scope.map.to.geometry.location.F + '&time=' + extractTime($scope.ride.time) + '&date=' + extractDate($scope.ride.date) + '&max_price='+$scope.ride.maxPrice+'&user_id=' + JSON.parse(localStorage.user).user_id
            , function (data) {
                getTravelsInfo(data);
            }
            , function (err) {
                console.log('err - ', err);
            })
    };
    function extractTime(time) {
        return time.getHours() + ':' + time.getMinutes() + ':00'
    }

    function extractDate(date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    }

    function getPath() {
        var path = [], obj;
        for (var marker in $scope.map.markers.passing) {
            obj = {
                x: $scope.map.markers.passing[marker].position.A,
                y: $scope.map.markers.passing[marker].position.F
            }
            path.push(obj);
        }
        return JSON.stringify(path);
    }

    $scope.submitRide = function () { //driver presses submit button

        //Request.get('/insert_transaction?user_id='+JSON.parse(localStorage.user).user_id+'&src=Ashdod&srcx=31.804381&srcy=34.655314&dst=Tel-Aviv&dstx=32.0852999&dsty=34.7817676&time=15:25:00&date=2010-05-07&price=15&free_sits=4&radius=20&path=[{"x":31.804381,"y":34.655314},{"x":2,"y":8},{"x":67,"y":9}]'
        Request.get('/insert_transaction?user_id=' + JSON.parse(localStorage.user).user_id + '&src=' + $scope.map.from.name + '&srcx=' + $scope.map.from.geometry.location.A + '&srcy=' + $scope.map.from.geometry.location.F + '&dst=' + $scope.map.to.name + '&dstx=' + $scope.map.to.geometry.location.A + '&dsty=' + $scope.map.to.geometry.location.F + '&time=' + extractTime($scope.ride.time) + '&date=' + extractDate($scope.ride.date) + '&price=' + $scope.ride.price + '&free_sits=' + $scope.ride.maxPlaces + '&radius=' + $scope.ride.radius + '&path=' + getPath()
            , function (data) {
                NotifyService.success('<span>Your ride has been published<br/>have a nice trip!');
                console.log('insert_transaction data -', data);
            }
            , function (err) {
                NotifyService.fail('<span>There was a problem with adding your ride<br/>please try again later!');
                console.log('insert_transaction err -', err);
            })
    }

    function getTravelsInfo(travelArr) {
        $scope.travelInfoArr = [];
        for (var i = 0; i < travelArr.length; i++) {
            (function (index) {
                var id = travelArr[i], travelObj = {};

                Request.get('/get_transaction_info?tran_id=' + travelArr[i]
                    , function (data) {
                        travelObj.drive = data;
                        travelObj.drive.id = id;
                        travelObj.driver = {};
                        Request.get('/get_personal_info?id=' + travelObj.drive.driver_id
                            , function (data) {
                                travelObj.driver = data;
                                travelObj.driver.id = travelObj.drive.driver_id;
                                Request.get('/return_rate?driver_id=' + travelObj.drive.driver_id
                                    , function (data) {
                                        travelObj.driver.rate = data;
                                        travelObj.driver.avg = getAvgRate(data);
                                        $scope.travelInfoArr.push(travelObj);
                                        scrollToResults();
                                        updateData();
                                    }, function (err) {
                                        travelObj.driver.rate = null;
                                        travelObj.driver.avg = getAvgRate(data);
                                        $scope.travelInfoArr.push(travelObj);
                                        scrollToResults();
                                        updateData();
                                    });

                            }, function (err) {
                                console.log('err2', err)
                            });
                    }
                    , function (err) {
                        console.log('err1 - ', err);
                    })
            }(i));
        }
    }

    $scope.selectRide = function (travel) {

        Request.get('/join_request?tran_id=' + travel.drive.id + '&id=' + JSON.parse(localStorage.user).user_id + '&src=' + travel.drive.source + '&src_pass_x=' + $scope.map.markers.from.coordinates.latitude + '&src_pass_y=' + $scope.map.markers.from.coordinates.longitude + '&dst=' + travel.drive.dest + '&dst_pass_x=' + $scope.map.markers.to.coordinates.latitude + '&dst_pass_y=' + $scope.map.markers.to.coordinates.longitude,
            function (data) {
                if (!data.error) {
                    console.log('data  -', data)
                    NotifyService.success('<span>The request has been submited!<br/> Watch out for updates soon!</span>')
                } else {
                    console.error(data);
                }
            },
            function (err) {
                NotifyService.success('<span>Your request has been sent <br/>watch out for updated on the update page!!');
                console.log("err - ", err);
            });
    }
    $scope.sortTableBy = function (field) {
        if ($scope.sort[field]) {
            $scope.sort[field] = ($scope.sort[field] == 'asc' ? 'desc' : 'asc');
        } else {
            $scope.sort[field] = 'asc';
        }
        console.log('$scope.sort[' + field + '] - ', $scope.sort[field])
        $scope.tableParams.reload();
    }
    $scope.sort = {id: 'asc'};
    function updateData() {
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: $scope.sort    // initial sorting
        }, {
            total: $scope.travelInfoArr.length, // length of data
            getData: function ($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.travelInfoArr, params.orderBy()) :
                    $scope.travelInfoArr;

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    }

    function scrollToResults() {
        var height;
        height = 700 + $scope.travelInfoArr.length * 100;
        $("body").animate({scrollTop: height + "px"}, 500);
    }

    function getAvgRate(ranks) {
        console.log('ranks = ', ranks);
        var sum = 0;
        var count = 0;
        for (var rank in ranks) {
            sum += ranks[rank];
            count++;
        }
        return sum / count;
    }

    function locationChanged(location) {
        if ($scope.map[location] && $scope.map[location].address_components) {
            $scope.map.markers[location].coordinates = {
                latitude: $scope.map[location].geometry.location.lat(),
                longitude: $scope.map[location].geometry.location.lng()
            };
            $scope.showRoute();
        }
    }

    var map;

    function initializeRoute() {
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var mapOptions =
        {
            zoom: 9,
            center: $scope.request.origin,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        };
        map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
        $scope.gMap = map;
        directionsDisplay.setMap(map);
        //calc router
        var directionsService = new google.maps.DirectionsService();
        directionsService.route($scope.request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                showSteps(response);
            }
        });
    };
    function showSteps(directionResult) {
        // For each step, place a marker, and add the text to the marker's
        // info window. Also attach the marker to an array so we
        // can keep track of it and remove it when calculating new
        // routes.
        var myRoute = directionResult.routes[0].legs[0];
        $scope.map.markers.passing = [];
        for (var i = 0; i < myRoute.steps.length; i++) {
            var marker = new google.maps.Marker({
                position: myRoute.steps[i].start_location,
                map: map
            });
            //attachInstructionText(marker, myRoute.steps[i].instructions);
            $scope.map.markers.passing[i] = marker;
        }
    };
    //function attachInstructionText(marker, text) {
    //    google.maps.event.addListener(marker, 'click', function() {
    //        // Open an info window when the marker is clicked on,
    //        // containing the text of the step.
    //        stepDisplay.setContent(text);
    //        stepDisplay.open(map, marker);
    //    });
    //}

})
;