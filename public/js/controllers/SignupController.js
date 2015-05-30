/**
 * Created by Michael on 5/1/2015.
 */
angular.module('joynRideApp').controller('SignupController', function ($scope,NotifyService,Request) {
    window.scope = $scope;
    $scope.user = {};

    $scope.passwordConfirmed = function () {
        return $scope.user.password && $scope.user.passwordRepeat && ($scope.user.password == $scope.user.passwordRepeat)
    }
    $scope.signUp = function () {
        Request.get('/new_user?userName=' + $scope.user.user_name + '&password=' + $scope.user.password, //TODO:check currect file format
            function (data) {
                if(data.error){
                    NotifyService.fail('<span>'+data.error+'</span>')
                }else{
                    Request.get('/personal_info_insertion?user_id='+data.user_id+'&first_name='+$scope.user.f_name+'&last_name='+$scope.user.l_name+'&phone_number='+$scope.user.phone+'&alt_email_add='+$scope.user.alt_mail+'&picture=bullshit',function(data){
                        NotifyService.success('<span>Signed up successfully</span>')
                    },function(err){
                        NotifyService.fail('<span>There was an error! please try again later</span> ('+err+')')
                    });
                }
            }, function (err) {
                NotifyService.fail('<span>There was an error! please try again later</span> ('+err+')')
            })
        console.log("user - ", $scope.user);
    };

});