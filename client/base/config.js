export default
/*@ngInject*/
function configState($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push('UnknownDomainInterceptor');
    
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('homepage', {
            abstract: true,
            templateUrl: "views/main.html",
            resolve: {
                // @todo comment for open site
                //permissions: basePermissionsSetProvider.access(['auth.login'])
            }
        });
}