import React from "react";
import { useHistory } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

const Auth0ProviderWithHistory = ({ children }) => {
  const domain = "ruse.us.auth0.com";
  const clientId = "n1b80LO6DOs7BTob1DTwkNpOOGsUd3Yr"

  const history = useHistory();

  const onRedirectCallback = (appState) => {
    history.push(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience="https://api.ruse.tech"
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory;