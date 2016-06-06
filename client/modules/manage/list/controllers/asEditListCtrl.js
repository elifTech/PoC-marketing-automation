export default
/*@ngInject*/
function($scope, $timeout, aListModel, $stateParams) {
    $scope.listName = "";
    console.log('$stateParams', $stateParams);

    $scope.saveItem = (listItem => {
        $scope.loading = true;
        var promise = aListModel.create({name: aListModel}, (response) => {
            console.log('response', response);
            
        }, err => {
            console.log('add error', err);
            $scope.$close();
            $scope.loading = false;
        });

        console.log(listItem, 'listItem');
    });

    $scope.find = _id => {
        aListModel.get({_id: _id},
        response => {
            $scope.listItem = response;
        },
        err => {
           console.log('error on get list', err);
        });
    };
    

    if($stateParams._id) $scope.find($stateParams._id);
}