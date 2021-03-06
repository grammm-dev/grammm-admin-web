import {
  LDAP_DATA_ERROR,
  LDAP_DATA_FETCH,
  LDAP_DATA_RECEIVED,
} from '../actions/types';

const defaultState = {
  loading: false,
  error: null,
  Users: [],
};

function ldapReducer(state=defaultState, action) {
  switch(action.type) {
    case LDAP_DATA_FETCH:
      return {
        ...state,
        loading: true,
      };
    
    case LDAP_DATA_RECEIVED:
      return {
        ...state,
        loading: false,
        error: null,
        Users: action.data.data,
      };

    case LDAP_DATA_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };

    default: return state;
  }
}

export default ldapReducer;