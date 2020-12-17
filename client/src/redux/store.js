
import { createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers'
import { composeWithDevTools } from 'redux-devtools-extension';

const initialState = {};
const middleware = [thunk]

const devTools =
  process.env.NODE_ENV === "production"
    ? applyMiddleware(...middleware)
    : composeWithDevTools(applyMiddleware(...middleware));

const store = createStore(rootReducer, initialState, devTools);
export default store;