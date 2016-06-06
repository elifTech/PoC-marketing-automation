var appName = 'module.manage.list';

let module = angular.module(appName, []);
// controllers
import asEditListCtrl from './controllers/asEditListCtrl.js';

module
    .controller('asEditListCtrl', asEditListCtrl);

// config
module.config(function($stateProvider) {

});
export default appName;