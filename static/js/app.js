'use strict';

var moodApp = angular.module('moodApp', [
 'ngRoute',
]);

moodApp.config(['$routeProvider',
     function($routeProvider) {
         $routeProvider.
             when('/login', {
                 templateUrl: '/static/partials/login.html',
             }).
             when('/dashboard', {
                 templateUrl: '/static/partials/dashboard.html',
            }).
             otherwise({
                 redirectTo: '/login'
             });
    }]);
