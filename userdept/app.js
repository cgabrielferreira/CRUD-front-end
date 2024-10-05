document.getElementById("add-user-form").addEventListener("submit", addUser);

async function addUser(event) {
  event.preventDefault();

  const nome = document.getElementById("Nome").value;
  const email = document.getElementById("Email").value;
  const departamentoId = document.getElementById("Departamento").value;

  const user = {
    nome,
    email,
    departamento: { id: departamentoId },
  };

  try {
    const response = await fetch("http://localhost:8080/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      const newUser = await response.json();
      console.log("Usuário adicionado:", newUser);
      fetchUsers();
      event.target.reset();
    } else {
      console.error("Erro ao adicionar usuário:", response.statusText);
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:8080/users");
    if (response.ok) {
      const users = await response.json();
      displayUsers(users);
    } else {
      console.error("Erro ao buscar usuários:", response.statusText);
    }
  } catch (error) {
    console.error("Erro:", error);
  }
}

function displayUsers(users) {
  const tbody = document.querySelector("#user-table tbody");
  tbody.innerHTML = "";

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>${user.departamento.nome}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-button" onclick="editUser(${user.id})">
                        <img src="https://img.icons8.com/ios-filled/24/000000/edit.png" alt="Edit" />
                    </button>
                    <button class="delete-button" onclick="deleteUser(${user.id})">
                        <img src="https://img.icons8.com/ios-filled/24/000000/trash.png" alt="Delete" />
                    </button>
                </div>
            </td>
        `;
    tbody.appendChild(row);
  });
}

async function deleteUser(userId) {
  if (confirm("Tem certeza que deseja excluir este usuário?")) {
    try {
      const response = await fetch(`http://localhost:8080/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Usuário excluído com sucesso.");
        fetchUsers();
      } else {
        console.error("Erro ao excluir usuário:", response.statusText);
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  }
}

async function editUser(userId) {
  try {
    const response = await fetch(`http://localhost:8080/users/${userId}`);
    if (!response.ok) {
      console.error(
        `Erro ao buscar usuário com ID ${userId}: ${response.status} - ${response.statusText}`
      );
      throw new Error("Erro ao buscar usuário");
    }

    const user = await response.json();
    document.getElementById("Nome").value = user.nome;
    document.getElementById("Email").value = user.email;
    document.getElementById("Departamento").value = user.departamento.id;

    const form = document.getElementById("add-user-form");
    form.removeEventListener("submit", addUser);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const updatedUser = {
        nome: document.getElementById("Nome").value,
        email: document.getElementById("Email").value,
        departamento: { id: document.getElementById("Departamento").value },
      };

      try {
        const updateResponse = await fetch(
          `http://localhost:8080/users/${userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
          }
        );

        if (updateResponse.ok) {
          console.log("Usuário atualizado com sucesso.");
          fetchUsers();
          form.reset();
        } else {
          console.error(
            `Erro ao atualizar usuário: ${updateResponse.status} - ${updateResponse.statusText}`
          );
        }
      } catch (error) {
        console.error("Erro ao enviar a atualização:", error);
      }
    });

    const submitButton = document.getElementById("submit-button");
    submitButton.textContent = "Atualizar Usuário";
  } catch (error) {
    console.error("Erro:", error);
  }
}

fetchUsers();
