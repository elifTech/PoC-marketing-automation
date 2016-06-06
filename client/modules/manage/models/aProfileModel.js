export default
/*@ngInject*/
function aProfileModel($resource, API) {
  var resource = $resource(API + '/profile/:_id/:method', {
    '_id': '@_id'
  }, {
    'get': {method: 'GET'},
    'save': {method: 'PUT'},
    'create': {method: 'POST'},
    'update': {method: 'PATCH'},
    'delete': {method: 'DELETE'}
  });

  return resource;
}
