const baseURL = "http://localhost:3000/burgers";
const msgAlert = document.querySelector(".msg-alert");

async function findAllBurgers() {
  const response = await fetch(`${baseURL}/all-burgers`);

  const burgers = await response.json();

  burgers.forEach(function (burger) {
    document.querySelector("#burgerList").insertAdjacentHTML(
      "beforeend",
      `
    <div class="burger-list-item" id="burger-list-item-${burger._id}">
        <div>
            <div class="burger-list-item-nome">${burger.nome}</div>
            <div class="burger-list-item-preco">R$ ${burger.preco}</div>
            <div class="burger-list-item-descricao">${burger.descricao}</div>

            <div class="actions">
              <button class="actions-edit btn" onclick="showModal('${burger._id}')">Editar</button> 
              <button class="actions-delete btn" onclick="showModalDelete('${burger._id}')">Apagar</button> 
            </div>
        </div>
        
        <img class="burger-list-item-foto" src="${burger.foto}" alt="${burger.nome}" />

        
    </div>
    `
    );
  });
}

findAllBurgers();

async function findByIdBurgers() {
  const id = document.querySelector("#search-input ").value;

  if (id == "") {
    localStorage.setItem("message", "Digite um ID para pesquisar!");
    localStorage.setItem("type", "danger");

    closeMessageAlert();
    return;
  }

  const response = await fetch(`${baseURL}/one-burger/${id}`);
  const burger = await response.json();

  if (burger.message != undefined) {
    localStorage.setItem("message", burger.message);
    localStorage.setItem("type", "danger");
    showMessageAlert();
    return;
  }

  document.querySelector(".list-all").style.display = "block"
  document.querySelector(".burger-list").style.display = "none";
  const chosenBurgerDiv = document.querySelector("#chosen-burger");

  chosenBurgerDiv.innerHTML = `
  <div class="burger-card-item" id="burger-card-item-${burger._id}">
  <div>
      <div class="burger-card-item-nome">${burger.nome}</div>
      <div class="burger-card-item-preco">R$ ${burger.preco}</div>
      <div class="burger-card-item-descricao">${burger.descricao}</div>
      
      <div class="actions">
          <button class="actions-edit btn" onclick="showModal('${burger._id}')">Editar</button> 
          <button class="actions-delete btn" onclick="showModalDelete('${burger._id}')">Apagar</button> 
      </div>
  </div>
  <img class="burger-card-item-foto" src="${burger.foto}" alt="${burger.nome}" />
</div>`;
}

async function showModal(id = "") {
  if (id != "") {
    document.querySelector("#title-header-modal").innerText =
      "Atualizar um Burger";
    document.querySelector("#button-form-modal").innerText = "Atualizar";

    const response = await fetch(`${baseURL}/one-burger/${id}`);
    const burger = await response.json();

    document.querySelector("#nome").value = burger.nome;
    document.querySelector("#preco").value = burger.preco;
    document.querySelector("#descricao").value = burger.descricao;
    document.querySelector("#foto").value = burger.foto;
    document.querySelector("#id").value = burger._id;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar um Burger";
    document.querySelector("#button-form-modal").innerText = "Cadastrar";
  }

  document.querySelector("#overlay").style.display = "flex";
}

function closeModal() {
  document.querySelector(".modal-overlay").style.display = "none";
  document.querySelector("#nome").value = "";
  document.querySelector("#preco").value = 0;
  document.querySelector("#descricao").value = "";
  document.querySelector("#foto").value = "";
  document.location.reload(true);
}

async function submitBurger() {
  const id = document.querySelector("#id").value;
  const nome = document.querySelector("#nome").value;
  const preco = document.querySelector("#preco").value;
  const descricao = document.querySelector("#descricao").value;
  const foto = document.querySelector("#foto").value;

  const burger = {
    id,
    nome,
    preco,
    descricao,
    foto,
  };

  const modoEdicaoAtivado = id != "";

  const endpoint =
    baseURL + (modoEdicaoAtivado ? `/update-burger/${id}` : `/create-burger`);

  const response = await fetch(endpoint, {
    method: modoEdicaoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(burger),
  });

  const novoBurger = await response.json();

  if (novoBurger.message != undefined) {
    localStorage.setItem("message", novoBurger.message);
    localStorage.setItem("type", "danger");
    showMessageAlert();
    return;
  }

  if (modoEdicaoAtivado) {
    localStorage.setItem("message", "Burger atualizado com sucesso");
    localStorage.setItem("type", "success");
  } else {
    localStorage.setItem("message", "Burger criado com sucesso");
    localStorage.setItem("type", "success");
  }
  closeModal();
}

function showModalDelete(id) {
  document.querySelector("#overlay-delete").style.display = "flex";

  const btnSim = document.querySelector(".btn-delete-yes");

  btnSim.addEventListener("click", function () {
    deleteBurger(id);
  });
}

function closeModalDelete() {
  document.querySelector("#overlay-delete").style.display = "none";
}

async function deleteBurger(id) {
  const response = await fetch(`${baseURL}/delete-burger/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  const result = await response.json();

  localStorage.setItem("message", result.message);
  localStorage.setItem("type", "success");

  document.location.reload(true);

  closeModalDelete();
}

function closeMessageAlert() {
  setTimeout(function () {
    msgAlert.innerText = "";
    msgAlert.classList.remove(localStorage.getItem("type"));
    localStorage.clear();
  }, 3000);
}

function showMessageAlert() {
  msgAlert.innerText = localStorage.getItem("message");
  msgAlert.classList.add(localStorage.getItem("type"));
  closeMessageAlert();
}

showMessageAlert();
