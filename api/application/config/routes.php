<?php
defined('BASEPATH') or exit('No direct script access allowed');

$route['default_controller'] = 'welcome';
$route['404_override'] = '';
$route['translate_uri_dashes'] = FALSE;
$route['api/demo'] = 'api/ApiDemoController/index';


// User
$route['user'] = 'User/index';
$route['login'] = 'User/login'; 



// External
$route['external_document'] = 'ExternalDocument/index';
$route['external_document/insert'] = 'ExternalDocument/insert';
$route['external_document/find/(:any)'] = 'ExternalDocument/find/$1';
$route['external_document/update/(:any)'] = 'ExternalDocument/update/$1';
$route['external_document/delete/(:any)'] = 'ExternalDocument/delete/$1';
$route['external_document/bulk_delete/'] = 'ExternalDocument/bulk_delete/';

// Internal
$route['internal_document'] = 'InternalDocument/index';
$route['internal_document/insert'] = 'InternalDocument/insert';
$route['internal_document/find/(:any)'] = 'InternalDocument/find/$1';
$route['internal_document/update/(:any)'] = 'InternalDocument/update/$1';
$route['internal_document/delete/(:any)'] = 'InternalDocument/delete/$1';
$route['internal_document/bulk_delete/'] = 'InternalDocument/bulk_delete/';



// ExternalDissemination
$route['external_dissemination'] = 'ExternalDissemination/index';
$route['external_dissemination/insert'] = 'ExternalDissemination/insert';
$route['external_dissemination/find/(:any)'] = 'ExternalDissemination/find/$1';
$route['external_dissemination/update/(:any)'] = 'ExternalDissemination/update/$1';
$route['external_dissemination/delete/(:any)'] = 'ExternalDissemination/delete/$1';
$route['external_dissemination/bulk_delete/'] = 'ExternalDissemination/bulk_delete/';




// InternalDissemination
$route['internal_dissemination'] = 'InternalDissemination/index';
$route['internal_dissemination/insert'] = 'InternalDissemination/insert';
$route['internal_dissemination/find/(:any)'] = 'InternalDissemination/find/$1';
$route['internal_dissemination/update/(:any)'] = 'InternalDissemination/update/$1';
$route['internal_dissemination/delete/(:any)'] = 'InternalDissemination/delete/$1';
$route['internal_dissemination/bulk_delete/'] = 'InternalDissemination/bulk_delete/';