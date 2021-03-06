// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2020 grammm GmbH

import {
  USERS_DATA_FETCH,
  USERS_DATA_RECEIVED,
  USERS_DATA_ERROR,
  USER_DATA_ADD,
  USER_DATA_EDIT,
  USER_DATA_DELETE,
  USERS_NEXT_SET,
  ORPHANED_USERS_RECEIVED,
  ORPHANS_DELETED,
} from './types';
import { user, allUsers, users, addUser, editUser, editUserRole, deleteUser,
  ldapDump, checkLdap, deleteOrphans } from '../api';

export function fetchUsersData(domainID, params) {
  return async dispatch => {
    await dispatch({type: USERS_DATA_FETCH});
    try {
      const data = await dispatch(users(domainID, params));
      if(!params.offset) await dispatch({ type: USERS_DATA_RECEIVED, data });
      else await dispatch({ type: USERS_NEXT_SET, data });
    } catch(err) {
      await dispatch({type: USERS_DATA_ERROR, error: 'Failed to fetch users'});
      console.error('Failed to fetch users');
      return Promise.reject(err.message);
    }
  };
}

export function fetchUserData(domainID, userID) {
  return async dispatch => {
    try {
      const userData = await dispatch(user(domainID, userID));
      return Promise.resolve(userData);
    } catch(err) {
      await dispatch({type: USERS_DATA_ERROR, error: 'Failed to fetch users'});
      console.error('Failed to fetch users');
      return Promise.reject(err.message);
    }
  };
}

export function fetchAllUsers(params) {
  return async dispatch => {
    await dispatch({type: USERS_DATA_FETCH});
    try {
      const data = await dispatch(allUsers(params));
      await dispatch({type: USERS_DATA_RECEIVED, data});
    } catch(err) {
      await dispatch({type: USERS_DATA_ERROR, error: 'Failed to fetch users'});
      console.error('Failed to fetch users');
      return Promise.reject(err.message);
    }
  };
}

export function fetchLdapDump(params) {
  return async dispatch => {
    try {
      const data = await dispatch(ldapDump(params));
      return Promise.resolve(data);
    } catch(err) {
      return Promise.reject(err.message);
    }
  };
}

export function checkLdapUsers(params) {
  return async dispatch => {
    try {
      const data = await dispatch(checkLdap(params));
      await dispatch({ type: ORPHANED_USERS_RECEIVED, data });
    } catch(err) {
      return Promise.reject(err.message);
    }
  };
}

export function addUserData(domainID, user) {
  return async dispatch => {
    try {
      let resp = await dispatch(addUser(domainID, user));
      if(resp) await dispatch({type: USER_DATA_ADD, user: resp});
      return Promise.resolve(resp);
    } catch(err) {
      await dispatch({type: USERS_DATA_ERROR, error: 'Failed to add user'});
      console.error('Failed to add user', err);
      return Promise.reject(err.message);
    }
  };
}

export function editUserData(domainID, user) {
  return async dispatch => {
    try {
      const resp = await dispatch(editUser(domainID, user));
      await dispatch({type: USER_DATA_EDIT, user: resp});
    } catch(err) {
      await dispatch({type: USERS_DATA_ERROR, error: 'Failed to edit user'});
      console.error('Failed to edit user', err);
      return Promise.reject(err.message);
    }
  };
}

export function editUserRoles(domainID, userID, roles) {
  return async dispatch => {
    try {
      await dispatch(editUserRole(domainID, userID, roles));
    } catch(err) {
      await dispatch({type: USERS_DATA_ERROR, error: 'Failed to edit user'});
      console.error('Failed to edit user', err);
      return Promise.reject(err.message);
    }
  };
}

export function deleteUserData(domainID, id, deleteFiles) {
  return async dispatch => {
    try {
      await dispatch(deleteUser(domainID, id, deleteFiles));
      await dispatch({type: USER_DATA_DELETE, id});
    } catch(err) {
      await dispatch({type: USERS_DATA_ERROR, error: 'Failed to delete user'});
      console.error('Failed to edit user', err);
      return Promise.reject(err.message);
    }
  };
}

export function deleteOrphanedUsers(params) {
  return async dispatch => {
    try {
      await dispatch(deleteOrphans(params));
      await dispatch({ type: ORPHANS_DELETED });
    } catch(err) {
      return Promise.reject(err.message);
    }
  };
}
