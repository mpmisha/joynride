/**
 * Created by Michael on 4/22/2015.
 */
angular.module('joynRideApp').controller('AboutController', function($scope) {
    $scope.message = 'Look! I am an about page.';
    $scope.members=[
        {
            name:'Michael Merjanov',
            text:'A dude who does things',
            pic:'../img/michael.jpg'
        },{
            name:'Shany Radai',
            text:'A girl that makes things happen',
            pic:'../img/profile.jpg'
        },{
            name:'Daniel Litvak',
            text:'A dude that does not sleep at all',
            pic:'../img/profile.png'
        },{
            name:'Guy familyName',
            text:'A man with no family name!',
            pic:'../img/profile.jpg'
        }
    ]
});