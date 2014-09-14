/**
 * created by harbon
 * date:2014-9-5
 */
atMoon.controller('leftMenuCtrl',['$scope','myService', function ($scope, myService) {
//    得到当前登录用户信息
    myService.getUser($scope);
//   注销
    $scope.logout = function () {
        myService.logout($scope);
    }


}])