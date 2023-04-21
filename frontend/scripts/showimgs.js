export async function fetchImages() {
  const response = await fetch("http://localhost:3000/image");
  const data = await response.json();
  return data;
}

export async function fetchImageById(id) {
  const response = await fetch("http://localhost:3000/image/" + id);
  const data = await response.json();
  console.log(data);
  return data;
}

export function renderImages(images) {
  const sideBarContainer = document.querySelector(".div4");
  sideBarContainer.innerHTML = "";

  images.forEach((image) => {
    let counter = 0;
    const imageContainer = document.createElement("div");
    imageContainer.classList.add("canvas-grid-mini");
    imageContainer.id = image._id;

    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        const imgCell = document.createElement("div");
        imgCell.classList.add("view-cell");
        imgCell.style.backgroundColor = image.image[counter].color;
        imageContainer.appendChild(imgCell);
        counter++;
      }
    }
    imageContainer.addEventListener("click", renderImage);

    sideBarContainer.appendChild(imageContainer);
  });
}

export async function renderImage(event) {
  const id = event.target.id;
  const image = await fetchImageById(id);

  const modalPopupContainer = document.createElement("div");
  modalPopupContainer.classList.add("modal-container");
  const modalPopup = document.createElement("div");
  modalPopup.classList.add("modal");

  const credit = document.createElement("h1");
  credit.classList.add("credit");
  credit.innerHTML = `Made by: ${image.users.map((user) => " " + user.name)}`;

  //button
  const closeWindow = document.createElement("button");
  closeWindow.classList.add("close-modal");
  closeWindow.innerHTML = "X";
  closeWindow.addEventListener("click", () => {
    document.body.removeChild(modalPopupContainer);
  });

  modalPopup.appendChild(closeWindow);
  modalPopupContainer.append(modalPopup, credit);

  const gridContainer = document.createElement("div");
  gridContainer.classList.add("canvas-grid", "rounded");

  let counter = 0;
  for (let i = 0; i < 15; i++) {
    for (let j = 0; j < 15; j++) {
      const gridNode = document.createElement("div");
      gridNode.classList.add("display-cell");
      gridNode.style.backgroundColor = image.image[counter].color;
      console.log(image.image[counter].color);
      gridContainer.appendChild(gridNode);
      counter++;
    }
  }

  modalPopup.appendChild(gridContainer);
  document.body.appendChild(modalPopupContainer);
}
