/**
 * created by Harbon
 * date:2014-9-9
 */
    atMoon.factory('socket',['$rootScope', function ($rootScope) {
        var socket = io.connect('/')
        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments
                    $rootScope.$apply(function() {
                        callback.apply(socket, args)
                    })
                })
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args)
                        }
                    })
                })
            }
        }
    }])