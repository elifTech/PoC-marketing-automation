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
        
        $scope.loading = true;
        var promise = aListModel.create($scope.list, (response) => {
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
        aListModel.get({_id: _id},
        response => {
            $scope.listItem = response;
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