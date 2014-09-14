/**
 * created by harbon
 * 2014-9-14
 */
    atMoon.controller('tabsCtrl', ['$ionicTabsDelegate','$rootScope','$scope','$state','$ionicPopup', function ($ionicTabsDelegate, $rootScope, $scope, $state, $ionicPopup) {
        var showAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: '提示消息',
                template:'请先退出当前房间'
            });
            alertPopup.then(function(res) {
                console.log('嗨呵呵呵');
            });
        }
        $scope.changeTab = function (index) {
            if ($rootScope.currentRoom.users.length == 0) {
            if (index == 0) {
                $state.go('tabs.rooms')
            }
            if (index == 1) {
                $state.go('tabs.myRoom')
            }
            if (index == 2) {
                $state.go('tabs.messages')
            }
            $ionicTabsDelegate.$getByHandle('tabs').select(index)
            }else{
                showAlert()
            }
        }
    }])