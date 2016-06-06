var appName = 'module.manage.profile';

let module = angular.module(appName, []);

import asEditProfileCtrl from './controllers/asEditProfileCtrl.js';
import asProfilesCtrl from './controllers/asProfilesCtrl.js';

module
    .controller('asEditProfileCtrl', asEditProfileCtrl)
    .controller('asProfilesCtrl', asProfilesCtrl);

// config
module.config(function($stateProvider) {

});

export default appName;