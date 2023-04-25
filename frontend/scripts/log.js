import { removeSockets, socket } from "../main";
import { renderChatHtml } from "./chatcomp";
import { renderRoomsSection } from "./gameRooms";
import { showHighScorePage } from "./gameover";
import { viewSavedImages } from "./saveImg";

export function initLog() {
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
  div.setAttribute('class', 'howToContainer')

  main.innerHTML = "";

  div.innerHTML = `
  <div class="howToPlayDiv">
    <h4>Welcome to GridMaster Canvas,</h4>
    <p>where you can unleash your pixel powers and dive into a world of pixel art and metal mayhem!</p>
    <p>As you log in to our app, get ready to embark on an exhilarating journey of creativity, competition, and camaraderie.</p>
    <p>With <span>GridMaster Canvas</span>, you have the freedom to chat with like-minded pixel art enthusiasts from around the world.<br> Share your ideas, techniques, and inspirations, and learn from a diverse community of artists who share your passion for all things pixelated. Whether you're a seasoned pixel art pro or just starting out, GridMaster Canvas is a place where artists of all levels can come together to celebrate their love for this unique art form.</p>
    <p>But that's not all - <span>GridMaster Canvas</span> is not just about chatting, it's also about putting your skills to the test.</p>
    <p>Challenge yourself with our exciting "Replicate the Image" competition, where you'll be given a pixel art masterpiece to replicate within a limited timeframe. Compete against the clock, and show off your pixel art prowess as you strive for the top spot on the leaderboard.</p><br>

    <p>Immerse yourself in a visually stunning world of pink clouds, pixel art, and a death metal logo that sets the stage for an epic experience like no other.</p>
    <p>So join us now, and let GridMaster Canvas be your canvas to create, compete, and connect with fellow pixel artists from around the globe. Unleash your pixel powers with</p>
    <p><span>GridMaster Canvas - Where Pixel Art Meets Metal Mayhem!</span></p>
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
