var appName = 'module.manage.models';

var module = angular.module(appName, [
    'ngResource'
]);

module.constant('API', '/api');

import aListModel from './aListModel';
import aProfileModel from './aProfileModel';

module
.factory('aListModel', aListModel)
.factory('aProfileModel', aProfileModel);

export default appName;