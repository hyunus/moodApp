/**
 * Created by Haneya Yunus
 */
moodApp.controller('dashboardController', ['$scope', '$http', 'apiFactory', function($scope, $http, apiFactory) {
    var id = localStorage.getItem('id');

    if(!id) {
        window.location = '/#/login';
    }

    $scope.entry = false;
    $scope.journalEntry = {
        id: Number(id)
    };
    $scope.journal = {};
    $scope.user = localStorage.getItem('user');
    $scope.pickMood = true;
    $scope.writeDetails = false;

    apiFactory.getJournal(id).then(function(data) {
        if(data) {
            $scope.journal.data = data;
        } else {
            createJournal();
        }
    });

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
        $scope.journalEntry.mood = mood;
        $scope.pickMood = false;
        $scope.writeDetails = true;
    };

    $scope.saveMood = function() {
        var now = new Date();
        $scope.journalEntry.timestamp = now.getTime();
        $http({
            method: 'POST',
            url: '/newentry',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: $scope.journalEntry
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
    };
}]);
