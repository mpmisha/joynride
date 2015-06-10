/**
 * Created by Michael on 5/16/2015.
 */

angular.module('joynRideApp').factory('Request', ['$http', 'config','usSpinnerService','$rootScope',function ($http, config,usSpinnerService,$rootScope) {
    var spinneractive = false;
    $rootScope.$on('us-spinner:spin', function(event, key) {
        spinneractive = true;

    });

    $rootScope.$on('us-spinner:stop', function(event, key) {
        spinneractive = false;
    });
    function addDotPhpIfNeeded(url){
        if(url.indexOf('.php?')==-1){
            url = url.replace('?','.php?');
        }
        return url;
    }
    return {
        get: function (url, successCallback, errorCallback) {
            url = url.replace(/["']/g, "\"")
            if (!spinneractive) {
                usSpinnerService.spin('spinner-1');
            }
            console.warn('get request- ',config.baseUrl + url);
            url = addDotPhpIfNeeded(url);
            $http.jsonp(config.baseUrl + url + (url.indexOf('?') === -1 ? '?' : '&' + 'callback=JSON_CALLBACK'))
            //$http.get(config.baseUrl + url)
                .success(function (data) {
                    console.warn('get response- ',data);
                    if (spinneractive) {
                        usSpinnerService.stop('spinner-1');
                    }
                    if (data.error) {
                        if (errorCallback) {
                            errorCallback(data.error)
                        } else {
                            //console.log('error -', data.error);
                        }
                    }
                    successCallback(data);
                }).error(function (err) {
                    if (spinneractive) {
                        usSpinnerService.stop('spinner-1');
                    }
                    if (errorCallback) {
                        errorCallback(err)
                    } else {
                        console.log('error -', err);
                    }
                });
        }
    }
}]);