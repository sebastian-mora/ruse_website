import loggedReducer from './isLogged';
import blogReducer from './blogReducer';

import {combineReducers} from 'redux';


const rootReducer = combineReducers({
  user: loggedReducer,
  editor: blogReducer
}
)

export default rootReducer;