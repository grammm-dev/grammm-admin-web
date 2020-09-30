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

async function uploadPut(path, data) {
  return fetch((baseUrl + path), {
    method: 'PUT',
    body: data,
  }).then(handleErrors)
    .then(response => response.json());
}

async function loginPost(path, data) {
  return await fetch((baseUrl + path), {
    method: 'POST',
    body: data || null,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  }).then(handleErrors)
    .then(response => response.json());
}*/


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

export function domains() {
  return async () => {
    return await get('/system/domains');
  };
}

export function addDomain(domain) {
  return async () => {
    return await post('/system/domains', domain);
  };
}

export function editDomain(domain) {
  return async () => {
    return await patch('/system/domains/' + domain.ID, domain);
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

export function users(domainID) {
  return async () => {
    return await get('/domains/' + domainID + '/users');
  };
}

export function addUser(domainID, user) {
  return async () => {
    return await post('/domains/' + domainID + '/users', user);
  };
}

export function editUser(domainID, user) {
  return async () => {
    return await patch('/domains/' + domainID + '/users/' + user.ID, user);
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
  } catch(err) { console.error(err); }
}

export function userAliases(domainID) {
  return async () => {
    return await get('/domains/' + domainID + '/aliases');
  };
}

/*
  GROUPS
*/

export function groups() {
  return async () => {
    return await get('/groups');
  };
}

export function addGroup(group) {
  return async () => {
    return await post('/groups', group);
  };
}

export function editGroup(group) {
  return async () => {
    return await patch('/groups/' + group.ID, group);
  };
}

export function deleteGroup(id) {
  return async () => {
    return await yeet('/groups/' + id);
  };
}

/*
  FOLDERS
*/

export function folders(domainID) {
  return async () => {
    return await get('/domains/' + domainID + '/folders');
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
  ALIASES
*/

export function aliases() {
  return async () => {
    return await get('/system/aliases');
  };
}

export function addAlias(domainID, aliasname) {
  return async () => {
    return await post('/system/domains/' + domainID + '/aliases', { aliasname });
  };
}

export function editAlias(alias) {
  return async () => {
    return await patch('/system/aliases/' + alias.ID, alias);
  };
}

export function deleteAlias(id) {
  return async () => {
    return await yeet('/system/aliases/' + id);
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

export function mlists() {
  return async () => {
    return await get('/mlists');
  };
}

export function addMlist(mlist) {
  return async () => {
    return await post('/mlists', mlist);
  };
}

export function editMlist(mlist) {
  return async () => {
    return await patch('/mlists/' + mlist.ID, mlist);
  };
}

export function deleteMlist(id) {
  return async () => {
    return await yeet('/mlists/' + id);
  };
}

/*
  CLASSES
*/

export function classes() {
  return async () => {
    return await get('/classes');
  };
}

export function addClass(Class) {
  return async () => {
    return await post('/classes', Class);
  };
}

export function editClass(Class) {
  return async () => {
    return await patch('/classes/' + Class.ID, Class);
  };
}

export function deleteClass(id) {
  return async () => {
    return await yeet('/classes/' + id);
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
  Sys
*/

export async function dataArea() {
  return await get('/system/area_list');
}

export async function addDataArea(data) {
  return await post('/system/area_list', data);
}

export async function deleteDataArea(id) {
  return await yeet('/system/area_list/' + id);
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
    return await patch('/changePw', { oldPw, newPw });
  } catch(err) { console.error(err); }
}
