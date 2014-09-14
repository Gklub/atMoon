atMoon.factory('myService', ['$state','$http','socket','$rootScope','$ionicPopup','$ionicNavBarDelegate', function ($state, $http, socket, $rootScope, $ionicPopup, $ionicNavBarDelegate) {

    socket.on('privateTalkAdd', function (privateRoom) {
        if (privateRoom.to == $rootScope.user.name) {
            var showAlert = function() {
                var alertPopup = $ionicPopup.alert({
                    title: '私聊请求消息',
                    template: privateRoom.name+'发来私聊请求请到message中查看'
                });
                alertPopup.then(function(res) {
                    console.log('嗨呵呵呵');
                });
            }
          showAlert()
        }
    })

//    登录
    var login = function ($scope, user) {
      $http({
          url:'/api/login',
          method:'POST',
          data:{
              user:user
          }
      }).success(function (result) {
              $rootScope.user = result.user;
              $state.go('^.tabs.rooms');
          }).error(function (result) {
              $scope.loginResult = "用户名或密码不正确";
              $scope.loginResultShouldShow = true;

          })
    }
//    账号创建
    var createAccount = function ($scope, newUser) {
        $http({
            url:'/api/createAccount',
            method:'POST',
            data:{
                newUser:newUser
            }
        }).success(function (result) {
                $rootScope.user = result.user;
                $state.go('^.tabs.rooms')
            }).error(function (result) {
                $scope.info = "创建账号失败，可能该用户名已经存在，请重新创建";
                $scoep.infoShouldShow = true;
            })
        }
//    得到房间列表
    var getRooms = function ($scope) {

        socket.on('roomsGet', function (rooms) {
            for (var i = 0;i<rooms.length;i++) {
                rooms[i].count = rooms[i].users.length;
            }
            $scope.rooms = rooms;
            socket.on('roomUpdate', function (room) {
                room.count = room.users.length
                for (var i = 0;i<$scope.rooms.length;i++) {
                    if ($scope.rooms[i]._id == room._id) {
                        $scope.rooms[i] = room;
                    }
                }
            })
            socket.on('roomAdd', function (room) {
                room.count = room.users.length;
                $scope.rooms.push(room);

            })
            socket.on('roomDelete', function (room) {
                for (var i = 0;i<$scope.rooms.length;i++) {
                    if ( $scope.rooms[i]._id == room._id ) {
                        $scope.rooms.splice(i,1);
                    }
                }
            })
        })
        socket.emit('getRooms', $rootScope.user);

    }
//    进入一个房间
    var enterRoom = function ($scope, index) {


        socket.on('oneLeave', function (room) {
            if (room) {
                $rootScope.currentRoom = room;
            }
        })

        socket.on('oneEnter', function (room) {
            if (room) {
                $rootScope.currentRoom = room;
            }
        })

        socket.on('roomEnter', function (room) {
            if (room) {
                $rootScope.currentRoom = room ;
                $state.go('tabs.roomId');
            }else{
                console.log('enterRoom error')
            }
        })
        var enterMsg = {
            user:$rootScope.user,
            room: $scope.rooms[index]
        }
        socket.emit('enterRoom', enterMsg);

    }
//    离开房间
    var leaveRoom = function ($scope) {
        var leaveMsg = {
            user:$rootScope.user,
            room:$rootScope.currentRoom
        }
        socket.emit('leaveRoom', leaveMsg);
        $rootScope.currentRoom = {
            users:[]
        }
    }
//    得到该房间的消息

    var getMessages = function ($scope) {

            $scope.messages = [];


        if ($rootScope.currentRoom.attribute == 'private'&&$rootScope.currentRoom.name == $rootScope.user.name){


            $scope.roomName = $rootScope.currentRoom.to
        }else{

            $scope.roomName = $rootScope.currentRoom.name
        }
            socket.on('messageAdd', function (message) {
                if (message.room._id == $rootScope.currentRoom._id) {
                    $scope.messages.push(message);
                }
            })
    }
//    发送消息
    var sendMyMessage = function ($scope, myMessage) {
        var sendMsg = {
            user:$rootScope.user,
            myMessage:myMessage,
            currentRoom:$rootScope.currentRoom
        }
        socket.emit('sendMessage', sendMsg);
    }

//    得到全部我的房间
    var myRoomScope = null;
    var getAllMyRooms = function ($scope) {
        myRoomScope = $scope;
        socket.on('allMyRoomsGet', function (myRooms) {
            for (var i = 0;i<myRooms.length;i++) {
                myRooms[i].count = myRooms[i].users.length;
            }
            $scope.myRooms = myRooms;
            socket.on('myRoomAdd', function (myRoom) {
                $scope.myRooms.push(myRoom)
            })
        })
        socket.on('roomUpdate', function (room) {
            room.count = room.users.length;
            for (var i = 0;i<$scope.myRooms.length;i++) {
                if ($scope.myRooms[i]._id == room._id) {
                    $scope.myRooms[i] = room;
                }
            }
        })
        socket.emit('getAllMyRooms', $rootScope.user);

    }
//    进入我的房间
    var enterMyRoom = function ($scope, index) {
        socket.on('myRoomEnter', function (myRoom) {
            if (myRoom) {
                $rootScope.currentRoom = myRoom
                $state.go('tabs.myRoomId');
            }
        })
        var enterMsg = {
            user:$rootScope.user,
            room:$scope.myRooms[index]
        }
        socket.emit('enterMyRoom', enterMsg)
    }
//    创建房间
    var createRoom = function ($scope) {
        $scope.createInfo = true
        socket.on('roomCreate', function (myRoom) {
            if(myRoom){
                myRoom.count = myRoom.users.length;
                myRoomScope.myRooms.push(myRoom);
                $scope.modal.hide();
                $scope.createInfo = false;
            }else{
                console.log('createRoom error')
            }
        })
        var createRoom = {
            creator:$rootScope.user,
            name:$scope.roomName,
            description:$scope.roomDescription
        }
        console.log('createRoomEmit')
        socket.emit('createRoom', createRoom);

    }
//    房间更新
    var roomUpdate = function ($scope, index) {


    }
//    房间删除
    var roomDelete = function ($scope, index) {
        socket.on('deleteRoom', function (result) {
            if(result.result){
                $scope.myRooms.splice(index,1);
            }
        });
        socket.emit('roomDelete', $scope.myRooms[index])

    }
    //    得到全部私聊信息

    var getAllPrivateTalk = function ($scope) {
        socket.on('allPrivateTalkGet', function (privateRooms) {
            $scope.privateRooms = privateRooms;


        })
        socket.on('privateTalkAdd', function (privateRoom) {
            if (privateRoom.to == $rootScope.user.name) {
                $scope.privateRooms.push(privateRoom);
            }
        })
        socket.emit('getAllPrivateTalk', $rootScope.user);

    }
//    接受私聊
    var acceptPrivateTalk = function ($scope, index) {
        socket.on('privateRoomEnter', function (privateRoom) {
            if (privateRoom ) {
                $rootScope.currentRoom = privateRoom;
                $state.go('tabs.privateTalk');

                socket.on('oneLeave', function (room) {
                    if (room ) {
                        $rootScope.currentRoom = room;
                    }
                })
            }else{
                console.log('acceptPrivateTalk error')
            }
        })
        var acceptMsg = {
            user:$rootScope.user,
            room:$scope.privateRooms[index]
        }
        socket.emit('enterPrivateRoom', acceptMsg)


    }
//    私聊拒绝
    var messageDelete = function ($scope, index) {
        var refuseMsg = {
            user:$rootScope.user,
            room:$scope.privateRooms[index]
        }
        socket.emit('privateTalkRefuse', refuseMsg)
        $scope.privateRooms.splice(index,1);

    }

//    得到当前登录用户信息
    var getUser = function ($scope) {
        $scope.name = $rootScope.user.name;

    }
//    得到当前房间用户列表
    var getUsers = function ($scope) {
        $rootScope.currentRoom = {
            users:[]
        }
        $rootScope.$watch('currentRoom', function () {

            if ($rootScope.currentRoom) {

            $scope.users = $rootScope.currentRoom.users

            }
        })
    }
//   发起私聊请求
    var sendMsgTo = function ($scope, index) {

        socket.on('privateRoomCreate', function (privateRoom) {
            var enterMsg = {
                user:$rootScope.user,
                room: privateRoom
            }
            socket.emit('enterPrivateRoom', enterMsg);
            socket.on('privateRoomEnter', function (room) {

                $rootScope.currentRoom = room;
                $state.go('tabs.privateTalk');

            })
            socket.on('oneLeave', function (room) {
                if (room) {
                    $rootScope.currentRoom = room;
                }
            })

            socket.on('oneEnter', function (room) {
                if (room) {
                    $rootScope.currentRoom = room;
                }
            })
        } )
        var two = {
            from:$rootScope.user,
            to:$scope.users[index]
        }
        socket.emit('sendMsgTo', two)

    }
//    注销
    var logout = function ($scope) {
        var leaveMsg = {
            user:$rootScope.user,
            room:$rootScope.currentRoom
        }
        socket.emit('leaveRoom', leaveMsg);
        $http({
            url:'/api/logout',
            method:'GET'
        }).success(function () {
            $rootScope.user = null;
            $rootScope.currentRoom = null;
            $state.go('login');
        }).error(function () {
                console.log('logout error')
            })
    }

    return {
        login:login,
        createAccount:createAccount,
        getRooms:getRooms,
        enterRoom:enterRoom,
        getMessages:getMessages,
        getAllPrivateTalk:getAllPrivateTalk,
        acceptPrivateTalk:acceptPrivateTalk,
        messageDelete:messageDelete,
        getAllMyRooms:getAllMyRooms,
        enterMyRoom:enterMyRoom,
        createRoom:createRoom,
        roomUpdate:roomUpdate,
        roomDelete:roomDelete,
        getUser:getUser,
        getUsers:getUsers,
        sendMsgTo:sendMsgTo,
        sendMyMessage:sendMyMessage,
        logout:logout,
        leaveRoom:leaveRoom
    }
}])