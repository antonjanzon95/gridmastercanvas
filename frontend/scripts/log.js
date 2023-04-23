import { socket } from "../main";

export function initLog(color) {
  if (sessionStorage.getItem("user")) {
    console.log("logged in");
    renderLogoutButton(color);
  } else {
    socket.off("addColor");
    socket.off("removeColor");
    socket.off("saveUser");

    console.log("not logged in");
    renderLogForm();
  }

  socket.off("updateColors");

  socket.on("updateColors", (arg) => {
    for (let i = 0; i < arg.length; i++) {
      console.log(arg[i]);
    }
  });
}

function renderLogForm() {
  let header = document.querySelector("header");
  let logForm = document.createElement("div");

  let logInput = document.createElement("input");
  let logUserButton = document.createElement("button");

  logInput.type = "text";
  logInput.placeholder = "name";
  logUserButton.innerHTML = "log in";

  header.appendChild(logForm);
  logForm.append(logInput, logUserButton);

  logUserButton.addEventListener("click", (e) => {
    e.preventDefault();

    if (logInput.value === "") {
      return;
    }

    sessionStorage.setItem("user", logInput.value);

    socket.emit("saveUser", sessionStorage.getItem("user"));

    socket.on("saveUser", (arg) => {
      let user = arg.user;

      console.log(`${user.userName} has logged in`);
      addColor(user.userColor);

      initLog(user.userColor);
    });

    logInput.value = "";
    logForm.innerHTML = "";
  });
}

function renderLogoutButton(color) {
  let header = document.querySelector("header");
  let logForm = document.createElement("div");
  let logOutButton = document.createElement("button");

  logOutButton.innerHTML = "log out";
  header.appendChild(logForm);
  logForm.appendChild(logOutButton);

  logOutButton.addEventListener("click", () => {
    sessionStorage.removeItem("user");

    removeColor(color);

    initLog();
    logForm.innerHTML = "";
  });
}

function addColor(color) {
  socket.emit("addColor", color);
}

function removeColor(color) {
  socket.emit("removeColor", color);
}
