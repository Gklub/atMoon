/**
 * created by harbon
 * date:2014-9-8
 */
atMoon.controller('createAccountCtrl',['$scope','myService', function ($scope, myService) {
    $scope.showInfo = function () {
        if($scope.password != $scope.rePassword){
        $scope.info = "两次密码不一致";
        $scope.infoShouldShow = true;
        }
    }

    $scope.createAccount = function () {
        var newUser = {
            name:$scope.userName,
            password:$scope.password,
            rePassword:$scope.rePassword,
            email:$scope.email
        }


        if (!newUser.name || !newUser.password || !newUser.rePassword ||!newUser.email) {
            $scope.info = "信息不完整或邮箱格式不正确，请认真填写！！";
            $scope.infoShouldShow = true;
        }else{
            $scope.info = "账号创建中。。。。。。";
            myService.createAccount($scope, newUser)
        }

    }
}])