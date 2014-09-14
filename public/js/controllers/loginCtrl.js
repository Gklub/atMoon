/**
 * created by harbon
 * date:2014-9-5
 */
 atMoon.controller('loginCtrl',['$scope','$state', 'myService', function ($scope, $state, myService) {
//     注册跳转
     $scope.toCreate = function () {
         $state.go('^.createAccount')
     }
//     登录处理函数
     $scope.login = function () {
               var user = {
                   name:$scope.userName,
                   password:$scope.password
               }
        myService.login($scope, user);
     }

 }])