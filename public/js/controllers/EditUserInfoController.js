/**
 * Created by Michael on 5/1/2015.
 */
angular.module('joynRideApp').controller('EditUserInfoController', function ($scope, $http, $window, $location, config, Request) {
    window.scope = $scope;
    $scope.config = config;
    $scope.user = {};

    Request.get('/get_personal_info?id=' + JSON.parse(localStorage.user).user_id, function (userInfo) {
        $scope.user = userInfo;
    });
    var tabs = {
        'info':0,
        'rating':1,
        'drives':2,
        'updates':3
    }
    //if ($location.search().tab) {
    //    $scope.selectedIndex = tabs[$location.search().tab];
    //}


    $scope.passwordConfirmed = function () {
        return $scope.user.password && $scope.user.passwordRepeat && ($scope.user.password == $scope.user.passwordRepeat)
    }

});