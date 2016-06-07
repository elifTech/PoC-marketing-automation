export default
/*@ngInject*/
function($scope, $timeout, aProfileModel, $stateParams) {
    $scope.profile = {};
    console.log('$stateParams', $stateParams);

    $scope.saveItem = (profile => {
        $scope.profile.name = $scope.profile.firstname + " " + $scope.profile.lastname;

        var saveMethod = aProfileModel.create;
        if($scope.profile._key) {
            $scope.profile.profileId = $scope.profile._key;
            saveMethod = aProfileModel.save;
        }

        $scope.loading = true;
        saveMethod($scope.profile, (response) => {
            console.log('response', response);
            $scope.$close();
            $scope.loading = false;
        }, err => {
            console.log('add error', err);
            $scope.$close();
            $scope.loading = false;
        });
    });
    
    $scope.find = _id => {
        aProfileModel.get({profileId: _id},
        response => {
            var profile = response.profile;
            var userName = profile.name.split(" ");
            profile.firstname = userName[0];
            profile.lastname = userName[1];
            profile.interests = profile.interests || []
            $scope.profile = profile;
        },
        err => {
            console.log('error on get profile', err);
        });
    };

    $scope.addInterest = interest => {
        if(!interest || !interest.length) return;
        if(!$scope.profile.interests) $scope.profile.interests = [];

        var isInList = $scope.profile.interests.indexOf(interest);
        if(isInList !== -1) return;
        $scope.profile.interests.push(interest);
        interest = '';
    }
    $scope.removeInterest = interest => {
        var index = $scope.profile.interests.indexOf(interest);
        if(index === -1) return;
        $scope.profile.interests.splice(index, 1);
    }

    if($stateParams._id) $scope.find($stateParams._id);
}