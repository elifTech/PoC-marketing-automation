export default
/*@ngInject*/
function aListModel($resource, API) {
  var resource = $resource(API + '/list/:listId/:method', {
    'listId': '@_id'
  }, {
    'get': {method: 'GET'},
    'save': {method: 'PUT'},
    'create': {method: 'POST'},
    'update': {method: 'PATCH'},
    'delete': {method: 'DELETE'},

    'list': {method: 'GET', params: { method: 'list'}, isArray: true}
  });


  return resource;
}
