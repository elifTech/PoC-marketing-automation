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

socket.on('lists change', function(newData){
    console.log('lists change');
});

socket.on('profiles change', function(newData){
    console.log('profiles change');
});

angular.module(appName, [base].concat(modules));

export default appName;