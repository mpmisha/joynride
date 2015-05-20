/**
 * Created by Michael on 4/22/2015.
 */
angular.module('joynRideApp').controller('RankController', function ($scope) {
    window.scope=$scope;
    $scope.rankConfig = {
        maxRating: 5,
        isReadonlyRank: false,
        questions: [{
            text: 'How do you feel?'
        }, {
            text: 'How was the ride?'
        }, {
            text: 'please rank the atmosphere:'
        }]
    };

    $scope.ridesToRank = [];
    var rideToRank;
    for (var i = 0; i < 5; i++) {
        rideToRank = {
            id:i,
            rate: 3
        };
        $scope.ridesToRank.push(rideToRank);
    }
    ;


    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    };

    $scope.ratingStates = [
        {stateOn: 'star full', stateOff: 'star empty'},
    ];


});