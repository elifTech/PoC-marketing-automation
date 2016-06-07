export default
/*@ngInject*/
function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('main', {
            parent: 'private',
            abstract: true,
            url: '/main',
            views: {
                'master-view': {templateUrl: 'client/views/parts/wraper.html'}
            }
        })
        .state('main.lists', {
            url: '/lists',
            resolve: {
                lists: (aListModel) => aListModel.get().$promise
            },
            views: {
                'main-content': {controller: 'asListCtrl', templateUrl: 'client/views/lists/page.html'}
            }
        })
        .state('main.lists.new-list', {
            url: '/new-list/:_id',
            onEnter: function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    backdropClass: 'modal-backdrop',
                    windowClass: 'modal-right',
                    animation: true,
                    templateUrl: 'client/views/lists/modal-project.html',
                    controller: 'asEditListCtrl'
                }).result.finally(() => $state.go('^', {}, { reload: true }));
            }
        })

        .state('main.profile', {
            url: '/profiles',
            resolve: {
                profiles: (aProfileModel) => aProfileModel.get().$promise
            },
            views: {
                'main-content': {controller: 'asProfilesCtrl', templateUrl: 'client/views/profile/list.html'}
            }
        })
        .state('main.profile.edit', {
            url: '/edit/:_id',
            onEnter: function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    backdropClass: 'modal-backdrop',
                    windowClass: 'modal-right',
                    animation: true,
                    templateUrl: 'client/views/profile/edit.html',
                    controller: 'asEditProfileCtrl'
                }).result.finally(() => $state.go('^', {}, { reload: true }));
            }
        });
};
