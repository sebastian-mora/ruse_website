import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
  <Auth0Provider
    domain="ruse.us.auth0.com"
    clientId="n1b80LO6DOs7BTob1DTwkNpOOGsUd3Yr"
    redirectUri={window.location.origin}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);
