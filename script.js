console.log("JavaScript loaded!");

const sounds = {
  open: new Audio("https://files.catbox.moe/ko0toy.mp3"),
  yes: new Audio("https://files.catbox.moe/09oh2e.mp3"), // click SFX
};

// ✅ Background love song (starts after YES, loops)
const bgSong = new Audio("https://files.catbox.moe/4eojz9.mp3");
bgSong.loop = true;
bgSong.volume = 0.5;

Object.values(sounds).forEach((sound) => {
  sound.volume = 0.3;
  sound.addEventListener("error", () => (sound.muted = true));
});
bgSong.addEventListener("error", () => (bgSong.muted = true));

const startScreen = document.getElementById("startScreen");
const mainScreen = document.getElementById("mainScreen");
const envelope = document.getElementById("envelope");
const envelopeContainer = document.getElementById("envelopeContainer");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const message = document.getElementById("message");

// Cat swap (main screen)
const mainCatImg = document.querySelector(".cat-main");
const originalCatSrc = mainCatImg ? mainCatImg.src : "";

// Angry cat (NO hover)
const noHoverCatSrc =
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWhoMzhxcjlnNWs0cWN4YnllY2E3bWY4bzd4Yms0NmVtZ25pOXdtbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/3T7WB64PW315Z8zhRg/giphy.gif";

// ✅ Happy YES background GIF
const yesBgGif =
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWoyOTJ4cWhjb21nOTFpbG5hazZuMWxtd2w2dXUwbDZpMTc5ODV6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKoWXm3okO1kgHC/giphy.gif";

let yesSize = 1;
let noHoverCount = 0;

// after 7 hovers -> angry cat stays forever
let permaAngry = false;

// after 10 hovers -> angry cat becomes page background
let bossBackgroundActivated = false;

// Floating hearts state
let currentHeart = "💕";
let heartInterval = null;
let revertTimer = null;

// create 1 heart
function spawnHeart() {
  const heart = document.createElement("div");
  heart.className = "heart-float";
  heart.textContent = currentHeart;
  heart.style.left = Math.random() * 100 + "%";
  heart.style.bottom = "0px";
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 4000);
}

// flip all existing hearts currently in DOM
function setAllHearts(symbol) {
  document.querySelectorAll(".heart-float").forEach((h) => {
    h.textContent = symbol;
  });
}

// controlled interval so we can swap 💕 <-> 💔 cleanly
function startHearts(symbol) {
  currentHeart = symbol;
  if (heartInterval) clearInterval(heartInterval);
  heartInterval = setInterval(spawnHeart, 300);
}

// ✅ keep 💔 visible even though the button runs away (so pointerleave fires instantly)
function setHeartsTemporarily(symbol, ms = 900) {
  startHearts(symbol);
  setAllHearts(symbol);

  if (revertTimer) clearTimeout(revertTimer);
  revertTimer = setTimeout(() => {
    startHearts("💕");
    setAllHearts("💕");
  }, ms);
}

// start pink hearts immediately (start screen too)
startHearts("💕");

envelopeContainer.addEventListener("click", () => {
  // helps some browsers allow audio after a click
  const unlock = new Audio("https://files.catbox.moe/rudqvb.mp3");
  unlock.volume = 0;
  unlock.play().catch(() => {});

  sounds.open.play().catch(() => {});
  envelope.classList.add("opening");

  setTimeout(() => {
    startScreen.style.display = "none";
    mainScreen.style.display = "flex";
    mainScreen.classList.remove("hidden");
  }, 1000);
});

yesBtn.addEventListener("click", () => {
  // click SFX
  sounds.yes.play().catch(() => {});

  // ✅ start background song
  bgSong.currentTime = 0;
  bgSong.play().catch(() => {});

  // ✅ YES overrides any angry boss background with a happy GIF background
  bossBackgroundActivated = false;
  document.body.style.animation = "";
  document.body.style.background = "";
  document.body.style.backgroundImage = `url(${yesBgGif})`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundColor = "rgba(255,255,255,0.15)";

  // hearts back to normal (lock it in)
  if (revertTimer) clearTimeout(revertTimer);
  startHearts("💕");
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

noBtn.onpointerenter = () => {
  // ✅ switch hearts to 💔 and KEEP it briefly (because button escapes instantly)
  setHeartsTemporarily("💔", 900);

  noHoverCount++;

  // Progressive text changes
  if (noHoverCount <= 2) {
    noBtn.textContent = "No ??";
  } else if (noHoverCount <= 4) {
    noBtn.textContent = "Are you sure?";
  } else if (noHoverCount <= 6) {
    noBtn.textContent = "????";
  } else if (noHoverCount <= 8) {
    noBtn.textContent = "Be serious.";
  } else {
    noBtn.textContent = "what the fuck";
  }

  if (noHoverCount >= 7) permaAngry = true;

  // Final boss mode: angry cat becomes background
  if (noHoverCount >= 10 && !bossBackgroundActivated) {
    bossBackgroundActivated = true;

    document.body.style.backgroundImage = `url(${noHoverCatSrc})`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundColor = "rgba(0,0,0,0.35)";
  }

  // Cat mood progression
  if (mainCatImg) {
    mainCatImg.src = permaAngry || noHoverCount >= 3 ? noHoverCatSrc : originalCatSrc;
  }

  // Spammy overlapping audio + louder
  const hoverSound = new Audio("https://files.catbox.moe/rudqvb.mp3");
  hoverSound.volume = Math.min(0.2 + noHoverCount * 0.1, 1);
  hoverSound.play().catch(() => {});

  // YES grows
  yesSize += 0.15;
  yesBtn.style.transform = `scale(${yesSize})`;

  // Shake screen
  document.body.style.animation = "shake 0.3s";
  setTimeout(() => {
    document.body.style.animation = "";
  }, 300);

  // Redder background before boss bg activates
  const t = Math.min(noHoverCount / 8, 1);
  const r = Math.round(50 + 205 * t);
  const g = Math.round(60 * (1 - t));
  const b = Math.round(156 * (1 - t));
  if (!bossBackgroundActivated) {
    document.body.style.background = `rgb(${r}, ${g}, ${b})`;
  }

  // Move NO inside the white container
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
};

// note: we DON'T flip back to 💕 here anymore — timer handles it
noBtn.onpointerleave = () => {
  if (mainCatImg) {
    mainCatImg.src = permaAngry ? noHoverCatSrc : originalCatSrc;
  }
};
