/**
 * Created by Michael on 4/22/2015.
 */
angular.module('joynRideApp').controller('MainController', function ($scope, $window, Request, ngTableParams) {
    window.scope = $scope
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
            }
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
                $("body").animate({scrollTop: "700px"}, 1000);
            } else {
                $scope.options[key] = false;
            }
        }
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

    $scope.sendRequest = function () {
        Request.get('/find_travels?srcx=31.773687&srcy=34.684409&dstx=2&dsty=8&date=2010-05-07&time=15:00:00&max_price=15'
            , function (data) {
                getTravelsInfo(data);
            }
            , function (err) {
                console.log('err - ', err);
            })
    };

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

        Request.get('/declare_request?tran_id=' + travel.drive.id + '&pass_id=' + JSON.parse(localStorage.user).user_id + '&src=' + travel.drive.source + '&src_pass_x=' + $scope.map.markers.from.coordinates.latitude + '&src_pass_y=' + $scope.map.markers.from.coordinates.longitude + '&dst=' + travel.drive.dest + '&dst_pass_x=' + $scope.map.markers.to.coordinates.latitude + '&dst_pass_y=' + $scope.map.markers.to.coordinates.longitude + '&status=0',
            function (data) {
                console.log('data  -', data)
            },
            function (err) {
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
            console.log(location, " -- ", $scope.map[location])
        }

    }

    function initializeRoute() {
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var mapOptions =
        {
            zoom: 9,
            center: $scope.request.origin,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        };
        var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
        directionsDisplay.setMap(map);
        //calc router
        var directionsService = new google.maps.DirectionsService();
        directionsService.route($scope.request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });

    };
})
;