console.log("JavaScript loaded!");

const sounds = {
  open: new Audio("https://files.catbox.moe/ko0toy.mp3"),
  yes: new Audio("https://files.catbox.moe/09oh2e.mp3"),
  hover: new Audio("https://files.catbox.moe/rudqvb.mp3"), // ✅ ADD THIS
};

// ✅ Background love song (starts after YES, loops)
const bgSong = new Audio("https://files.catbox.moe/4eojz9.mp3");
bgSong.loop = true;
bgSong.volume = 0.5;

// ✅ Kahoot lobby music (starts when letter opens, loops)
const kahootSong = new Audio("https://files.catbox.moe/rudqvb.mp3");
kahootSong.loop = true;
kahootSong.volume = 0.4;

Object.values(sounds).forEach((sound) => {
  sound.volume = 0.3;
  sound.addEventListener("error", () => (sound.muted = true));
});
bgSong.addEventListener("error", () => (bgSong.muted = true));
kahootSong.addEventListener("error", () => (kahootSong.muted = true));

const startScreen = document.getElementById("startScreen");
const mainScreen = document.getElementById("mainScreen");
const envelope = document.getElementById("envelope");
const envelopeContainer = document.getElementById("envelopeContainer");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");

const mainCatImg = document.querySelector(".cat-main");
const originalCatSrc = mainCatImg ? mainCatImg.src : "";

const noHoverCatSrc =
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWhoMzhxcjlnNWs0cWN4YnllY2E3bWY4bzd4Yms0NmVtZ25pOXdtbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3T7WB64PW315Z8zhRg/giphy.gif";

const yesBgGif =
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWoyOTJ4cWhjb21nOTFpbG5hazZuMWxtd2w2dXUwbDZpMTc5ODV6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKoWXm3okO1kgHC/giphy.gif";

let yesSize = 1;
let noHoverCount = 0;
let permaAngry = false;
let bossBackgroundActivated = false;
let currentHeart = "💕";
let canPlayHoverSound = true; // ✅ ADD THIS

function createFloatingHeart() {
  const heart = document.createElement("div");
  heart.className = "heart-float";
  heart.textContent = currentHeart;
  heart.style.left = Math.random() * 100 + "%";
  heart.style.bottom = "0px";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 4000);
}

function setAllHearts(symbol) {
  document.querySelectorAll(".heart-float").forEach((h) => {
    h.textContent = symbol;
  });
}

setInterval(createFloatingHeart, 300);

envelopeContainer.addEventListener("click", () => {
  const unlock = new Audio("https://files.catbox.moe/rudqvb.mp3");
  unlock.volume = 0;
  unlock.play().catch(() => {});

  sounds.open.play().catch(() => {});
  envelope.classList.add("opening");

  setTimeout(() => {
    startScreen.style.display = "none";
    mainScreen.style.display = "flex";
    mainScreen.classList.remove("hidden");
    
    kahootSong.currentTime = 0;
    kahootSong.play().catch(() => {});
  }, 1000);
});

yesBtn.addEventListener("click", () => {
  sounds.yes.play().catch(() => {});

  kahootSong.pause();
  kahootSong.currentTime = 0;

  bgSong.currentTime = 0;
  bgSong.play().catch(() => {});

  bossBackgroundActivated = false;
  document.body.style.animation = "";
  document.body.style.background = "";
  document.body.style.backgroundImage = `url(${yesBgGif})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundColor = "rgba(255,255,255,0.15)";

  currentHeart = "💕";
  setAllHearts("💕");

  message.innerHTML = `
    <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGltbXg4eTc2YzU0bzJvMGJxM3Fva2lnejQ0NjdwYmJveTZreTcwMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/naAaDvbAoOYdW/giphy.gif" class="cat-happy" alt="happy cat">
    <div>Good boy...</div>
  `;
  message.classList.remove("hidden");
  document.querySelector(".buttons").style.display = "none";
  document.querySelector("h1").style.display = "none";
  document.querySelector(".cat-main").style.display = "none";

  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.background = ["#f093fb", "#f5576c", "#feca57", "#48dbfb"][
        Math.floor(Math.random() * 4)
      ];
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }, i * 20);
  }
});

noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  
  currentHeart = "💔";
  setAllHearts("💔");

  noHoverCount++;

  if (noHoverCount <= 2) {
    noBtn.textContent = "No ??";
  } else if (noHoverCount <= 4) {
    noBtn.textContent = "Are you sure?";
  } else if (noHoverCount <= 6) {
    noBtn.textContent = "Thomas.";
  } else if (noHoverCount <= 8) {
    noBtn.textContent = "Be serious.";
  } else {
    noBtn.textContent = "what the fuck";
  }

  if (noHoverCount >= 7) permaAngry = true;

  if (noHoverCount >= 10 && !bossBackgroundActivated) {
    bossBackgroundActivated = true;

    document.body.style.backgroundImage = `url(${noHoverCatSrc})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundColor = "rgba(0,0,0,0.35)";
  }

  if (mainCatImg) {
    if (permaAngry || noHoverCount >= 3) {
      mainCatImg.src = noHoverCatSrc;
    } else {
      mainCatImg.src = originalCatSrc;
    }
  }

  // ✅ FIXED - use shared sound with cooldown
  if (canPlayHoverSound) {
    sounds.hover.volume = Math.min(0.2 + noHoverCount * 0.1, 1);
    sounds.hover.currentTime = 0;
    sounds.hover.play().catch(() => {});
    
    canPlayHoverSound = false;
    setTimeout(() => canPlayHoverSound = true, 200);
  }

  yesSize += 0.15;
  yesBtn.style.transform = `scale(${yesSize})`;

  document.body.style.animation = "shake 0.3s";
  setTimeout(() => {
    document.body.style.animation = "";
  }, 300);

  const t = Math.min(noHoverCount / 8, 1);
  const r = Math.round(50 + 205 * t);
  const g = Math.round(60 * (1 - t));
  const b = Math.round(156 * (1 - t));
  if (!bossBackgroundActivated) {
    document.body.style.background = `rgb(${r}, ${g}, ${b})`;
  }

  noBtn.style.position = "fixed";

  const container = document.querySelector(".container");
  const containerRect = container.getBoundingClientRect();
  
  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;
  const padding = 20;

  const minX = containerRect.left + padding;
  const minY = containerRect.top + padding;
  const maxX = containerRect.right - btnWidth - padding;
  const maxY = containerRect.bottom - btnHeight - padding;

  const newX = minX + Math.random() * (maxX - minX);
  const newY = minY + Math.random() * (maxY - minY);

  noBtn.style.left = newX + "px";
  noBtn.style.top = newY + "px";
  noBtn.style.transform = "translate(0, 0)";
});

// ✅ FIXED - add cooldown here too
noBtn.addEventListener("mouseenter", () => {
  if (window.innerWidth > 768) {
    currentHeart = "💔";
    setAllHearts("💔");
    
    // Play sound with cooldown
    if (canPlayHoverSound) {
      sounds.hover.currentTime = 0;
      sounds.hover.play().catch(() => {});
      
      canPlayHoverSound = false;
      setTimeout(() => canPlayHoverSound = true, 200);
    }
    
    noBtn.style.position = "fixed";
    
    const container = document.querySelector(".container");
    const containerRect = container.getBoundingClientRect();
    const btnWidth = noBtn.offsetWidth;
    const btnHeight = noBtn.offsetHeight;
    const padding = 20;
    
    const minX = containerRect.left + padding;
    const minY = containerRect.top + padding;
    const maxX = containerRect.right - btnWidth - padding;
    const maxY = containerRect.bottom - btnHeight - padding;
    
    const newX = minX + Math.random() * (maxX - minX);
    const newY = minY + Math.random() * (maxY - minY);
    
    noBtn.style.left = newX + "px";
    noBtn.style.top = newY + "px";
  }
});

noBtn.addEventListener("pointerup", () => {
  currentHeart = "💕";
  setAllHearts("💕");

  if (mainCatImg) {
    mainCatImg.src = permaAngry ? noHoverCatSrc : originalCatSrc;
  }
});
