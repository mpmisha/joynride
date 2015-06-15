/**
 * Created by Michael on 4/22/2015.
 */
angular.module('joynRideApp').controller('AuthController', function($scope,$location,Request) {
    if($location.search().uid) {
        Request.get('/set_active_user?user_id=' + $location.search().uid, function (data) {
            if(!data.errror){
                NotifyService.success('<span>The activation has been successful please login to start using the site!</span>')
            }else{
                NotifyService.fail('<span>Somthing went wrong! please refer to the site admin!</span>')
            }

        });
    }
});