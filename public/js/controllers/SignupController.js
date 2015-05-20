/**
 * Created by Michael on 5/1/2015.
 */
angular.module('joynRideApp').controller('SignupController', function ($scope) {
    window.scope = $scope;
    $scope.user = {};

    $scope.passwordConfirmed = function () {
        return $scope.user.password && $scope.user.passwordRepeat && ($scope.user.password == $scope.user.passwordRepeat)
    }

});