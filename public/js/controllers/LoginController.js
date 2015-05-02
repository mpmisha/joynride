/**
 * Created by Michael on 5/1/2015.
 */
angular.module('joynRideApp').controller('LoginController', function($scope,$http,$window,$location) {
    $scope.user={
        email:'',
        password:''
    }

    $scope.submitForm = function(){
        console.log('sending')
        $http.post('/api/login',$scope.user).
            success(function(data, status, headers, config) {
                var userInfo = JSON.stringify(data);
                localStorage.setItem('user',userInfo);
                $location.path('/home');
            }).
            error(function(data, status, headers, config) {
                $window.alert(data.message)
            });
    }
});