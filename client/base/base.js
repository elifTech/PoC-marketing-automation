let appName = 'base';
//
// import config from './config.js';

var module = angular.module(appName, [
    'ui.router',
    'ui.bootstrap'
]);

import routesConfig from './routes.js';

module.config(routesConfig);

export default appName;
