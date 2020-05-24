import blogReducer from './blogReducer';
import authReducer from './authReducer';

import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  user: authReducer,
  editor: blogReducer
}
)

export default rootReducer;