export default
/*@ngInject*/
function($scope, profiles, $timeout, aProfileModel, socket) {
    // get sites list
    $scope.profiles = profiles.items || [];
    
    socket.on('profiles change', function(newData){
        $scope.profiles = newData;
        $scope.$apply();
        console.log('profiles change', newData);
    });
    
    
    console.log('$scope.profiles', $scope.profiles);

    $scope.removeProfile = _id => {
        aProfileModel.delete({profileId: _id}, response => {
            console.log('remove list item OK', response);
            aProfileModel.get(profiles => {
                $scope.profiles = profiles.items;
            });
        },
        err => {
           console.log('remove list item', err);
        });
    };
}