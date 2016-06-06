export default
/*@ngInject*/
function($scope, $timeout, aListModel, $stateParams, aProfileModel) {
    $scope.list = {
        name: "",
        profiles: []
    };
    console.log('$stateParams', $stateParams);

    $scope.saveItem = (listItem => {
            console.log('listItem', listItem);
        var sendData = {
            name: listItem.name.$viewValue,
            // profiles: listItem.profiles.map(profile => profile._key)
            profiles: listItem.profiles.$viewValue
        };

        console.log('sendData', sendData);
        // return;
        $scope.loading = true;
        var promise = aListModel.create(sendData, (response) => {
            console.log('response', response);
            $scope.$close();
            $scope.loading = false;
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

    aProfileModel.get(profiles => {
        $scope.profiles = profiles.items;
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

    if($stateParams._id) $scope.find($stateParams._id);
}