import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import App from './App.jsx'
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_AUDIENCE } from './config.js'
import './index.css'

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    clientId={AUTH0_CLIENT_ID}
    cacheLocation="localstorage"
    authorizationParams={{ redirect_uri: window.location.origin, audience: AUTH0_AUDIENCE }}
  >
    <App />
  </Auth0Provider>
)
