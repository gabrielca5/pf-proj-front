# Como mexer (front)

Todo push na `main` publica sozinho na Vercel (uns 30 segundos). Rodar local: `npm run dev` (http://localhost:5173).

## Mapa

| Arquivo | Mexer quando |
|---|---|
| `src/config.js` | rota do back (`API`), claim das roles |
| `src/App.jsx` | tudo da tela: form, tabela, botoes, quem ve o que |
| `vercel.json` | so se o IP da AWS mudar |
| `vite.config.js` | so se o IP da AWS mudar (proxy do `npm run dev`) |

Dentro do `App.jsx`:
- `VAZIO`: campos do formulario.
- `chamar()`: faz a chamada ao back ja com o token.
- `listar()` e `cadastrar()`: as duas acoes que existem.
- `admin`: `true` se o usuario tem a role ADMIN.

## Receitas

### Trocar a entidade (rota /tarefas)
1. `config.js`: `export const API = '/api/tarefas'`.
2. `App.jsx`: troque `VAZIO` pelos campos novos.
3. No `<form>`: um `<input>` por campo, no mesmo padrao dos que ja existem (o `value` e o `onChange` usam o nome do campo).
4. Na `<table>`: um `<th>` e um `<td>` por campo.

### Campo novo
`VAZIO`, um `<input>` no form, um `<th>` e um `<td>` na tabela. Numero: `type="number"`. Texto longo: `<textarea>`.

### Quem ve o que
Esconder no front e so visual. Quem barra de verdade e o back (`@PreAuthorize`), entao a role de cada rota se define la, no `COMO_MEXER.md` do back.

- So ADMIN: `{admin && (...)}`, como esta o formulario.
- So USER: `{roles.includes('USER') && (...)}`.
- Qualquer logado: sem condicao.

### Botao de excluir
Na funcao do componente (junto de `cadastrar`):
```jsx
async function excluir(id) {
  const token = await getAccessTokenSilently()
  await fetch(`${API}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
  listar()
}
```
Na tabela, um `<th></th>` no cabecalho e, em cada linha:
```jsx
{admin && <td><button onClick={() => excluir(item.id)}>Excluir</button></td>}
```
Nao use o `chamar()` para o DELETE: ele tenta ler JSON e a resposta vem vazia.

### Botao de editar (rapido, com prompt)
```jsx
async function editar(item) {
  const nota = prompt('Nova nota', item.nota)
  if (nota === null) return
  const token = await getAccessTokenSilently()
  await fetch(`${API}/${item.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ ...item, nota: Number(nota) }),
  })
  listar()
}
```
Na linha da tabela: `{admin && <td><button onClick={() => editar(item)}>Editar</button></td>}`.

### Listar so os do usuario (rota /meus)
No `listar()`, troque a chamada por um fetch na rota nova:
```jsx
const token = await getAccessTokenSilently()
const r = await fetch(`${API}/meus`, { headers: { Authorization: `Bearer ${token}` } })
setItens(await r.json())
```

### Mostrar um campo calculado
Na celula da tabela: `<td>{item.nota >= 7 ? 'Aprovado' : 'Reprovado'}</td>`.

### Role nova (ex: GERENTE)
`const gerente = roles.includes('GERENTE')` e use `{gerente && (...)}`. A role em si e criada no Auth0 e atribuida ao usuario.

## Erros comuns

| Sintoma | Causa |
|---|---|
| `callback URL mismatch` no login | a URL do site nao esta nos 3 campos da aplicacao PF no Auth0 |
| `not authorized to access resource server` | PF sem acesso a `pf-api` (Applications, PF, API Access, Edit na pf-api) |
| Erro 401 na tabela | back com issuer errado, ou token expirado: saia e entre de novo |
| Erro 403 | usuario sem a role no Auth0, ou Action fora do fluxo (Triggers, post-login, Apply) |
| Erro 502 | back da AWS fora do ar: `bash run.sh check` na pasta do back |
| Formulario nao aparece | usuario sem role ADMIN, ou Action nao aplicada |
| Tela em branco | F12, aba Console: o erro aparece em vermelho |

## Se o IP da AWS mudar
Troque em `vercel.json` e `vite.config.js`, e no back o secret `HOST` do GitHub e o `HOST` do `run.sh`.
