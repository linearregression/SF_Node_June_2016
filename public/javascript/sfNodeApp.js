var app =
    angular.module('sna', ['ngRoute', 'ngResource']);

app.factory('profile', function ($resource) {
    return $resource('/updateUser/:id', { 'id': '@username' }, { 'update': { method: 'PUT' } });
});

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

                /* [NOTE] - this is http header data before helmet was installed. It shows the password as plain text. I wonder what this looks like after helmet is installed.
                login response = {
                    "data":{
                        "_id":"574ce8ace7d9e86c0a2844a7",
                        "usrSocial":"local",
                        "usrLast":"Grisby III",
                        "usrFirst":"tre",
                        "usrEmail":"trewaters@hotmail.com",
                        "password":"$2a$10$Mg5TfKxZ6usZ50tb5MTU7OngjSqxBKRzxshLthbrOkBW9Q7Rru9Ze",
                        "username":"tre",
                        "__v":0
                    },
                    "status":200,
                    "config":{
                        "method":"POST",
                    "transformRequest":[null],
                    "transformResponse":[null],
                    "url":"/auth/login",
                    "data":{"username":"tre","password":"tre"},
                    "headers":{"Accept":"application/json, text/plain, *\/*","Content-Type":"application/json;charset=utf-8"}
                },
                "statusText":"OK"}
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

app.controller('profCtrl', function ($scope, $http, $rootScope, profile, $location, $routeParams, $window) {

    /*
    if ($location.search().username !== '') {
                $rootScope.current_user = $location.search().username;
                console.log('location.search = ' + $location.search().username);
            }; //DEBUG
    */



    $http({
        method: 'GET'
        , url: '/auth/loggedin'
    }).then(function successCallback(response) {
        if (response.data !== '0') {
            // Authenticated

            console.log('DEV NOTE -> success /auth/loggedin'); // [DEBUG]
            console.log('loggedin response = ' + JSON.stringify(response)); //debug

            $rootScope.authenticated = true;
            $rootScope.current_user = response.data;
            $scope.username = response.data;


        } else {
            // Not Authenticated

            console.log('DEV NOTE -> error /auth/loggedin'); // [DEBUG]

            $rootScope.authenticated = false;
            $rootScope.current_user = 'Guest';

            if ($location.search().username !== '') {
                $rootScope.current_user = $routeParams.username;
                console.log('location.search = ' + $location.search().username + '\n');
                console.log('$window.location.search = ' + $window.location.search);
            }; //DEBUG

        }
    }, function errorCallback(response) {
        // error
    });

    $scope.getUser = function getUser() {



        $http({
            method: 'GET'
            , url: '/api/getUser'
            , params: { 'username': $rootScope.current_user }
        }).then(function successCallback(response) {

            console.log('response = ' + JSON.stringify(response)); //debug

            $rootScope.authenticated = true;
            $scope.username = response.data[0].username;
            $scope.password = response.data[0].password;
            $scope.googleId = response.data[0].googleId;
            $scope.usrFirst = response.data[0].usrFirst;
            $scope.usrLast = response.data[0].usrLast;
            $scope.usrEmail = response.data[0].usrEmail;
            $scope.usrOccupation = response.data[0].usrOccupation;
            $scope.usrSkills = response.data[0].usrSkills;
            $scope.usrUrls = response.data[0].usrUrls;
            $scope.usrPhotos = response.data[0].usrPhotos;
            $scope.usrCover = response.data[0].usrCover;
            $scope.usrHome = response.data[0].usrHome;
            $scope.usrAccessToken = response.data[0].usrAccessToken;
            $scope.usrRefreshToken = response.data[0].usrRefreshToken;

            console.log('response.data[0].timeFrom = ' + response.data[0].timeFrom); // debug

            $scope.timeFrom = response.data[0].timeFrom;
            $scope.timeTo = response.data[0].timeTo;
            $scope.tzOffset1 = response.data[0].tzOffset1;
            $scope.tzOffset2 = response.data[0].tzOffset2;
            $scope.tzOffset3 = response.data[0].tzOffset3;

        }, function errorCallback(response) {
            //error
        });
    };

    $scope.updateUser = function updateUser(email, occupation, skills) {
        profile.update({ 'id': $rootScope.current_user }, { 'usrEmail': email, 'usrOccupation': occupation, 'usrSkills': skills })
    };
});