import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { API, CLAIM_ROLES } from "./config.js";

// Campos do formulario de cadastro. Na prova, troque aqui e na tabela la embaixo.
const VAZIO = {
  emailAvaliado: "",
  nota: "",
  comentarios: "",
  titulo: "",
  prioridade: "",
};

export default function App() {
  const {
    isLoading,
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  const [itens, setItens] = useState([]);
  const [form, setForm] = useState(VAZIO);
  const [erro, setErro] = useState("");

  const roles = user?.[CLAIM_ROLES] ?? [];
  const admin = roles.includes("ADMIN");

  // Toda chamada ao back passa por aqui, ja com o token do Auth0
  async function chamar(opcoes = {}) {
    const token = await getAccessTokenSilently();
    const resposta = await fetch(API, {
      ...opcoes,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!resposta.ok) throw new Error(`Erro ${resposta.status}`);
    return resposta.json();
  }

  async function listar() {
    try {
      setItens(await chamar());
      setErro("");
    } catch (e) {
      setErro(e.message);
    }
  }

  async function cadastrar(evento) {
    evento.preventDefault();
    try {
      await chamar({ method: "POST", body: JSON.stringify(form) });
      setForm(VAZIO);
      listar();
    } catch (e) {
      setErro(e.message);
    }
  }

  useEffect(() => {
    if (isAuthenticated) listar();
  }, [isAuthenticated]);

  if (isLoading) return <p>Carregando...</p>;
  if (!isAuthenticated)
    return <button onClick={() => loginWithRedirect()}>Entrar</button>;

  return (
    <main>
      <header>
        <span>
          {user.email} ({roles.join(", ") || "sem role"})
        </span>
        <button
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
        >
          Sair
        </button>
      </header>

      {erro && <p className="erro">{erro}</p>}

      {admin && (
        <form onSubmit={cadastrar}>
          <h2>Nova avaliação</h2>
          <input
            type="email"
            placeholder="Email do avaliado"
            required
            value={form.emailAvaliado}
            onChange={(e) =>
              setForm({ ...form, emailAvaliado: e.target.value })
            }
          />

          <textarea
            placeholder="Descrição"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          />
          <input
            type="text"
            placeholder="Título"
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          />
          <input
            type="text"
            placeholder="Prioridade"
            value={form.prioridade}
            onChange={(e) => setForm({ ...form, prioridade: e.target.value })}
          />
          <button>Cadastrar</button>
        </form>
      )}

      <h2>Avaliações</h2>
      <table>
        <thead>
          <tr>
            <th>Avaliador</th>
            <th>Avaliado</th>
            <th>Título</th>
            <th>Prioridade</th>
            <th>Descrição</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => (
            <tr key={item.id}>
              <td>{item.emailAvaliador}</td>
              <td>{item.emailAvaliado}</td>
              <td>{item.titulo}</td>
              <td>{item.prioridade}</td>
              <td>{item.descricao}</td>
              <td>{new Date(item.dataAvaliacao).toLocaleString("pt-BR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
