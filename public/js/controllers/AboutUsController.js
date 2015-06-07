/**
 * Created by Michael on 4/22/2015.
 */
angular.module('joynRideApp').controller('AboutController', function($scope) {
    $scope.message = 'Look! I am an about page.';
    $scope.members=[
        {
            fname:'Michael',
            lname:'Merjanov',
            text:'A dude.. just a dude',
            pic:'../img/michael.jpg'
        },{
            fname:'Shany',
            lname:'Radai',
            text:'A girl that makes things happen',
            pic:'../img/profile.jpg'
        },{
            fname:'Daniel',
            lname:'Litvak',
            text:'A dude that does not sleep at all',
            pic:'../img/profile.png'
        },{
            fname:'Guy',
            lname:'familyName',
            text:'A man with no family name!',
            pic:'../img/profile.jpg'
        }
    ]
});