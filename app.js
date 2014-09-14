
/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var async = require('async')
var MongoStore = require('connect-mongo')(express)
var Cookie = require('cookie');
var connect = require('connect')
var userModel = require('./models/user.js');
var roomModel  = require('./models/room.js')

var app = express();
var port = process.env.PORT || 3000

// all environments
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
var sessionStore = new MongoStore({
    url: 'mongodb://localhost/atMoon'
})

app.use(express.session({
    secret: 'atMoon',
    cookie: {
        maxAge: 60 * 1000
    },
    store: sessionStore
}))
//登录验证
//app.get('/validate', function (req, res) {
//    if (req.session.user) {
//        return res.json(200,{
//            user:req.session.user
//        });
//    }else{
//        return res.json(400,null)
//    }
//
//})
//登录
app.use(express.static(path.join(__dirname, 'public')));
app.post('/api/login', function (req, res) {
    var user = req.body.user
    userModel.login(user, function (err, user) {
        if(err) {
             return res.json(400,null);
        }
        if(!user){
            return res.json(400,null);
        }
        req.session.user = user._id;
        return res.json(200,{
            user:user
        })
    })

})
//登出
app.get('/api/logout', function (req, res) {
    req.session.userId = null
    return res.json(200,null);
})
//创建账户
app.post('/api/createAccount', function (req, res) {
    var user = req.body.newUser;
    userModel.createAccount(user, function (err, newUser) {
        if (err) {
            return res.json(500,null);
        }
        req.session.userId = newUser._id
        return res.json(200,{
            user:newUser
        })
    })
})
app.use(function (req, res) {
    res.sendfile('./public/index.html')
})
var io = require('socket.io').listen(app.listen(port))
//socket验证


//机器人
var SYSTEM = {
    name: 'atMoon机器人',
    avatarUrl: 'http://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Robot_icon.svg/220px-Robot_icon.svg.png'
}
//客户端连接监听
io.sockets.on('connection', function(socket) {
    console.log('当前用户已连接')
//    得到当前所有创建的房间
    var currentUser = null;
    var currentRoom = null ;
socket.on('getRooms', function (user) {
   currentUser = user;
        roomModel.getAllRooms(function (err, rooms) {
            if(err) {
               console.log('getRooms error');
            }
            socket.emit('roomsGet', rooms);
        })
    })
//进入房间监听
    socket.on('enterRoom', function (enterMsg) {
        currentRoom = enterMsg.room
        roomModel.userEnter(enterMsg, function (err) {
            if (err) {
                console.log('userEnter error')
            }
            roomModel.getCurrentRoom(enterMsg, function (err, currentRoom) {
                if (err) {
                    console.log('getCurrentRoomUsers error')
                }
                socket.emit('roomEnter', currentRoom );
                socket.join(currentRoom._id);
                var systemMessage = {
                    user:SYSTEM,
                    content:enterMsg.user.name+'进入房间',
                    room:currentRoom
                }
                socket.broadcast.to(currentRoom._id).emit('messageAdd', systemMessage )
                socket.broadcast.to(currentRoom._id).emit('oneEnter', currentRoom)
                socket.broadcast.emit('roomUpdate', currentRoom);
            })
        })
    })
//    进入我的房间监听
    socket.on('enterMyRoom', function (enterMsg) {
        currentRoom = enterMsg.room
        roomModel.userEnter(enterMsg, function (err) {
            if (err) {
                console.log('userEnter error')
            }
            roomModel.getCurrentRoom(enterMsg, function (err, currentRoom) {
                if (err) {
                    console.log('getCurrentRoomUsers error')
                }
                socket.emit('myRoomEnter', currentRoom );
                socket.join(currentRoom._id);
                var systemMessage = {
                    user:SYSTEM,
                    content:enterMsg.user.name+'进入房间',
                    room:currentRoom
                }
                socket.broadcast.to(currentRoom._id).emit('messageAdd', systemMessage )
                socket.broadcast.to(currentRoom._id).emit('oneEnter', currentRoom)
                socket.broadcast.emit('roomUpdate', currentRoom);
            })
        })
    })
//    进入私聊监听
    socket.on('enterPrivateRoom', function (enterMsg) {
        currentRoom = enterMsg.room
        roomModel.userEnter(enterMsg, function (err) {
            if (err) {
                console.log('userEnter error')
            }
            roomModel.getCurrentRoom(enterMsg, function (err, currentRoom) {
                if (err) {
                    console.log('getCurrentRoomUsers error')
                }
                socket.emit('privateRoomEnter', currentRoom );
                socket.join(currentRoom._id);
                var systemMessage = {
                    user:SYSTEM,
                    content:enterMsg.user.name+'进入房间',
                    room:currentRoom
                }
                socket.broadcast.to(currentRoom._id).emit('messageAdd', systemMessage )
                socket.broadcast.to(currentRoom._id).emit('oneEnter', currentRoom)
                socket.broadcast.emit('roomUpdate', currentRoom);
            })
        })
    })

//    离开房间监听
    socket.on('leaveRoom', function (leaveMsg) {
        currentRoom = null;
        if (leaveMsg.room._id) {
        roomModel.leaveRoom(leaveMsg, function (err, room) {
            if (err) {
                console.log('leaveRoom error');
            }
            var systemMessage = {
                user:SYSTEM,
                content:leaveMsg.user.name+'离开了房间',
                room:room
            }
            socket.leave(leaveMsg.room._id);
            socket.broadcast.to(leaveMsg.room._id).emit('messageAdd', systemMessage);
            socket.broadcast.to(leaveMsg.room._id).emit('oneLeave', room);
            socket.broadcast.emit('roomUpdate',room)

        })
        }
    })
//    发送消息监听
    socket.on('sendMessage', function (sendMsg) {
        var newMessage = {
            user:sendMsg.user,
            content:sendMsg.myMessage,
            room:sendMsg.currentRoom
        }
      io.sockets.in(sendMsg.currentRoom._id).emit('messageAdd', newMessage);
    })
//    得到我创建的所有房间监听
    socket.on('getAllMyRooms', function (user) {
        roomModel.getAllMyRooms(user, function (err, rooms) {
            if (err) {
                console.log('getAllMyRooms error');
            }
            socket.emit('allMyRoomsGet', rooms);
        })
    })
//    监听创建房间
    socket.on('createRoom', function (room) {
        var newRoom = {
            creator:room.creator.name,
            name:room.name,
            description:room.description,
            createAt:new Date(),
            attribute:'public',
            to:'public',
            users:[],
            img_src:'http://ico.ooopic.com/ajax/iconpng/?id=54167.png'
        }
        roomModel.createRoom(newRoom, function (err, room) {
            if (err) {
                console.log('createRoom error')
            }

            socket.emit('roomCreate', room)
            io.sockets.emit('roomAdd', room)
        })
    })
//    房间删除监听
    socket.on('roomDelete', function (room) {
        roomModel.deleteRoom(room, function (err) {
            if (err) {
                console.log('roomDelete error')
            }
            socket.emit('deleteRoom', {
                result:'success'
            });
            io.sockets.emit('roomDelete', room)
        })
    })
//    得到全部我的私聊
    socket.on('getAllPrivateTalk', function (user) {
        roomModel.getAllPrivateRoom(user, function (err, privateRooms) {
            if (err) {
                console.log('getAllPrivateTalk error');
            }
            socket.emit('allPrivateTalkGet', privateRooms)
        })
    })

//    监听拒绝私聊
    socket.on('privateTalkRefuse', function (refuseMsg) {
        console.log(refuseMsg.room)
        roomModel.deletePrivateRoom(refuseMsg,function (err) {
            if (err) {
                console.log('deletePrivateRoom error')
            }
            var systemMessage = {
                user:SYSTEM,
                content:refuseMsg.user.name+'拒绝了你的私聊邀请',
                room:refuseMsg.room
            }

            socket.broadcast.to(refuseMsg.room._id).emit('messageAdd', systemMessage)
        })
    })
//    发起私聊请求监听
    socket.on('sendMsgTo', function (two) {
        var newPrivateRoom = {
            creator:'privateTalk',
            name:two.from.name,
            description:'privateTalk',
            createAt:new Date(),
            attribute:'private',
            to:two.to.name,
            users:[],
            img_src:two.from.avatarUrl
        }
        roomModel.createPrivateRoom(newPrivateRoom, function (err, privateRoom) {
            if (err) {
                console.log('createPrivateRoom error');
            }
            console.log()
            socket.emit('privateRoomCreate', privateRoom);
            socket.broadcast.emit('privateTalkAdd', privateRoom)
        })
    })
//    socket.on('leave', function (leaveMsg) {
//
//    })
    socket.on('disconnect', function () {
        var leaveMsg = {
            user:currentUser,
            room:currentRoom
        }
      if (currentRoom) {
          roomModel.leaveRoom(leaveMsg, function (err, room) {
              if (err) {
                  console.log('leaveRoom error');
              }
              var systemMessage = {
                  user:SYSTEM,
                  content:leaveMsg.user.name+'离开了房间',
                  room:room
              }
              socket.leave(leaveMsg.room._id);
              socket.broadcast.to(leaveMsg.room._id).emit('messageAdd', systemMessage);
              socket.broadcast.to(leaveMsg.room._id).emit('oneLeave', room);
              socket.broadcast.emit('roomUpdate',room)

          })
      }

})
})
console.log("TechNode  is on port " + port + '!')




