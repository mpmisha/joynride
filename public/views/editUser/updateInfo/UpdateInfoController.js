/**
 * Created by Michael on 5/21/2015.
 */
/**
 * Created by Michael on 5/21/2015.
 */
angular.module('joynRideApp').controller('UpdateInfoController', function ($scope, $http, $window, $location, config, Request, NotifyService) {
    $scope.user = {};
    $scope.pass = {1: 's'};

    window.s = $scope;
    $scope.passwordConfirmed = function () {
        return $scope.user.password && $scope.user.passwordRepeat && ($scope.user.password == $scope.user.passwordRepeat)
    };

    Request.get('/get_personal_info?id=' + JSON.parse(localStorage.user).user_id, function (userInfo) {
        $scope.user = userInfo;
        if($scope.user.pic=='bullshit' ||$scope.user.pic==null ) $scope.user.pic = '../../../img/profile.jpg';
    });


    $scope.updateInfo = function () {
        Request.get('/personal_info_insertion?user_id=' + JSON.parse(localStorage.user).user_id + '&first_name=' + $scope.user.f_name + '&last_name=' + $scope.user.l_name + '&phone_number=' + $scope.user.phone + '&alt_email_add=' + $scope.user.alt_mail + '&picture=bullshit', function (data) {
            NotifyService.success('<span>Info Updated successfully</span>')
        }, function (err) {
            NotifyService.fail('<span>There was an error! please try again later</span> (' + err + ')')
        });
        if ($scope.pass.originalPassword && ( $scope.pass.password == $scope.pass.passwordRepeat)) {
            Request.get('/change_password?user_id=' + JSON.parse(localStorage.user).user_id + '&old_password=' + $scope.pass.originalPassword + '&new_password=' + $scope.pass.password, function (data) {
                if (data.error) {
                    NotifyService.fail('<span>There was an error updating the password - ' + data.error + '</span>')
                } else {
                    NotifyService.success('<span>Password Updated successfully</span>')
                }
            }, function (err) {
                NotifyService.fail('<span>There was an error! please try again later</span> (' + err + ')')
            });
        } else {
            console.log('no passwords update')
        }
    };
});

