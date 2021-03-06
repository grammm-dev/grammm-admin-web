// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2020 grammm GmbH

import {
  FOLDERS_DATA_FETCH,
  FOLDERS_DATA_RECEIVED,
  FOLDERS_DATA_ERROR,
  FOLDER_DATA_ADD,
  FOLDER_DATA_DELETE,
  OWNERS_DATA_RECEIVED,
  OWNER_DATA_ADD,
  FOLDERS_NEXT_SET,
} from '../actions/types';
import { addItem, append } from '../utils';

const defaultState = {
  loading: false,
  error: null,
  count: 0,
  Folders: [],
  Owners: [],
};

function foldersReducer(state = defaultState, action) {
  switch (action.type) {
    case FOLDERS_DATA_FETCH:
      return {
        ...state,
        loading: true,
      };

    case FOLDERS_DATA_RECEIVED:
      return {
        ...state,
        loading: false,
        error: null,
        Folders: action.data.data,
        count: action.data.count,
      };
    
    case FOLDERS_NEXT_SET:
      return {
        ...state,
        loading: false,
        error: null,
        Folders: append(state.Folders, action.data.data),
        count: action.data.count,
      };
    
    case FOLDERS_DATA_ERROR: {
      return {
        ...state,
        error: action.error,
        loading: false,
        Folders: [],
      };
    }

    case FOLDER_DATA_ADD:
      return {
        ...state,
        Folders: addItem(state.Folders, action.data),
      };

    case FOLDER_DATA_DELETE:
      return {
        ...state,
        Folders: state.Folders.filter(folder => folder.folderid !== action.id),
        count: state.count - 1,
      };

    case OWNERS_DATA_RECEIVED:
      return {
        ...state,
        loading: false,
        error: null,
        Owners: action.data.data,
      };

    case OWNER_DATA_ADD:
      return {
        ...state,
        Owners: addItem(state.Owners, action.data),
      };

    default:
      return state;
  }
}

export default foldersReducer;
