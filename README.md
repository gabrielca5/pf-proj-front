# pf-proj-front

**Para a prova: veja o [COMO_MEXER.md](COMO_MEXER.md).**

Lista e cadastra avaliações. React + Vite, login com Auth0, deploy na Vercel.

O passo a passo do Auth0 está no README do `pf-proj-back`.

## Rodar local

```bash
npm install
npm run dev     # http://localhost:5173, com o back em localhost:8080
```

## Deploy na Vercel

1. Em vercel.com, **Add New > Project**, importe este repositório. O preset Vite é detectado sozinho.
2. Depois do deploy, copie a URL e coloque nos três campos de URL da aplicação no Auth0 (Callback, Logout, Web Origins).

O front chama sempre `/api/avaliacoes`. Em produção o `vercel.json` repassa isso para a máquina AWS, então o navegador não bloqueia a chamada (o site é HTTPS e o back é HTTP) e o back não precisa de CORS.

## Na prova: trocar a entidade

1. `src/config.js`: troque `API` para a rota nova (`/api/tarefas`).
2. `src/App.jsx`:
   - `VAZIO`: os campos que o usuário digita.
   - `<form>`: um `<input>` por campo.
   - `<table>`: um `<th>` e um `<td>` por campo.
3. Quem vê o formulário: a linha `const admin = roles.includes('ADMIN')`.
4. Se o IP da máquina mudou: `vercel.json`.
