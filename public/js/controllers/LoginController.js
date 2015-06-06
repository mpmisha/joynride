/**
 * Created by Michael on 5/1/2015.
 */
angular.module('joynRideApp').controller('LoginController', function ($scope, $http, $window, $location, config, Request, NotifyService) {
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
            if (!data.error) {
                Request.get('/get_personal_info?id=' + data.user_id, function (userInfo) {
                    //console.log("get_personal_info - ", userInfo);
                    userInfo.ridesToRank = 5;
                    userInfo.user_id = data.user_id;
                    userInfo.token = '123'; //TODO:for authentication purpose...
                    localStorage.setItem('user', JSON.stringify(userInfo));
                    Request.get('/need_to_rate?user_id='+userInfo.user_id,function(needToRank){
                      if(!needToRank.error){
                          window.scope.needToRank = needToRank;
                          //TODO: make it work with real output!
                          needToRank = {
                              toRate:[10,4,47]
                          };

                          var msg = '<span>Hi ' +( userInfo.f_name?userInfo.f_name:"there" )+ 'xxx<br/>you need to rank ' + needToRank.toRate.length+ ' rides <br/><a href="#/rank">Rank Now</a></span>';
                          var duration = 5000

                          if (userInfo.ridesToRank > 0 && userInfo.ridesToRank <= 2) {
                              NotifyService.success(msg, duration);
                          } else if (userInfo.ridesToRank > 2 && userInfo.ridesToRank <= 4) {
                              NotifyService.warning(msg, duration);
                          } else if (userInfo.ridesToRank > 4) {
                              NotifyService.fail(msg, duration);
                          }

                          if(!(userInfo.f_name && userInfo.l_name && userInfo.phone && userInfo.uni_mail && userInfo.alt_mail)){
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
            }else{
                NotifyService.fail('<span>'+data.error+'</span>');
            }
        })
    }
});