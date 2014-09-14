/**
 * created by harbon
 * date:2014-9-5
 */
atMoon.controller('roomCtrl',['$scope','myService','$ionicScrollDelegate', function ($scope, myService, $ionicScrollDelegate) {

    $scope.sendMyMessage = function () {
        myService.sendMyMessage($scope, $scope.myMessage)
        $scope.myMessage = '';
    }

    $scope.init = function () {
        myService.getMessages($scope);
    }

    $scope.$watch(function (){
        return $scope.messages.length
    },function () {
        $ionicScrollDelegate.$getByHandle('scrollBottom').scrollBottom(true);
    })

}])