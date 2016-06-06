export default
/*@ngInject*/
function($scope, lists, $timeout, aListModel) {
    // get sites list
    $scope.lists = lists;

    $scope.removeList = _id => {
        aListModel.delete({_id: _id}, response => {
            console.log('remove list item OK', response);
        },
        err => {
           console.log('remove list item', err);
        });
    };
}