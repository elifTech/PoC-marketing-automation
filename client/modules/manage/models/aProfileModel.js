export default
/*@ngInject*/
function aProfileModel($resource, API) {
  var resource = $resource(API + '/profile/:profileId/:method', {
    'profileId': '@profileId'
  }, {
    'get': {method: 'GET'},
    'save': {method: 'PUT'},
    'create': {method: 'POST'},
    'update': {method: 'PATCH'},
    'delete': {method: 'DELETE'}
  });

  return resource;
}
