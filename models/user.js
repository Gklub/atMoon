/**
 * created by harbon
 * date:2014-9-10
 */
    var db = require('./atMoonDb');
    var mongoose = require('mongoose');
    var gravatar = require('gravatar')
    var user = {}
    module.exports = user;
    var userSchema = new mongoose.Schema({
        name:String,
        password:String,
        email:String,
        avatarUrl:String
    })
    var dbModel = db.model('users',userSchema);

    user.login = function (userLogin, callback) {
        dbModel.findOne({name:userLogin.name},function (err, user) {
            if (err) {
                return callback(err);
            }
            if (userLogin.password == user.password) {
                return callback(null, user);
            }else{
                return callback(null, null);
            }
        })
    }
//    创建账户
    user.createAccount = function (newUser, callback) {
        var newAccount = new dbModel({
            name:newUser.name,
            password:newUser.password,
            email:newUser.email,
            avatarUrl:gravatar.url(newUser.email)
        });
        dbModel.findOne({name:newUser.name}, function (err, user) {
            if (err) {
                return callback(err);
            }
            if (!user) {
                newAccount.save(function (err, user) {
                    if (err) {
                        return callback(err)
                    }
                    return callback(null, user);
                })
            }
        })
}

