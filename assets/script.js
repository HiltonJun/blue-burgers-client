const baseURL = "http://localhost:3000/burger";

async function findAllBurgers() {
  const response = await fetch(`${baseURL}/todos-burgers`);

  const burgers = await response.json();

  burgers.forEach(function (burger) {
    document.querySelector("#burgerList").insertAdjacentHTML(
      "beforeend",
      `
    <div class="BurgerListaItem" id="BurgerListaItem_${burger.id}">
        <div>
            <div class="BurgerListaIt__nome">${burger.nome}</div>
            <div class="BurgerListaItem__descricao">${burger.descricao}</div>
            <div class="BurgerListaItem__botton">
              <div class="BurgerListaItem__preco">R$ ${burger.preco}</div>
              <div class="BurgerListaItem__acoes Acoes">
                <button class="Acoes__editar btn" onclick="abrirModal(${
                  burger.id
                })"><img src="assets/icons/pencil.png" / width="20px"></button> 
                <button class="Acoes__apagar btn" onclick="abrirModalDelete(${
                  burger.id
                })"><img src="assets/icons/trash.png" / width="20px"></button> 
              </div>
            </div>
        </div>
        
        <img class="BurgerListaItem__foto" src="${burger.foto}" alt="${
        burger.nome
      }" />

        
    </div>
    `
    );
  });
}

async function findByIdBurgers() {
  const id = document.querySelector("#idBurger").value;

  const response = await fetch(`${baseURL}/burger/${id}`);
  const burger = await response.json();

  const burgerEscolhidoDiv = document.querySelector("#burgerEscolhido");

  burgerEscolhidoDiv.innerHTML = `
  <div class="BurgerCardItem" id="BurgerListaItem_${burger.id}">
  <div>
      <div class="BurgerCardItem__nome">${burger.nome}</div>
      <div class="BurgerCardItem__descricao">${burger.descricao}</div>
      <div class="BurgerListaItem__botton">
      <div class="BurgerListaItem__preco">R$ ${burger.preco}</div>
      <div class="BurgerListaItem__acoes Acoes">
        <button class="Acoes__editar btn" onclick="abrirModal(${
          burger.id
        })"><img src="assets/icons/pencil.png" / width="20px"></button> 
        <button class="Acoes__apagar btn" onclick="abrirModalDelete(${
          burger.id
        })"><img src="assets/icons/trash.png" / width="20px"></button> 
      </div>
    </div>
  </div>
  <img class="BurgerCardItem__foto" src="${burger.foto}" alt="${burger.nome}" />
</div>`;
}

findAllBurgers();

async function abrirModal(id = null) {
  if (id != null) {
    document.querySelector("#title-header-modal").innerText =
      "Atualizar uma Burger";
    document.querySelector("#button-form-modal").innerText = "Atualizar";

    const response = await fetch(`${baseURL}/burger/${id}`);
    const burger = await response.json();

    document.querySelector("#nome").value = burger.nome;
    document.querySelector("#preco").value = burger.preco;
    document.querySelector("#descricao").value = burger.descricao;
    document.querySelector("#foto").value = burger.foto;
    document.querySelector("#id").value = burger.id;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar uma Burger";
    document.querySelector("#button-form-modal").innerText = "Cadastrar";
  }

  document.querySelector("#overlay").style.display = "flex";
}

function fecharModal() {
  document.querySelector(".modal-overlay").style.display = "none";

  document.querySelector("#nome").value = "";
  document.querySelector("#preco").value = 0;
  document.querySelector("#descricao").value = "";
  document.querySelector("#foto").value = "";
}

async function createBurger() {
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

  const modoEdicaoAtivado = id > 0;

  const endpoint = baseURL + (modoEdicaoAtivado ? `/update/${id}` : `/create`);

  const response = await fetch(endpoint, {
    method: modoEdicaoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(burger),
  });

  const novoBurger = await response.json();

  const html = `
  <div class="BurgerListaItem" id="BurgerListaItem_${novoBurger.id}">
    <div>
        <div class="BurgerListaItem__nome">${novoBurger.nome}</div>
        <div class="BurgerListaItem__descricao">${novoBurger.descricao}</div>
        <div class="BurgerListaItem__botton">
        <div class="BurgerListaItem__preco">R$ ${novoBurger.preco}</div>
        <div class="BurgerListaItem__acoes Acoes">
          <button class="Acoes__editar btn" onclick="abrirModal(${
            novoBurger.id
          })"><img src="assets/icons/pencil.png" / width="20px"></button> 
          <button class="Acoes__apagar btn" onclick="abrirModalDelete(${
            novoBurger.id
          })"><img src="assets/icons/trash.png" / width="20px"></button> 
        </div>
    </div>
    <img class="BurgerListaItem__foto" src="${
      novoBurger.foto
    }" alt="Burger de ${novoBurger.nome}" />
  </div>`;

  if (modoEdicaoAtivado) {
    document.querySelector(`#BurgerListaItem_${id}`).outerHTML = html;
  } else {
    document.querySelector("#burgerList").insertAdjacentHTML("beforeend", html);
  }

  fecharModal();
  location.reload();
}

function abrirModalDelete(id) {
  console.log(id);
  document.querySelector("#overlay-delete").style.display = "flex";

  const btnSim = document.querySelector(".btn_delete_yes");

  btnSim.addEventListener("click", function () {
    deleteBurger(id);
    alert("Burger deletado com sucesso!")
    location.reload();
  });
}

function fecharModalDelete() {
  document.querySelector("#overlay-delete").style.display = "none";
}

async function deleteBurger(id) {
  const response = await fetch(`${baseURL}/delete/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  const result = await response.json();
  alert(result.message);

  document.getElementById("burgerList").innerHTML = "";

  fecharModalDelete();
  findAllBurgers();
}
