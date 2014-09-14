/**
 * created by harbon
 * date:2014-9-5
 */
atMoon.controller('roomsCtrl',['$scope','myService','$state', function ($scope, myService, $state) {
//    $scope.rooms = [{img_src:'img/ionic.png',title:'测试标题',count:'10'}]
//    获取房间列表
   myService.getRooms($scope);
    $scope.enterRoom = function (index) {
        myService.enterRoom($scope, index);
    }


}])