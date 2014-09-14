/**
 * created by harbon
 * date:2014-9-5
 */
atMoon.controller('messagesCtrl',['$scope','myService','$state', function ($scope, myService, $state) {
//    $scope.messages = [{user:{name:'SB',avatarUrl:'img/ionic.png'}}]
    myService.getAllPrivateTalk($scope);
    $scope.acceptPrivateTalk = function (index) {

        myService.acceptPrivateTalk($scope, index);

    }
    $scope.messageDelete = function (index) {
        myService.messageDelete($scope, index);
    }

}])