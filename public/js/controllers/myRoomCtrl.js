/**
 * created by harbon
 * date:2014-9-5
 */
atMoon.controller('myRoomCtrl',['$scope','$ionicModal','myService','$state', function ($scope, $ionicModal, myService, $state) {
//    创建房间的modal
    $ionicModal.fromTemplateUrl('js/pages/createModal.html',function (modal) {
      $scope.modal = modal;
    })
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
//    $scope.myRooms = [{img_src:'img/ionic.png',title:'测试标题',count:'10'}]
//    创建房间
    $scope.enterMyRoom = function (index) {
        myService.enterMyRoom($scope, index)
    }
    $scope.createRoom = function () {
        console.log($scope.roomName);
        console.log($scope.roomDescription)
        myService.createRoom($scope);

    }
//    房间更新
    $scope.roomUpdate = function (index) {
        myService.roomUpdate($scope, index)

    }
//    房间删除
    $scope.roomDelete = function (index) {
        myService.roomDelete($scope, index)

    }
    $scope.init = function () {
    myService.getAllMyRooms($scope);
    }

}])