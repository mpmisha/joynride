/**
 * Created by Michael on 5/2/2015.
 */

angular.module('joynRideApp').factory('Auth', function () {
    return {
        isLoggedIn: function () {
            return (localStorage.user && JSON.parse(localStorage.user).token == '123');
        },
        getUser: function () {
            return localStorage.user ? JSON.parse(localStorage.user) : {}
        }
    }
});