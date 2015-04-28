/**
 * Created by Michael on 4/22/2015.
 */
angular.module('joynRideApp').controller('MainController', function ($scope,$window) {
    window.scope = $scope

    $scope.displayMap=false;
    $scope.directionsService = new google.maps.DirectionsService();
    $scope.options = {
        driver: false,
        passenger: false

    };
    $scope.map = {
        center: {
            latitude: 32.087080,
            longitude: 34.760682
        },
        zoom: 12,
        markers: {
            from:{
                coordinates:{
                    latitude:null,
                    longitude:null
                }
            },
            to:{
                coordinates:{
                    latitude:null,
                    longitude:null
                }
            }
        }
    }

    $scope.types = [{
        name:'driver',
        h1:'Publish A Ride',
        h3:'publish travels you want hitchhikers to join'
    },{
        name:'passenger',
        h1:'Join hitch',
        h3:'see available travels that suit you best'
    }
    ]
    $scope.alert = function(message){
        $window.alert(message);
    }
    $scope.selectTransport = function (option) {
        for (var key in $scope.options) {
            if (option === key) {
                $scope.options[key] = !$scope.options[key]
            } else {
                $scope.options[key] = false;
            }
        }
    }

    $scope.getMiddle = function(x,y){
        return (x+y)/2;
    }
    $scope.showRoute = function(){
        //$scope.displayMap=!$scope.displayMap;
        if($scope.map.from && $scope.map.to){
            $scope.map.center.latitude =  $scope.getMiddle($scope.map.from.geometry.location.lat(),$scope.map.to.geometry.location.lat());
            $scope.map.center.longitude =  $scope.getMiddle($scope.map.from.geometry.location.lng(),$scope.map.to.geometry.location.lng());

            $scope.request = {
                origin: new google.maps.LatLng( $scope.map.from.geometry.location.lat(),$scope.map.from.geometry.location.lng()),
                destination: new google.maps.LatLng($scope.map.to.geometry.location.lat(),$scope.map.to.geometry.location.lng()),
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            };
            initializeRoute();
        }
    };
    $scope.$watch('map.from', function() {
        locationChanged('from');
    });

    $scope.$watch('map.to', function() {
        locationChanged('to');
    });

    function locationChanged(location){
        if($scope.map[location] && $scope.map[location].address_components){
            console.log(location,' - ',$scope.map[location]);
            $scope.map.markers[location].coordinates={
                latitude:$scope.map[location].geometry.location.lat(),
                longitude:$scope.map[location].geometry.location.lng()
            }
            $scope.showRoute();
        }

    }

    function initializeRoute()
    {
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
        directionsService.route($scope.request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }
        });

    };
});