/**
 * Created by Haneya Yunus.
 */
moodApp.factory('apiFactory', ['$http', function($http) {
    return{
        getJournal: function(id) {
            return $http.get('/getjournal?id=' + id).then(function(response) {
                return response.data;
            });
        }
    }
}]);