/**
 * created by harbon
 * date:2014-9-5
 */
atMoon.controller('privateTalkCtrl',['$scope','myService','$ionicScrollDelegate', function ($scope, myService, $ionicScrollDelegate) {

    myService.getMessages($scope);
    $scope.sendMyMessage = function () {
        myService.sendMyMessage($scope, $scope.myMessage)
        $scope.myMessage = '';
    }
    $scope.$watch(function (){
        return $scope.messages.length
    },function () {

        $ionicScrollDelegate.$getByHandle('scrollBottom').scrollBottom(true);
    })


}])