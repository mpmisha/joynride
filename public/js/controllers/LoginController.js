/**
 * Created by Michael on 5/1/2015.
 */
angular.module('joynRideApp').controller('LoginController', function ($scope, $http, $window, $location, config, Request, NotifyService, NotificationService, Common) {
    window.scope = $scope;
    $scope.config = config;
    $scope.user = {
        userName: '',
        password: ''
    }
    $scope.signUp = function () {
        $location.path('/signup');
    }
    $scope.submitForm = function () {
        //Request.get('/authentication?userName=guylitvak&password=g123', function (data) {
        Request.get('/authentication?userName=' + $scope.user.userName + '&password=' + $scope.user.password, function (data) { //TODO:switch to this
            //console.log("authentication good - ", data);
            if (!data.error && data.is_active!=0 ) {
                Request.get('/get_personal_info?id=' + data.user_id, function (userInfo) {
                    //console.log("get_personal_info - ", userInfo);
                    userInfo.ridesToRank = 5;
                    userInfo.user_id = data.user_id;
                    userInfo.token = '123'; //  TODO:for authentication purpose...
                    localStorage.setItem('user', JSON.stringify(userInfo));
                    NotificationService.updateNotifications(function () {
                        NotificationService.getNotifications(function (notifications) {
                            window.notif = notifications;
                        })
                    });

                    Request.get('/need_to_rate?user_id=' + userInfo.user_id, function (data) {
                        if (!data.error) {
                            var needToRank = Common.objToArr(data.toRate);


                            var msg = '<span>Hi ' + ( userInfo.f_name ? userInfo.f_name : "there" ) + '<br/>you need to rank ' + needToRank.length + ' ride' + (needToRank.length > 1 ? "s" : "") + ' <br/><a href="#/rank">Rank Now</a></span>';
                            var duration = 5000

                            if (needToRank.length > 0 && needToRank.length <= 2) {
                                NotifyService.success(msg, duration);
                            } else if (needToRank.length > 2 && needToRank.length <= 4) {
                                NotifyService.warning(msg, duration);
                            } else if (needToRank.length > 4) {
                                NotifyService.fail(msg, duration);
                            }

                            if (!(userInfo.f_name && userInfo.l_name && userInfo.phone && userInfo.uni_mail && userInfo.alt_mail)) {
                                var msg = '<span>There is some missing fields in your user information<br/> please fill them in <a href="#/editInfo">here</a></span>';
                                var duration = 5000
                                NotifyService.fail(msg, duration);

                            }
                            $location.path('/home');
                        }
                    })
                }, function (err) {
                    //console.log('user data error -', err);
                });
            } else if(data.is_active==0) {
                NotifyService.fail('<span>could it be you did not activate your account?</span>');
            }else{
                NotifyService.fail('<span>There has been an error!</span>');
            }
        })
    }
});