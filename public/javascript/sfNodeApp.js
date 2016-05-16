angular
    .module('sna',['ngRoute','ngResource'])
    .config(function($httpProvider, $routeProvider,$locationProvider){
        $routeProvider
            .when('/login', {
                templateUrl:'login.html',
                controller: 'loginCtrl'
            })
    })
    .run(function ($rootScope,$location,$http){
        $rootScope.authenticate = false;
        $rootScope.current_user = 'Guest';
        $location.url('login');
    })
    .controller('loginCtrl', loginCtrl);
    
function loginCtrl($scope){
    // login for website ? not sure if they need to log into website yet.
    // authentication for meetup
    
    /*
    // variables I have added that need to be defined
    $scope.user = {username: '', password:''};
    
    $scope.login = function(){
        $scope.username;
        $scope.password;
    };
    */
};