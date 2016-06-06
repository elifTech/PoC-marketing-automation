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
            url: '',
            resolve: {
                // lists: (aListModel) => aListModel.list({page: 1, limit: 100}).$promise
            },
            views: {
                'main-content': {templateUrl: 'client/views/main/page.html'}
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
        
        // .state('main.profile', {
        //     url: "/profile",
        //     parent: 'homepage',
        //     templateUrl: "views/profile/edit.html",
        // })
};
