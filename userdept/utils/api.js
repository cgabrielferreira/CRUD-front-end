const API_URL = "http://localhost:8080";

function getDepartamentos() {
  return fetch(`${API_URL}/departamentos`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Erro ao carregar departamentos:", error);
    });
}

function cadastrarUsuario(usuario) {
  return fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usuario),
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error("Erro ao cadastrar usuário:", error);
    });
}
