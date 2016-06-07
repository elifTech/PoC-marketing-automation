export default
/*@ngInject*/
function($scope, $timeout, aListModel, lists) {
    // get sites list
    $scope.lists = lists.items || [];

    var socket = io();

    socket.on('lists change', function(newData){
        $scope.lists = newData;
        $scope.$apply();
        console.log('lists change', newData);
    });

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