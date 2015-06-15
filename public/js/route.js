/**
 * Created by Michael on 4/22/2015.
 */

joynRideApp.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainController'
    }).when('/home', {
        templateUrl: 'views/home.html',
        controller: 'MainController'
    }).when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
    }).when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupController'
    }).when('/editInfo', {
        templateUrl: 'views/editUserInfo.html',
        controller: 'EditUserInfoController'
    }).when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutController'
    }).when('/auth', {
        templateUrl: 'views/auth.html',
        controller: 'AuthController'
    }).when('/contact', {
        templateUrl: 'views/contact.html',
        controller: 'ContactController'
    }).when('/rank', {
        templateUrl: 'views/rank.html',
        controller: 'RankController'
    }).when('/myDrives', {
        templateUrl: 'views/myDrives.html',
        controller: 'MyDrivesController'
    }).when('/404', {
        templateUrl: 'views/404.html'
    }).otherwise({redirectTo: '/404'});

});


