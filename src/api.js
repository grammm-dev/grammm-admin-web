// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2020 grammm GmbH

const baseUrl = '//' + window.location.host + '/api/v1';

async function handleErrors(response) {
  if (response.ok) {
    return await response.json();
  }
  let resp = '';
  await response.json().then(json => {
    resp = json.message;
  });
  return Promise.reject(new Error(resp));
}

async function get(path) {
  return await fetch(baseUrl + path)
    .then(handleErrors);
}

async function patch(path, data) {
  return fetch((baseUrl + path), {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(handleErrors);
}

async function post(path, data) {
  return await fetch((baseUrl + path), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(handleErrors);
}

async function put(path, data) {
  return await fetch((baseUrl + path), {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(handleErrors);
}

async function yeet(path) {
  return await fetch((baseUrl + path), {
    method: 'DELETE',
  }).then(handleErrors);
}

/*
async function upload(path, data) {
  return fetch((baseUrl + path), {
    method: 'POST',
    body: data,
  }).then(handleErrors)
    .then(response => response.json());
}
*/

async function uploadPut(path, data) {
  return fetch((baseUrl + path), {
    method: 'PUT',
    body: data,
  }).then(handleErrors);
}

async function loginPost(path, data) {
  return await fetch((baseUrl + path), {
    method: 'POST',
    body: data || null,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(handleErrors);
}

async function renew() {
  return await fetch((baseUrl + '/login'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(handleErrors);
}

function toArray(obj) {
  const arr = [];
  Object.entries(obj).forEach(([name, val]) => arr.push({ name, val }));
  return arr;
}

function buildQuery(endpoint, params) {
  let query = endpoint;
  const paramsArray = toArray(params);
  if(paramsArray.length === 0) return query;
  query += '?';
  paramsArray.forEach(param => query += ![undefined].includes(param.val) ? `${param.name}=${param.val}&` : '');
  return query.slice(0, -1);
}

/*
  LOGIN
*/

export function login(user, pass) {
  return async () => {
    return await loginPost('/login', `user=${encodeURIComponent(user)}&pass=${encodeURIComponent(pass)}`);
  };
}

export function renewToken() {
  return async () => {
    return await renew();
  };
}

export function profile() {
  return async () => {
    return await get('/profile');
  };
}

/*
  DASHBOARD
*/

export function dashboard() {
  return async () => {
    return await get('/system/dashboard');
  };
}

export function services() {
  return async () => {
    return await get('/system/dashboard/services');
  };
}

export function postServices(service, action) {
  return async () => {
    return await post('/system/dashboard/services/' + service + '/' + action);
  };
}

/*
  DOMAINS
*/

export function drawerDomains() {
  return async () => {
    return await get(buildQuery('/domains', { domainType: 0 }));
  };
}

export function domains(params) {
  return async () => {
    return await get(buildQuery('/system/domains', { ...params, domainType: 0 }));
  };
}

export function domain(id) {
  return async () => {
    return await get('/system/domains/' + id);
  };
}

export function addDomain(domain) {
  return async () => {
    return await post('/system/domains', domain);
  };
}

export function editDomain(domain) {
  return async () => {
    return await patch('/system/domains/' + domain.ID, { ...domain, ID: undefined });
  };
}

export function deleteDomain(id) {
  return async () => {
    return await yeet('/system/domains/' + id);
  };
}

export async function changeDomainPassword(id, newPw) {
  try {
    return await put('/system/domains/' + id + '/password', { new: newPw });
  } catch(err) { console.error(err); }
}

/*
  USERS
*/

export function allUsers(params) {
  return async () => {
    return await get(buildQuery('/system/users', { ...params, addressType: 0 }));
  };
}

export function users(domainID, params) {
  return async () => {
    return await get(buildQuery(
      '/domains/' + domainID + '/users', { ...params, properties: 'displayname,storagequotalimit', addressType: 0 }));
  };
}

export function user(domainID, userID) {
  return async () => {
    return await get('/domains/' + domainID + '/users/'+ userID);
  };
}

export function addUser(domainID, user) {
  return async () => {
    return await post('/domains/' + domainID + '/users', user);
  };
}

export function editUser(domainID, user) {
  return async () => {
    return await patch('/domains/' + domainID + '/users/' + user.ID, { ...user, ID: undefined });
  };
}

export function deleteUser(domainID, id, deleteFiles) {
  return async () => {
    return await yeet('/domains/' + domainID + '/users/' + id + '?deleteFiles=' + deleteFiles);
  };
}

export async function changeUserPassword(domainID, id, newPw) {
  try {
    return await put('/domains/' + domainID + '/users/' + id + '/password',
      { new: newPw });
  } catch(err) { return Promise.reject(err); }
}

export function editUserRole(domainID, userID, roles) {
  return async () => {
    return await patch('/domains/' + domainID + '/users/' + userID + '/roles', roles);
  };
}

/* LDAP */

export function searchLdap(params) {
  return async () => {
    return await get(buildQuery('/ldap/search', params));
  };
}

export function importUser(params) {
  return async () => {
    return await post(buildQuery('/ldap/importUser', params));
  };
}

export function sync(domainID, userID) {
  return async () => {
    return await put('/domains/' + domainID + '/users/' + userID + '/downsync');
  };
}

export function syncAll() {
  return async () => {
    return await post('/ldap/downsync');
  };
}

export function ldapDump(params) {
  return async () => {
    return await get(buildQuery('/ldap/dump', params));
  };
}

export function checkLdap(params) {
  return async () => {
    return await get(buildQuery('/ldap/check', params));
  };
}

export function deleteOrphans(params) {
  return async () => {
    return await yeet(buildQuery('/ldap/check', params));
  };
}

export function ldapConfig() {
  return async () => {
    return await get('/mconf/ldap');
  };
}

export function updateLdap(config) {
  return async () => {
    return await put('/mconf/ldap', config);
  };
}

export function deleteLdap() {
  return async () => {
    return await yeet('/mconf/ldap');
  };
}

/*
  ROLES
*/

export function roles(params) {
  return async () => {
    return await get(buildQuery('/system/roles', { ...params, level: 2 }));
  };
}

export function role(id) {
  return async () => {
    return await get('/system/roles/' + id);
  };
}

export function addRole(role) {
  return async () => {
    return await post('/system/roles', role);
  };
}

export function editRole(role) {
  return async () => {
    return await patch('/system/roles/' + role.ID, { ...role, ID: undefined });
  };
}

export function deleteRole(id) {
  return async () => {
    return await yeet('/system/roles/' + id);
  };
}

/*
  PERMISSIONS
*/

export function permissions(params) {
  return async () => {
    return await get(buildQuery('/system/roles/permissions', params));
  };
}

/*
  License
*/

export function license() {
  return async () => {
    return await get('/system/license');
  };
}

export function uploadLicense(license) {
  return async () => {
    return await uploadPut('/system/license', license);
  };
}

/*
  GROUPS
*/

export function groups(domainID, params) {
  return async () => {
    return await get(buildQuery('/domains/' + domainID + '/groups', params));
  };
}

export function addGroup(domainID, group) {
  return async () => {
    return await post('/domains/' + domainID + '/groups', group);
  };
}

export function editGroup(domainID, group) {
  return async () => {
    return await patch('/domains/' + domainID + '/groups/' + group.ID, { ...group, ID: undefined });
  };
}

export function deleteGroup(domainID, id) {
  return async () => {
    return await yeet('/domains/' + domainID + '/groups/' + id);
  };
}

export function groupDetails(domainID, id) {
  return async () => {
    return await get('/domains/' + domainID + '/groups/' + id);
  };
}

/*
  FOLDERS
*/

export function folders(domainID, params) {
  return async () => {
    return await get(buildQuery('/domains/' + domainID + '/folders', params));
  };
}

export function folder(domainID, folderID) {
  return async () => {
    return await get('/domains/' + domainID + '/folders/'+ folderID);
  };
}

export function addFolder(domainID, folder) {
  return async () => {
    return await post('/domains/' + domainID + '/folders', folder);
  };
}

export function editFolder(domainID, folder) {
  return async () => {
    return await patch('/domains/' + domainID + '/folders/' + folder.folderid, folder);
  };
}

export function deleteFolder(domainID, id) {
  return async () => {
    return await yeet('/domains/' + domainID + '/folders/' + id);
  };
}

/*
  OWNERS
*/

export function owners(domainID, folderID, params) {
  return async () => {
    return await get(buildQuery('/domains/' + domainID + '/folders/' + folderID + '/owners'), params);
  };
}

export function addOwner(domainID, folderID, username) {
  return async () => {
    return await post('/domains/' + domainID + '/folders/' + folderID + '/owners', username);
  };
}

export function deleteOwner(domainID, folderID, memberID) {
  return async () => {
    return await yeet('/domains/' + domainID + '/folders/' + folderID + '/owners/' + memberID);
  };
}

/*
  ORGS
*/

export function orgs() {
  return async () => {
    return await get('/orgs');
  };
}

export function addOrg(org) {
  return async () => {
    return await post('/orgs', org);
  };
}

export function editOrg(org) {
  return async () => {
    return await patch('/orgs/' + org.ID, org);
  };
}

export function deleteOrg(id) {
  return async () => {
    return await yeet('/orgs/' + id);
  };
}

/*
  FORWARDS
*/

export function forwards() {
  return async () => {
    return await get('/forwards');
  };
}

export function addForward(forward) {
  return async () => {
    return await post('/forwards', forward);
  };
}

export function editForward(forward) {
  return async () => {
    return await patch('/forwards/' + forward.ID, forward);
  };
}

export function deleteForward(id) {
  return async () => {
    return await yeet('/forwards/' + id);
  };
}

/*
  MLISTS
*/

export function mlists(domainID, params) {
  return async () => {
    return await get(buildQuery('/domains/' + domainID + '/mlists', params));
  };
}

export function addMlist(domainID, mlist) {
  return async () => {
    return await post('/domains/' + domainID + '/mlists', mlist);
  };
}

export function editMlist(domainID, mlist) {
  return async () => {
    return await patch('/domains/' + domainID + '/mlists/' + mlist.ID, { ...mlist, ID: undefined });
  };
}

export function deleteMlist(domainID, id) {
  return async () => {
    return await yeet('/domains/' + domainID + '/mlists/' + id);
  };
}

export function mlistDetails(domainID, id) {
  return async () => {
    return await get('/domains/' + domainID + '/mlists/' + id);
  };
}

/*
  CLASSES
*/

export function classes(domainID, params) {
  return async () => {
    return await get(buildQuery('/domains/' + domainID + '/classes', params));
  };
}

export function classesTree(domainID, params) {
  return async () => {
    return await get(buildQuery('/domains/' + domainID + '/classes/tree', params));
  };
}

export function addClass(domainID, _class) {
  return async () => {
    return await post('/domains/' + domainID + '/classes', _class);
  };
}

export function editClass(domainID, _class) {
  return async () => {
    return await patch('/domains/' + domainID + '/classes/' + _class.ID, { ..._class, ID: undefined });
  };
}

export function deleteClass(domainID, id) {
  return async () => {
    return await yeet('/domains/' + domainID + '/classes/' + id);
  };
}

export function classDetails(domainID, id) {
  return async () => {
    return await get('/domains/' + domainID + '/classes/' + id);
  };
}

/*
  MEMBERS
*/

export function members() {
  return async () => {
    return await get('/members');
  };
}

export function addMember(member) {
  return async () => {
    return await post('/members', member);
  };
}

export function editMember(member) {
  return async () => {
    return await patch('/members/' + member.ID, member);
  };
}

export function deleteMember(id) {
  return async () => {
    return await yeet('/members/' + id);
  };
}

/*
  MAIL ADDRESSES
*/

export async function mailAddresses(domain) {
  try {
    return await get('/system/' + domain + '/mailAddresses');
  } catch(err) { console.error(err); }
}

export async function addMailAddress(domain, mail) {
  try {
    return await post('/system/' + domain + '/mailAddresses', mail);
  } catch(err) { console.error(err); }
}

export async function editMailAddress(domain, mail) {
  try {
    return await patch('/system/' + domain + '/mailAddresses', mail);
  } catch(err) { console.error(err); }
}

export async function deleteMailAddress(domain, id) {
  try {
    return await yeet('/system/' + domain + '/mailAddresses/' + id);
  } catch(err) { console.error(err); }
}

/*
  BASE SUTUP
*/

export async function baseSetup() {
  try {
    return await get('/baseSetup');
  } catch(err) { console.error(err); }
}

export async function editBaseSetup(setup) {
  try {
    return await patch('/baseSetup', setup);
  } catch(err) { console.error(err); }
}

/*
  CHANGE PW
*/

export async function changePw(oldPw, newPw) {
  try {
    return await put('/passwd', { old: oldPw, new: newPw });
  } catch(err) { return Promise.reject(err); }
}
