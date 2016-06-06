export default
/*@ngInject*/
function($scope, $timeout, aListModel) {
    // get sites list
    var lists;
    $scope.lists = lists || [];

    $scope.removeList = _id => {
        aListModel.delete({listId: _id}, response => {
            console.log('remove list item OK', response);
            aListModel.get(lists => {
                $scope.lists = lists.items;
            });
        },
        err => {
           console.log('remove list item', err);
        });
    };
}