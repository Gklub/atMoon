/**
 * created by harbon
 * date:2014-9-10
 */
var db = require('./atMoonDb');
var mongoose = require('mongoose');
var objectId = require('mongodb').ObjectID
var room = {}
module.exports = room;
var roomSchema = new mongoose.Schema({
    creator:String,
    name:String,
    description:String,
    createAt:Date,
    attribute:String,
    to:String,
    users:[{name:String,avatarUrl:String}],
    img_src:String
})
var dbModel = db.model('rooms',roomSchema);
//得到当前所有已经创建的房间
    room.getAllRooms = function (callback) {
        dbModel.find({attribute:'public'},function (err, rooms) {
            if (err) {
                return callback(err)
            }
            return callback(null, rooms);
        })
    }
//用户加入房间
    room.userEnter = function (enterMsg, callback) {
        dbModel.findOne({_id:new objectId(enterMsg.room._id)}, function (err, room) {
            if (err) {
                return callback(err);
            }
            var updateRoom = room;
            updateRoom.users.push({
                name:enterMsg.user.name,
                avatarUrl:enterMsg.user.avatarUrl
            })
            dbModel.update({_id:new objectId(enterMsg.room._id)},
                {$set:{users:updateRoom.users}}, function (err) {
                    if (err) {
                       return callback(err);
                    }
                    return callback(null,updateRoom);
                })

        })
    }
//得到当前房间
    room.getCurrentRoom = function (enterMsg, callback) {
        dbModel.findOne({_id:new objectId(enterMsg.room._id)}, function (err, currentRoom) {
            if (err) {
                return callback(err)
            }
            return callback(null, currentRoom);
        })
    }
//    用户离开房间
    room.leaveRoom = function (leaveMsg, callback) {
        dbModel.findOne({_id:new objectId(leaveMsg.room._id)}, function (err, room) {
            if (err) {
                return callback(err)
            }
            var updateRoom = room

            for (var i = 0;i<updateRoom.users.length;i++) {
                if (updateRoom.users[i].name == leaveMsg.user.name) {

                    updateRoom.users.splice(i,1)
                }
            }

            dbModel.update({_id:new objectId(leaveMsg.room._id)},
                {$set:{users:updateRoom.users}}, function (err) {
                    if (err) {
                        return callback(err)
                    }
                    return callback(null, updateRoom);
                })
        })
    }
//得到我的全部房间
    room.getAllMyRooms = function (user, callback) {
        dbModel.find({
            creator:user.name
        }, function (err, rooms) {
            if (err) {
                return callback(err)
            }
            callback(null, rooms)
        })
    }
//创建房间
    room.createRoom = function (newRoom, callback) {
        var room = new dbModel(newRoom);
        room.save(function (err, room) {
            if (err) {
                return callback (err);
            }
            return callback(null, room)
        })
    }
//删除房间
    room.deleteRoom = function (room, callback) {
        dbModel.remove({_id:new objectId(room._id)},function (err) {
            if (err) {
                return callback (err)
            }
            return callback(null)
        })
    }
//得到对我的私聊请求
    room.getAllPrivateRoom = function(user, callback) {
    dbModel.find({to:user.name}, function (err, privateRooms) {
        if (err) {
            return callback(err)
        }
        return callback(null,privateRooms)
    })
}
//删除私聊房间
    room.deletePrivateRoom = function (refuseMsg, callback) {
        dbModel.remove({_id:new objectId(refuseMsg.room._id)}, function (err) {
            if (err) {
                return callback(err)
            }
            return callback(null)
        })
    }
//发起私聊请求创建私聊房间
    room.createPrivateRoom = function (newPrivateRoom, callback) {
        var room = new dbModel(newPrivateRoom);
        room.save(function (err, privateRoom) {
            if (err) {
                return callback (err)
            }
            return callback(null, privateRoom)
        })
    }
//离开
