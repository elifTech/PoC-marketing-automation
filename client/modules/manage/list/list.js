var appName = 'module.manage.list';

let module = angular.module(appName, []);
// controllers
import asEditListCtrl from './controllers/asEditListCtrl.js';
import asListCtrl from './controllers/asListCtrl.js';

module
    .controller('asEditListCtrl', asEditListCtrl)
    .controller('asListCtrl', asListCtrl);

// config
module.config(function($stateProvider) {

});
export default appName;