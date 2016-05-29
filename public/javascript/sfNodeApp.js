angular
    .module('sna', ['ngRoute', 'ngResource'])
    .config(function ($httpProvider, $routeProvider, $locationProvider) {
        $routeProvider
            .when('/login', {
                templateUrl: 'login.html'
                , controller: 'loginCtrl'
            })
            .when('/', {
                templateUrl: 'index.html'
                , controller: 'loginCtrl'
            })
            .when('/signup', {
                templateUrl: 'signup.html'
                , controller: 'loginCtrl'
            })
            .when('/googleSuccess', {
                templateUrl: 'gEvent.html'
                , controller: 'loginCtrl'
            })
    })
    .run(function ($rootScope, $location) {
        $rootScope.authenticate = false;
        $rootScope.current_user = 'Guest';
        $location.url('/login');
    })
    .controller('loginCtrl', loginCtrl);

function loginCtrl($scope, $http, $location) {
    /*
        $scope.username = 'trewaters';
        $scope.password = 'trewaters';
        $scope.usrEmail = 'trewaters@hotmail.com';
        $scope.usrFirst = 'Tre\'';
        $scope.usrLast = 'Grisby';
    */
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
            //$location.url('/googleSuccess');
            
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    };

    $scope.login = function () {
        $http.post('/auth/login', { 'username': $scope.username, 'password': $scope.password }
        ).then(
                    function successCallback(response) {
                        $location.url('/googleSuccess');
                        
                        // this callback will be called asynchronously
                        // when the response is available
                    }, function errorCallback(response) {
                        $location.url('/');
                        
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });
    };

};