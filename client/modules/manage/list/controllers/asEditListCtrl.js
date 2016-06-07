export default
/*@ngInject*/
function($scope, $timeout, aListModel, $stateParams, aProfileModel) {
    $scope.list = {
        name: "",
        profiles: []
    };
    console.log('$stateParams', $stateParams);

    $scope.saveItem = (valid => {
        if(!valid) return;

    var saveMethod = aListModel.create;
    if($scope.list._key) {
        $scope.list._id = $scope.list._key;
        saveMethod = aListModel.save;
    }
    console.log('$scope.list', $scope.list);
    $scope.loading = true;
        saveMethod($scope.list, (response) => {
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
        aListModel.get({listId: _id},
        response => {
            response.list.profiles = (response.profiles_list !== undefined) ? response.profiles_list.map(profile => profile._key) : [];
            $scope.list = response.list;
        },
        err => {
            console.log('error on get list', err);
        });
    };

    aProfileModel.get(profiles => {
        $scope.profiles = profiles.items;
        $scope.selected = $scope.profiles[0]._key;

        $scope.profileMap = {};
        profiles.items.forEach(profile => {
            $scope.profileMap[profile._key] = profile;
        });
    });

    $scope.selecte = selected => {
        if(!$scope.list.profiles) $scope.list.profiles = [];
        if(!selected) return;
        var profileIndex = $scope.list.profiles.indexOf(selected);
        if(profileIndex !== -1) return;

        $scope.list.profiles.push(selected);
        console.log('selected', selected);
    };

    $scope.removeProfile = profile => {
        var profileIndex = $scope.list.profiles.indexOf(profile);
        if(profileIndex === -1) return;
        $scope.list.profiles.splice(profileIndex, 1);
    };

    if($stateParams._id) $scope.find($stateParams._id);
}