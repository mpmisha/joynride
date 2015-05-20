/**
 * Created by Michael on 4/24/2015.
 */


angular.module('joynRideApp').controller('NavigationController', ['$scope', '$rootScope', '$location', 'Auth', function ($scope, $rootScope, $location, Auth) {

    $scope.user = {};
    if (Auth.isLoggedIn()) {
        $scope.user = Auth.getUser();
        console.log("user :",$scope.user)
    }
    $scope.menu = [
        {label: 'Home', route: '/'},
        {label: 'rank', route: '/rank'},
        {label: 'About', route: '/about'},
        {label: 'Contact', route: '/contact'}
    ]

    $scope.menuActive = '/';
    $rootScope.$on('$routeChangeSuccess', function (e, curr, prev) {
        $scope.menuActive = $location.path();
        $scope.user = Auth.getUser();
    });

    $scope.logout = function () {
        localStorage.clear();
        $location.path('/login');
    }
    $scope.edit = function () {
        $location.path('/editUser');
    }
    $scope.isLoggedIn = function () {
        return Auth.isLoggedIn();
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