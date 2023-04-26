import { removeSockets, socket } from "../main";
import { renderChatHtml } from "./chatcomp";
import { renderRoomsSection } from "./gameRooms";
import { showHighScorePage } from "./gameover";
import { viewSavedImages } from "./saveImg";
import { renderStartPage } from "./startPage";

export function initLog() {
  renderStartPage();
  renderLogo();
  if (sessionStorage.getItem("user")) {
    console.log("logged in");
    renderChatHtml();
    renderRoomsSection();
    renderSiteNav();
    renderLogoutButton();
  } else {
    socket.off("saveUser");
    console.log("not logged in");
    renderWelcome();
    renderLogForm();
  }
}

function renderWelcome() {
  let div = document.createElement("div");
  let header = document.querySelector("header");

  div.innerHTML =
    "Välkommen till gridmaster Canvas, logga in för att börja måla";

  header.append(div);
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

    let user = { name: logInput.value, color: "", id: "" };

    sessionStorage.setItem("user", JSON.stringify(user));

    socket.emit("saveUser", JSON.parse(sessionStorage.getItem("user")));

    header.innerHTML = "";
    logInput.value = "";
    logForm.innerHTML = "";
    initLog();
  });

  socket.on("userLoggedIn", (data) => {
    console.log(data);
    const user = data.user;
    sessionStorage.setItem("globalMessages", JSON.stringify([]));
    sessionStorage.setItem("user", JSON.stringify(user));

    console.log(`${user.name} has logged in with color ${user.color}`);
    const color = user.color;
    console.log(color);
    sessionStorage.setItem("color", color);
  });
}

function renderLogo() {
  let header = document.querySelector("#header");
  let div = document.createElement("div");
  let logo = document.createElement("img");

  logo.setAttribute("src", "/gridmastercanvas_logo.png");
  logo.setAttribute("alt", "Grid Master Canvas Logo");
  logo.setAttribute("width", "400");

  header.appendChild(div);
  div.appendChild(logo);
}

function renderSiteNav() {
  let isHighScoreVisible = false;
  let isImagesVisibile = false;
  let isRoomsVisible = false;
  let isHowToPlayVisible = false;

  let header = document.querySelector("header");
  let main = document.querySelector("main");
  let navContainer = document.createElement("div");

  navContainer.classList.add("navContainer");

  let navPlay = document.createElement("button");
  let navImg = document.createElement("button");
  let navHow = document.createElement("button");
  let navScore = document.createElement("button");

  navPlay.innerHTML = "Play";
  navImg.innerHTML = "Saved images";
  navHow.innerHTML = "How to play";
  navScore.innerHTML = "Highscores";

  header.appendChild(navContainer);
  navContainer.append(navPlay, navImg, navHow, navScore);

  navPlay.addEventListener("click", () => {
    if (isRoomsVisible) {
      header.innerHTML = "";
      initLog();
    } else {
      renderRoomsSection();
    }
    isRoomsVisible = !isRoomsVisible;
  });

  navImg.addEventListener("click", () => {
    if (isImagesVisibile) {
      header.innerHTML = "";
      initLog();
    } else {
      main.innerHTML = "";
      viewSavedImages();
    }
    isImagesVisibile = !isImagesVisibile;
  });

  navHow.addEventListener("click", () => {
    if (isHowToPlayVisible) {
      header.innerHTML = "";
      initLog();
    } else {
      renderHowToPlay();
    }
    isHowToPlayVisible = !isHowToPlayVisible;
  });

  navScore.addEventListener("click", () => {
    if (isHighScoreVisible) {
      header.innerHTML = "";
      initLog();
    } else {
      showHighScorePage();
    }
    isHighScoreVisible = !isHighScoreVisible;
  });
}

function renderHowToPlay() {
  let main = document.querySelector("main");

  let div = document.createElement("div");
  div.setAttribute("class", "howToContainer");

  main.innerHTML = "";

  div.innerHTML = `
  <div class="howToPlayDiv">
  <h4>Here's a quick guide on how to play GridMaster Canvas:</h4>
    <p>Step 1: <span>Log in</span> - Create an account or log in to your existing account on <span>GridMaster Canvas</span> to get started.</p>
    <p>Step 2: <span>Chat</span> - Join the vibrant community of pixel art enthusiasts and engage in chat discussions. Share your ideas, techniques, and inspirations, and connect with like-minded artists from around the world.</p>
    <p>Step 3: <span>Create GameRooms</span> - Set up your own GameRoom or join an existing one. GameRooms are where the pixel art magic happens! Collaborate with others or compete against them in friendly challenges.</p>
    <p>Step 4: <span>Play alone or with others</span> - Choose to play alone or team up with other players in a GameRoom. Work together to create pixel art masterpieces or challenge yourself to replicate images on your own.</p>
    <p>Step 5: <span>Paint and Remove Pixels</span> - Click on a pixel to paint it with the color of your choice. Click again to remove it if you need to make changes. Use your creativity and skills to bring your pixel art to life on the canvas.</p>
    <p>Step 6: <span>Replicate the Image</span> - Once you're ready, take on the challenge of replicating a given image within a limited timeframe. Put your pixel art skills to the test and strive to achieve the highest score on the leaderboard.</p>
    <p>Step 7: <span>Compete for Glory</span> - Compete against other players and aim for the top spot on the leaderboard. Earn bragging rights, showcase your pixel art prowess, and revel in the glory of your achievements.<p><br><br>
  
  <p>Get ready to unleash your pixel powers, express your creativity, and immerse yourself in the world of pixel art and metal mayhem on <span>GridMaster Canvas<span>.</p><br>
  <h5>Let the competition begin!</h5>
  </div>

  `;

  main.appendChild(div);
}

function renderLogoutButton() {
  let chatDiv = document.querySelector("#chat-div");
  let mainContainer = document.querySelector("main");
  let header = document.querySelector("header");
  let logForm = document.createElement("div");
  let logOutButton = document.createElement("button");

  logOutButton.innerHTML = "log out";
  header.appendChild(logForm);
  logForm.appendChild(logOutButton);

  logOutButton.addEventListener("click", () => {
    // let user = JSON.parse(sessionStorage.getItem('user'));
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("color");
    sessionStorage.removeItem("globalMessages");

    mainContainer.innerHTML = "";

    chatDiv.innerHTML = "";
    header.innerHTML = "";
    removeSockets();
    initLog();
  });
}
