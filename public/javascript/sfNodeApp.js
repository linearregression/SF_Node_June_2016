var app =
    angular.module('sna', ['ngRoute'])
        .config(function ($locationProvider) {

            $locationProvider.html5Mode({
                enabled: true
                , requireBase: false
            });

        })
        /*
        .run(function ($rootScope) {
            $rootScope.authenticate = false;
            $rootScope.current_user = 'Guest';
        })
        */
        ;

app.controller('loginCtrl', function ($scope, $http, $window, $rootScope) {

    $scope.register = function () {

        $http({
            method: 'POST',
            url: '/auth/signup',
            data: {
                'username': $scope.username,
                'password': $scope.password,
                'usrEmail': $scope.usrEmail,
                'usrFirst': $scope.usrFirst,
                'usrLast': $scope.usrLast
            }
        }).then(function successCallback(response) {
            console.log('register response = ' + response);//DEBUG

            $rootScope.current_user = response.data.username;
            $window.location.href = 'http://localhost:3000/profile.html';

            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };

    $scope.login = function () {
        $http.post('/auth/login',
            { 'username': $scope.username, 'password': $scope.password }
        ).then(
            function successCallback(response) {
                console.log('login response = ' + JSON.stringify(response));//DEBUG

                $rootScope.current_user = response.data.username;
                //$rootScope._id = response.data._id;
                $window.location.href = 'http://localhost:3000/profile.html';

                /*
                login response = {"data":{"_id":"574ce8ace7d9e86c0a2844a7","usrSocial":"local","usrLast":"Grisby III","usrFirst":"tre","usrEmail":"trewaters@hotmail.com","password":"$2a$10$Mg5TfKxZ6usZ50tb5MTU7OngjSqxBKRzxshLthbrOkBW9Q7Rru9Ze","username":"tre","__v":0},"status":200,"config":{"method":"POST","transformRequest":[null],"transformResponse":[null],"url":"/auth/login","data":{"username":"tre","password":"tre"},"headers":{"Accept":"application/json, text/plain, *\/*","Content-Type":"application/json;charset=utf-8"}},"statusText":"OK"}
                */
                
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                $window.location.href = 'http://localhost:3000/index.html';

                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    };

});

app.controller('profCtrl', function ($scope, $http,$rootScope) {
    
    console.log('profCtrl Begin');//DEBUG

    $http.get('/auth/loggedin').success(function (user) {
        console.log('user = ' + JSON.stringify(user));
            if (user !== '0') {
                // Authenticated

                console.log('DEV NOTE -> success /auth/loggedin'); // [DEBUG]
                

                $rootScope.authenticated = true;
                $rootScope.current_user = user.username;
                $rootScope.username = user.username;
                $rootScope.password = user.password;
                $rootScope.googleId = user.googleId;
                $rootScope.usrFirst = user.usrFirst;
                $rootScope.usrLast = user.usrLast;
                $rootScope.usrEmail = user.usrEmail;
                $rootScope.usrOccupation = user.usrOccupation;
                $rootScope.usrSkills = user.usrSkills;
                $rootScope.usrUrls = user.usrUrls;
                $rootScope.usrAccessToken = user.usrAccessToken;
                $rootScope.usrRefreshToken = user.usrRefreshToken;

            } else {
                // Not Authenticated

                console.log('DEV NOTE -> error /auth/loggedin'); // [DEBUG]

                $rootScope.authenticated = false;
                $rootScope.current_user = 'Guest';

            }
        });
/*
    $scope.getUser = function () {
        console.log('checkLoggedIn Begin');//DEBUG

        // Make a call to check if th user is logged in
        $http.get('/auth/loggedin').success(function (user) {
            if (user !== '0') {
                // Authenticated

                console.log('DEV NOTE -> success /auth/loggedin'); // [DEBUG]

                $rootScope.authenticated = true;
                $rootScope.current_user = user.username;
                $rootScope.username = user.username;
                $rootScope.password = user.password;
                $rootScope.googleId = user.googleId;
                $rootScope.usrFirst = user.usrFirst;
                $rootScope.usrLast = user.usrLast;
                $rootScope.usrEmail = user.usrEmail;
                $rootScope.usrOccupation = user.usrOccupation;
                $rootScope.usrSkills = user.usrSkills;
                $rootScope.usrUrls = user.usrUrls;
                $rootScope.usrAccessToken = user.usrAccessToken;
                $rootScope.usrRefreshToken = user.usrRefreshToken;

            } else {
                // Not Authenticated

                console.log('DEV NOTE -> error /auth/loggedin'); // [DEBUG]

                $rootScope.authenticated = false;
                $rootScope.current_user = 'Guest';

            }
        });
    };
    */
    

});

app.controller('gCtrl', function ($q,$scope, $http, $rootScope) {

    console.log('gCtrl Begin');//DEBUG

    $scope.getUser = function () {
        console.log('checkLoggedIn Begin');//DEBUG

        // Make a call to check if th user is logged in
        $http.get('/auth/loggedin').success(function (user) {
            if (user !== '0') {
                // Authenticated

                $rootScope.authenticated = true;
                $rootScope.current_user = user.username;

            } else {
                // Not Authenticated

                console.log('DEV NOTE -> $rootScope.error_message /auth/loggedin'); // [DEBUG]

                $rootScope.authenticated = false;
                $rootScope.current_user = 'Guest';

            }
        });
    };
    
    $scope.GoogleEvents = function () {
        $http.get('/api/getCalendar');
    };

});