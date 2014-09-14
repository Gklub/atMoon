/**
 * created by harbon
 * date:2014-9-5
 */
    atMoon.config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('login', {
            url:'/login',
            templateUrl:'js/pages/login.html',
            controller:'loginCtrl'
        }).state('createAccount', {
                url:'/createAccount',
                templateUrl:'js/pages/createAccount.html',
                controller:'createAccountCtrl'
            }).state('tabs', {
                url:'/tabs',
                abstract:'true',
                templateUrl:'js/pages/tabs.html'
            }).state('tabs.messages', {
                url:'/messages',
                views:{
                    'tabs-messages':{
                        templateUrl:'js/pages/messages.html',
                        controller:'messagesCtrl'
                    }
                }
            }).state('tabs.myRoom', {
                url:'/myRoom',
                views:{
                    'tabs-myRoom':{
                        templateUrl:'js/pages/myRoom.html',
                        controller:'myRoomCtrl'
                    }
                }
            }).state('tabs.rooms', {
                url:'/rooms',
                views:{
                    'tabs-rooms':{
                        templateUrl:'js/pages/rooms.html',
                        controller:'roomsCtrl'
                    }
                }
            }).state('tabs.myRoomId', {
            url:'/myRoomId',
            views:{
                'tabs-myRoom':{
                    templateUrl:'js/pages/room.html',
                    controller:'roomCtrl'
                }
            }
        }).state('tabs.roomId', {
                url:'/roomId',
                views:{
                    'tabs-rooms':{
                        templateUrl:'js/pages/room.html',
                        controller:'roomCtrl'
                    }
                }
            }).state('tabs.privateTalk', {
                url:'/privateTalk',
                views:{
                    'tabs-messages':{
                        templateUrl:'js/pages/privateTalk.html',
                        controller:'privateTalkCtrl'
                    }
                }
            })
        $urlRouterProvider.otherwise('/login');
    })