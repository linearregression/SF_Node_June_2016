var app =
    angular.module('sna', ['ngRoute'])
        .config(function ($locationProvider) {

            $locationProvider.html5Mode({
                enabled: true
                , requireBase: false
            });
            
            
        })
        .run(function ($rootScope) {
            $rootScope.authenticate = false;
            $rootScope.current_user = 'Guest';
        });

app.controller('loginCtrl', function ($scope, $http, $window,$rootScope) {

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
            $window.location.href='http://localhost:3000/profile.html';

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
                
                $rootScope.current_user = data.username;
                $rootScope._id = data._id;
                $window.location.href='http://localhost:3000/profile.html';

/*
login response = {"data":{"_id":"574ce8ace7d9e86c0a2844a7","usrSocial":"local","usrLast":"Grisby III","usrFirst":"tre","usrEmail":"trewaters@hotmail.com","password":"$2a$10$Mg5TfKxZ6usZ50tb5MTU7OngjSqxBKRzxshLthbrOkBW9Q7Rru9Ze","username":"tre","__v":0},"status":200,"config":{"method":"POST","transformRequest":[null],"transformResponse":[null],"url":"/auth/login","data":{"username":"tre","password":"tre"},"headers":{"Accept":"application/json, text/plain, *\/*","Content-Type":"application/json;charset=utf-8"}},"statusText":"OK"}
*/
                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                $window.location.href= 'http://localhost:3000/index.html';

                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    };

}

);

app.controller('muCtrl', function ($scope, $http) {

    $scope.MeetupEvents = function () {
        $http.get('/api/muEvents');
    };

});

app.controller('profCtrl', function ($scope, $http) {



});

app.controller('gCtrl', function ($scope, $http) {

$scope.GoogleEvents = function(){
  $http.get('/api/getCalendar');
};

});