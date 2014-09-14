/**
 * created by Harbon
 * date；2014-9-9
 */
var parseSignedCookie = require('connect').utils.parseSignedCookie
var Cookie = require('cookie')
module.exports = function (io) {
    io.set('authorization', function(handshakeData, accept) {
        handshakeData.cookie = Cookie.parse(handshakeData.headers.cookie)
        var connectSid = handshakeData.cookie['connect.sid']
        connectSid = parseSignedCookie(connectSid, 'atMoon')

        if (connectSid) {
            sessionStore.get(connectSid, function(error, session) {
                if (error) {
                    accept(error.message, false)
                } else {
                    handshakeData.session = session
                    if (session.user) {
                        accept(null, true)
                    } else {
                        accept('No login')
                    }
                }
            })
        } else {
            accept('No session')
        }
    })

    var SYSTEM = {
        name: 'technode机器人',
        avatarUrl: 'http://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Robot_icon.svg/220px-Robot_icon.svg.png'
    }

    io.sockets.on()
}