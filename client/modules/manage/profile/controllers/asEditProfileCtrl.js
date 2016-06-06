export default
/*@ngInject*/
function($scope, $timeout, aProfileModel, $stateParams) {
    $scope.listName = "";
    console.log('$stateParams', $stateParams);

    $scope.saveItem = (listItem => {
        $scope.loading = true;
        var promise = aProfileModel.create({name: listItem}, (response) => {
            console.log('response', response);
            
        }, err => {
            console.log('add error', err);
            $scope.$close();
            $scope.loading = false;
        });

        console.log(listItem, 'listItem');
    });
    
    $scope.find = _id => {
        aProfileModel.get({profileId: _id},
        response => {
            $scope.listItem = response;
        },
        err => {
            console.log('error on get profile', err);
        });
    };

    if($stateParams._id) $scope.find($stateParams._id);
}