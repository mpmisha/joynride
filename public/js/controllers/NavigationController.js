/**
 * Created by Michael on 4/24/2015.
 */
angular.module('joynRideApp').controller('NavigationController', function($scope,$rootScope,$location) {

    $scope.menu = [
        {label:'Home', route:'/'},
        {label:'About', route:'/about'},
        {label:'Contact', route:'/contact'}
    ]


    $scope.menuActive = '/';

    $rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
        $scope.menuActive = $location.path();
    });
});