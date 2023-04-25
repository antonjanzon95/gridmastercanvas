

export function renderStartPage() {
    let main = document.querySelector("main");

    let div = document.createElement("div");
    div.setAttribute('class', 'startContainer')
  
    main.innerHTML = "";
  
    div.innerHTML = `
    <div class="startDiv">
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