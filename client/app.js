import base from './base/base';
import config from './config';
import modules from './modules/modules.config';

let appName = 'marketing';

try {
    angular.module('views');
} catch (e) {
    angular.module('views', []);
}

window.config = config;

var socket = io();

angular.module(appName, [base].concat(modules));

export default appName;