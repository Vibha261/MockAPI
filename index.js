let apiData = [];

const container = document.createElement("div");
container.id = "data-container";
container.className = "container";
document.body.appendChild(container);

const addDataBtn = document.createElement("button");
addDataBtn.id = "add-data-btn";
addDataBtn.className = "btn";
addDataBtn.innerText = "Add User";
addDataBtn.addEventListener("click", openAddModal);
document.body.appendChild(addDataBtn);

//Populate page with data from API
async function renderData() {
  await getData();
  container.innerHTML = "";
  apiData.forEach((record) => {
    const card = document.createElement("div");
    card.className = "data-card";

    const userInfoContainer = document.createElement("div");
    userInfoContainer.className = "user-info-container";

    const userImgContainer = document.createElement("div");
    userImgContainer.className = "user-image-container";
    
    const userImg = document.createElement("img");
    userImg.className = "user-image";
    userImg.src = record.avatar;
    userImg.alt = "user image"

    const nameElement = document.createElement("span");
    nameElement.innerText = record.name;

    const btnContainer = document.createElement("div");
    btnContainer.className = "btn-container";


    const editBtn = createButton("Edit", () => openEditModal(record.id));
    const deleteBtn = createButton("Delete", () => openDeleteModal(record.id));

    userImgContainer.appendChild(userImg);
    userInfoContainer.appendChild(userImgContainer);
    userInfoContainer.appendChild(nameElement);
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);
    card.appendChild(userInfoContainer);
    card.appendChild(btnContainer);

    container.appendChild(card);
  });
}

function createButton(text, clickHandler) {
  const button = document.createElement("button");
  if (text === "Delete" || text === "Confirm")
    button.className = "btn delete-btn";
  else button.className = "btn edit-btn";
  button.innerText = text;
  button.addEventListener("click", clickHandler);
  return button;
}

//Fetch data from mockAPI
async function getData() {
  const res = await fetch(`https://65a8c973219bfa371867935c.mockapi.io/data`);
  const data = await res.json();
  apiData = data;
}

//Edit Functionality
async function handleEdit(recordId, editedName) {
  if (editedName === "") {
    alert("Field(s) cannot be empty!");
    closeModal();
    return;
  }
  try {
    const res = await fetch(
      `https://65a8c973219bfa371867935c.mockapi.io/data/${recordId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editedName }),
      }
    );
    if (res.ok) {
      closeModal();
      await renderData();
    }
  } catch (err) {
    closeModal();
    alert("Something went wrong");
    console.log(err);
  }
}

//Edit Modal
function openEditModal(recordId) {
  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const btnContainer = document.createElement("div");
  btnContainer.className = "modal-btn-container";

  const message = document.createElement("p");
  message.innerText = "Edit details ";
  message.className = "messageDiv";

  const inputFields = document.createElement("div");
  const label = document.createElement("span");
  label.innerText = "Name: ";
  const nameInput = document.createElement("input");
  nameInput.type = "text";

  inputFields.appendChild(label);
  inputFields.appendChild(nameInput);

  const confirmBtn = createButton("Confirm", () =>
    handleEdit(recordId, nameInput.value.trim())
  );
  const cancelBtn = createButton("Cancel", closeModal);

  modalContent.appendChild(message);
  modalContent.appendChild(inputFields);
  btnContainer.appendChild(confirmBtn);
  btnContainer.appendChild(cancelBtn);
  modal.appendChild(modalContent);
  modalContent.appendChild(btnContainer);

  document.body.appendChild(modal);
}

//Delete Functionality
async function handleDelete(recordId) {
  const res = await fetch(
    `https://65a8c973219bfa371867935c.mockapi.io/data/${recordId}`,
    {
      method: "DELETE",
    }
  );
  if (res.ok) {
    closeModal();
    await renderData();
  }
}

// Delete Modal
function openDeleteModal(recordId) {
  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const btnContainer = document.createElement("div");
  btnContainer.className = "modal-btn-container";

  const message = document.createElement("p");
  message.innerText = "Are you sure you want to delete this record?";

  const confirmBtn = createButton("Confirm", () => handleDelete(recordId));
  const cancelBtn = createButton("Cancel", closeModal);

  modalContent.appendChild(message);
  btnContainer.appendChild(confirmBtn);
  btnContainer.appendChild(cancelBtn);
  modal.appendChild(modalContent);
  modalContent.appendChild(btnContainer);

  document.body.appendChild(modal);
}

// Add Functionality
async function handleAdd(name) {
  if (name === "") {
    alert("Field(s) cannot be empty!");
    closeModal();
    return;
  }
  try {
    const res = await fetch(`https://65a8c973219bfa371867935c.mockapi.io/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name }),
    });
    if (res.ok) {
      closeModal();
      await renderData();
    }
  } catch (err) {
    closeModal();
    alert("Something went wrong!");
    console.log(err);
  }
}

//Add Modal
function openAddModal() {
  const modal = document.createElement("div");
  modal.className = "modal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const btnContainer = document.createElement("div");
  btnContainer.className = "modal-btn-container";

  const message = document.createElement("p");
  message.innerText = "Add details";

  const inputFields = document.createElement("div");
  const label = document.createElement("span");
  label.innerText = "Name: ";
  const nameInput = document.createElement("input");
  nameInput.type = "text";

  inputFields.appendChild(label);
  inputFields.appendChild(nameInput);

  const confirmBtn = createButton("Confirm", () =>
    handleAdd(nameInput.value.trim())
  );
  const cancelBtn = createButton("Cancel", closeModal);

  modalContent.appendChild(message);
  modalContent.appendChild(inputFields);
  btnContainer.appendChild(confirmBtn);
  btnContainer.appendChild(cancelBtn);
  modal.appendChild(modalContent);
  modalContent.appendChild(btnContainer);

  document.body.appendChild(modal);
}

//Close Modal
function closeModal() {
  const modal = document.querySelector(".modal");
  if (modal) {
    modal.remove();
  }
}

// Initial rendering of data
renderData();
