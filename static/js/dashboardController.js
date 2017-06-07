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
    $scope.details = '';
    $scope.activeEntry = {};

    apiFactory.getJournal(id).then(function(data) {
        if(data) {
            $scope.journal.data = data;
        }
    });

    var checkLastEntry =  function() {
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
            console.log(error);
            createJournal();
        });
    };

    checkLastEntry();

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
        $scope.journalEntry.timestamp = now.toDateString();
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
            apiFactory.getJournal(id).then(function(data) {
                $scope.journal.data = data;
            });
        }, function(error) {
            console.log(error);
        });
        $scope.skipped = true; //remove entry tile
    };

    $scope.openDetails = function(index, entry) {
        $scope.activeEntry = entry;
        $scope.details = $scope.journal.data[index][2];
        $scope.showDetails = true;
    };

    $scope.closeDetails = function() {
        $scope.details = '';
        $scope.activeEntry = '';
        $scope.showDetails = false;
    };

    $scope.deleteEntry = function() {
        $http({
            method: 'POST',
            url: '/deleteentry',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: {
                id: Number(id),
                timestamp: $scope.activeEntry[0],
                details: $scope.activeEntry[2]
            }
        }).then(function(success) {
            console.log(success);
            apiFactory.getJournal(id).then(function(data) {
                $scope.journal.data = data;
                $scope.closeDetails();
            });
        }, function(error) {
            console.log(error);
        })
    };

    $scope.logout = function() {
        localStorage.setItem('id', null);
        localStorage.setItem('user', null);
        window.location = '/#/login';
    };
}]);
