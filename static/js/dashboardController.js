/**
 * Created by Haneya Yunus
 */
moodApp.controller('dashboardController', ['$scope', '$http', '$q', function($scope, $http, $q) {
    var id = localStorage.getItem('id');

    if(!id) {
        window.location = '/#/login';
    }

    $scope.entry = false;
    $scope.journal = {
        id: Number(id)
    };
    $scope.user = localStorage.getItem('user');
    $scope.pickMood = true;
    $scope.writeDetails = false;

    var checkLastEntry = function() {
        $http({
            method: 'POST',
            url: '/lastentry',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: id
        }).then(function(success) {
            console.log(success);
        }, function(error) {
            if(error.status === 404 || error.status === 500) { //no associated journal for this user
                createJournal();
            }
        });
    };

    var createJournal = function() {
        $http({
            method: 'POST',
            url: '/newjournal',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: id
        }).then(function(success){
            console.log(success);
        }, function(error){
            console.log(error);
        });
    };

    $scope.chooseMood = function(mood) {
        $scope.journal.mood = mood;
        $scope.pickMood = false;
        $scope.writeDetails = true;
    };

    $scope.saveMood = function() {
        var now = new Date();
        $scope.journal.timestamp = now.getTime();
        $http({
            method: 'POST',
            url: '/newentry',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: $scope.journal
        }).then(function(success) {
            console.log(success);
        }, function(error) {
            console.log(error);
        });
        $scope.skipped = true; //remove entry tile
    };

    $scope.logout = function() {
        localStorage.setItem('id', null);
        localStorage.setItem('user', null);
        window.location = '/#/login';
    }
}]);
