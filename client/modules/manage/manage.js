import list from './list/list';
import profile from './profile/profile';
import models from './models/models';

var appName = 'module.manage';

var module = angular.module(appName, [
    list,
    profile,
    models
]);

import routes from './routes';
module
    .config(routes)
;

export default appName;