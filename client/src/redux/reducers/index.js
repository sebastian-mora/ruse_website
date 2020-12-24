import blogReducer from './blogReducer';
import authReducer from './authReducer';
import editorReducer from './editorReducer';
import userManageReducer from './userManageReducer';

import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  user: authReducer,
  blogs: blogReducer,
  editor: editorReducer,
  userManage: userManageReducer
}
)

export default rootReducer;