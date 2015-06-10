/**
 * Created by Michael on 5/2/2015.
 */

angular.module('joynRideApp').factory('Common', function () {
    return {
        objToArr: function (obj) {
            var arr = [];
            for (var key in obj) {
                arr.push(obj[key]);
            }
            return arr;
        }
    }
});