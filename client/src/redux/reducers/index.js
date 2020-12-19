import blogReducer from './blogReducer';
import authReducer from './authReducer';
import editorReducer from './editorReducer';

import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  user: authReducer,
  blogs: blogReducer,
  editor: editorReducer
}
)

export default rootReducer;