/**
 * Created by Michael on 5/21/2015.
 */
/**
 * Created by Michael on 5/21/2015.
 */
angular.module('joynRideApp').controller('UpdateInfoController', function ($scope, $http, $window, $location, config, Request) {
    $scope.user = {};

    Request.get('/get_personal_info.php?id=' + JSON.parse(localStorage.user).user_id, function (userInfo) {
        $scope.user = userInfo;
    });
});

