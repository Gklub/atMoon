/**
 * create by Harbon
 */
    atMoon.controller('navBarCtrl', ['$scope','myService','$ionicNavBarDelegate','$state', function ($scope, myService, $ionicNavBarDelegate, $state) {
        $scope.leaveRoom = function () {
            $ionicNavBarDelegate.back();
            myService.leaveRoom($scope);
        }
        $scope.$watch(function () {
            return $state.$current.name
        }, function () {
            if ($state.$current.name == 'tabs.myRoomId' || $state.$current.name == 'tabs.privateTalk' || $state.$current.name == 'tabs.roomId') {

            $scope.backShouldShow = true
            }else{
                $scope.backShouldShow = false
            }
        })
    }])