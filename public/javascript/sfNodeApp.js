var app =
    angular.module('sna', ['ngRoute', 'ngResource'])
    .config(function($locationProvider){
$locationProvider.html5Mode({enabled:true, requireBase:false})
    })
    ;

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

                $rootScope.current_user = response.data.username;
                $window.location.href = 'http://localhost:3000/profile.html';

                // this callback will be called asynchronously
                // when the response is available
            }, function errorCallback(response) {
                $window.location.href = 'http://localhost:3000/index.html';

                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
    };

});

app.controller('profCtrl', function ($scope, $http, $rootScope, profile) {

        $http({
            method: 'GET'
            , url: '/auth/loggedin'
        }).then(function successCallback(response) {
            if (response.data !== '0') {
                // Authenticated

                $rootScope.current_user = response.data;
                $scope.username = response.data;

                $http({
            method: 'GET'
            , url: '/api/getUser'
            , params: { 'username': $rootScope.current_user }
        }).then(function successCallback(response) {

            $scope.username = response.data[0].username;
            $scope.password = response.data[0].password;
            $scope.usrFirst = response.data[0].usrFirst;
            $scope.usrLast = response.data[0].usrLast;
            $scope.usrEmail = response.data[0].usrEmail;
            $scope.timeFrom = response.data[0].timeFrom;
            $scope.timeTo = response.data[0].timeTo;
            $scope.tzOffset1 = response.data[0].tzOffset1;
            $scope.tzOffset2 = response.data[0].tzOffset2;
            $scope.tzOffset3 = response.data[0].tzOffset3;

        }, function errorCallback(response) {
            //error
        });
            } else {
                // Not Authenticated
            }
        }, function errorCallback(response) {
            // error
        });

    $scope.updateUser = function updateUser(email, occupation, skills) {
        profile.update({ 'id': $rootScope.current_user }, { 'usrEmail': email, 'usrOccupation': occupation, 'usrSkills': skills })
    };
});


app.controller('gProfCtrl', function ($scope, $http ,$rootScope, $location, profile) {

    $http({
            method: 'GET'
            , url: '/api/getUserGoogle'
            , params: { 'username': $location.search().username }
        }).then(function successCallback(response) {

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
            $scope.timeFrom = response.data[0].timeFrom;
            $scope.timeTo = response.data[0].timeTo;
            $scope.tzOffset1 = response.data[0].tzOffset1;
            $scope.tzOffset2 = response.data[0].tzOffset2;
            $scope.tzOffset3 = response.data[0].tzOffset3;

        }, function errorCallback(response) {
            //error
        });

    $scope.updateUser = function updateUser(email, occupation, skills) {
        profile.update({ 'id': $rootScope.current_user }, { 'usrEmail': email, 'usrOccupation': occupation, 'usrSkills': skills })
    };
});