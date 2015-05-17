/**
 * Created by Michael on 5/1/2015.
 */
angular.module('joynRideApp').controller('LoginController', function ($scope, $http, $window, $location, notify, config, Request) {
    window.scope = $scope;
    $scope.config = config;
    $scope.user = {
        userName: '',
        password: ''
    }
    $scope.signUp = function(){
        console.log('yo!');
        $location.path('/signUp');
    }
    $scope.submitForm = function () {
        //Request.get('/authentication?userName='+$scope.user.userName+'&password='+$scope.user.password,function(data){ //TODO:switch to this
        Request.get('/authentication?userName=guylitvak&password=g123', function (data) {
            Request.get('/get_personal_info.php?id=' + data.user_id, function (userInfo) {
                userInfo.ridesToRank = 5;
                userInfo.user_id = data.user_id;
                userInfo.token = '123'; //TODO:for authentication purpose...
                localStorage.setItem('user', JSON.stringify(userInfo));
                var notifyParams = {
                    duration: 5000,
                    messageTemplate: '<span>Hi ' + userInfo.f_name + '<br/>you need to rank ' + userInfo.ridesToRank + ' rides <br/><a href="#">Rank Now</a></span>',
                    classes: []
                };
                if (userInfo.ridesToRank > 0 && userInfo.ridesToRank <= 2) {
                    notifyParams.classes.push('alert-success');
                } else if (userInfo.ridesToRank > 2 && userInfo.ridesToRank <= 4) {
                    notifyParams.classes.push('alert-warning');
                } else if (userInfo.ridesToRank > 4) {
                    notifyParams.classes.push('alert-danger');
                }
                if (userInfo.ridesToRank > 0) {
                    notify(notifyParams);
                }
                $location.path('/home');

            }, function (err) {
                console.log('user data error -', err);
            });
        }, function (error) {
            $window.alert(error)
        })

    }
});