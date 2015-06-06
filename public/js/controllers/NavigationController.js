/**
 * Created by Michael on 4/24/2015.
 */


angular.module('joynRideApp').controller('NavigationController', ['$scope', '$rootScope', '$location','$interval', 'Auth','NotificationService', function ($scope, $rootScope, $location, $interval, Auth,NotificationService) {

    $scope.user = {};
    if (Auth.isLoggedIn()) {
        $scope.user = Auth.getUser();
        //console.log("user :",$scope.user)
    }
    $scope.menu = [
        {label: 'Home', route: '/'},
        {label: 'rank', route: '/rank'},
        {label: 'About', route: '/about'},
        {label: 'My Drives', route: '/myDrives'},
        {label: 'Contact', route: '/contact'}
    ]
    $scope.dynamicPopover = {
        notificationTemplate: 'notificationTemplate.html'
    };

    function updateNotifications(){
        NotificationService.getNotifications(function(notifications){
            $scope.notifications = notifications;
            NotificationService.countNotifications(function(count){
                console.log("counting...");
                $scope.notifCount=count;
            })
        })
    }
    updateNotifications();
    $interval(updateNotifications,20000);

    $scope.menuActive = '/';
    $rootScope.$on('$routeChangeSuccess', function (e, curr, prev) {
        $scope.menuActive = $location.path();
        $scope.user = Auth.getUser();
        updateNotifications();
    });

    $scope.logout = function () {
        localStorage.clear();
        NotificationService.resetNotifications();
        $location.path('/login');

    }
    $scope.edit = function () {
        $location.path('/editUser');
    }
    $scope.isLoggedIn = function () {
        return Auth.isLoggedIn();
    }
    $scope.getUserName = function(){
        return JSON.parse(localStorage.user).username
    }

}]);


angular.module('joynRideApp').run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event,next) {
        if (!Auth.isLoggedIn() && next.$$route.originalPath !='/signup' ) {
            //console.log('DENY');
            $location.path('/login');
        } else {
            //console.log('ALLOW');
        }
    });
}]);