/**
 * Created by Haneya Yunus
 */
moodApp.controller('loginController', ['$scope', '$http', function($scope, $http) {
    $scope.user = {};
    $scope.error = "";

    $scope.verify = function() {
        $scope.error = '';
        if(!$scope.user.username || !$scope.user.password) {
            $scope.error = "Please enter a username and a password.";
            return;
        }
        $http({
            method: 'POST',
            url: '/signin',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                username: $scope.user.username,
                password: $scope.user.password
            }
        }).then(function(success){
            var id = success.data[0];
            var user = success.data[1];
            localStorage.setItem("id", id);
            localStorage.setItem("user", user);
            window.location = '/#/dashboard?user=' + success.data[1];
        }, function (error) {
            $scope.error = "Incorrect username or password.";
        });
    };

    $scope.signup = function() {
        $scope.error = '';
        if(!$scope.user.username || !$scope.user.password) {
            $scope.error = "Please enter a username and a password.";
            return;
        }

        $http({
            method: 'POST',
            url: '/signup',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                username: $scope.user.username,
                password: $scope.user.password
            }
        }).then(function(success) {
            console.log(success);
        }, function(error) {
            if(error.status === 400) {
                $scope.error = "User already exists!";
            } else {
                $scope.error = "Something went wrong. Please try again.";
            }
        })
    };
}]);