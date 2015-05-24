/**
 * Created by Michael on 4/22/2015.
 */
// create the module and name it joynRideApp
var joynRideApp = angular.module('joynRideApp', [
    'ngMaterial',
    'ngRoute',
    'uiGmapgoogle-maps',
    'google.places',
    'cgNotify',
    'ui.bootstrap',
    'ngTable'
]);

joynRideApp.config(function($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;
});