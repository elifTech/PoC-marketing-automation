export default
/*@ngInject*/
function($scope, profiles, $timeout, aProfileModel) {
    // get sites list
    $scope.profiles = profiles.items || [];

    console.log('$scope.profiles', $scope.profiles);

    $scope.removeProfile = _id => {
        aProfileModel.delete({profileId: _id}, response => {
            console.log('remove list item OK', response);
        },
        err => {
           console.log('remove list item', err);
        });
    };
}