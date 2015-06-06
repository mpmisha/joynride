/**
 * Created by Michael on 5/21/2015.
 */
angular.module('joynRideApp').controller('ratingController', function ($scope, $http, $window, $location, config, Request) {

    window.rating = $scope;
    $scope.rating = {}
    Request.get('/return_rate?id=' + JSON.parse(localStorage.user).user_id, function (data) {
        $scope.rating = data;
    }, function () {
        $scope.rating = {
            punctuality: 4,
            safety: 3.5,
            atmosphere: 5,
            general_rank: 4.5
        };
    });

    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };

    $scope.ratingStates = [
        {stateOn: 'star full', stateOff: 'star empty'},
    ];


});