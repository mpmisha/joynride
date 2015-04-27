/**
 * Created by Michael on 4/22/2015.
 */

joynRideApp.config(function($routeProvider){
    $routeProvider.when('/',{
        templateUrl : 'views/home.html',
        controller : 'MainController'
    })
    .when('/about',{
        templateUrl: 'views/about.html',
        controller : 'AboutController'
    })
    .when('/contact', {
        templateUrl : 'views/contact.html',
        controller  : 'ContactController'
    });
});