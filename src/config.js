// Auth0: TROCAR pelos valores do seu tenant (nenhum deles e segredo)
export const AUTH0_DOMAIN = "dev-bagcu2meoustygzv.us.auth0.com";
export const AUTH0_CLIENT_ID = "znnzKpojUkTjTB22suaZCyMnM6LBTI09";
export const AUTH0_AUDIENCE = "https://pf-api";

// Claim que a Action do Auth0 coloca no token (igual ao SecurityConfig do back)
export const CLAIM_ROLES = "https://pf/roles";

// Rota do back. O /api e removido pelo proxy (vite.config.js em dev, vercel.json em producao)
export const API = "/api/tarefas";
