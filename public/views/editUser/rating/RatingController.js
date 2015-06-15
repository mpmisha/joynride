/**
 * Created by Michael on 5/21/2015.
 */
angular.module('joynRideApp').controller('ratingController', function ($scope, $http, $window, $location, config, Request) {

    $scope.rating = {}
    Request.get('/return_rate?driver_id=' + JSON.parse(localStorage.user).user_id, function (data) {
        $scope.rating = {
            punctuality: data.punctuality,
            safety: data.safety,
            atmosphere: data.atmosphere,
            general_rank: data.general_rank
        };
        $scope.amount=data.count;
    });

    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };

    $scope.ratingStates = [
        {stateOn: 'star full', stateOff: 'star empty'},
    ];


});