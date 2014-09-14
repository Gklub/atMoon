/**
 * created by harbon
 * date:2014-9-5
 */
atMoon.controller('rightMenuCtrl',['$scope','myService','$ionicPopup','$rootScope','$state', function ($scope, myService, $ionicPopup, $rootScope, $state) {

    myService.getUsers($scope)
    $scope.sendMsgTo = function(index) {
        if ($scope.users[index].name != $rootScope.user.name && $rootScope.currentRoom.attribute!='private'){
            var confirmPopup = $ionicPopup.confirm({
                title: '私聊请求',
                template: '你确定要与他/她私聊么?'
            });
            confirmPopup.then(function(res) {
                if(res) {
                    myService.sendMsgTo($scope, index)
                } else {
                    console.log('hai girl')
                }
            });
        }

    };


}])