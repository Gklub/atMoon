atMoon.controller('modalCtrl',['$scope','myService', function ($scope, myService) {
//    创建房间的modal
    $scope.createRoom = function () {
        console.log($scope.roomName);
        console.log($scope.roomDescription)
        myService.createRoom($scope);

    }
}])