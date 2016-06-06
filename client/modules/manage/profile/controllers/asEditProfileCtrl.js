export default
/*@ngInject*/
function($scope, $timeout, aProfileModel, $stateParams) {
    $scope.profile = {};
    console.log('$stateParams', $stateParams);

    $scope.saveItem = (profile => {
        var sendData = {
            name: profile.firstname.$viewValue + " " + profile.lastname.$viewValue,
            email: profile.email.$viewValue,
            interests: profile.interests.$viewValue
        };

        console.log('sendData', sendData);

        var saveMethod = aProfileModel.create;
        if($scope.profile._key) saveMethod = aProfileModel.save;

        $scope.loading = true;
        saveMethod(sendData, (response) => {
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
            $scope.profile = response;
        },
        err => {
            console.log('error on get profile', err);
        });
    };

    if($stateParams._id) $scope.find($stateParams._id);
}