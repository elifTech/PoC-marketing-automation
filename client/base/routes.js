export default
/*@ngInject*/
($stateProvider, $urlRouterProvider) => {

    $urlRouterProvider.otherwise(function($inject) {
        var $state = $inject.get('$state');
        $state.go('main.lists');
    });

    $stateProvider
        .state('private', { // complete
            abstract: true,
            views: {
                'dashboard': {templateUrl: 'client/views/main.html'}
            }
        })
    ;
};