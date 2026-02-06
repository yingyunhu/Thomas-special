// Better mobile handling - move button on touch/hover START, not after
noBtn.addEventListener("pointerdown", (e) => {
  e.preventDefault(); // prevent the click from going through
  
  currentHeart = "💔";
  setAllHearts("💔");

  noHoverCount++;

  // Progressive text changes
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

  // Final boss mode
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
    if (permaAngry || noHoverCount >= 3) {
      mainCatImg.src = noHoverCatSrc;
    } else {
      mainCatImg.src = originalCatSrc;
    }
  }

  // Audio
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

  // Redder background
  const t = Math.min(noHoverCount / 8, 1);
  const r = Math.round(50 + 205 * t);
  const g = Math.round(60 * (1 - t));
  const b = Math.round(156 * (1 - t));
  if (!bossBackgroundActivated) {
    document.body.style.background = `rgb(${r}, ${g}, ${b})`;
  }

  // Move the button
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

// Desktop hover behavior (optional, for extra annoyance on desktop)
noBtn.addEventListener("mouseenter", () => {
  if (window.innerWidth > 768) { // only on desktop
    currentHeart = "💔";
    setAllHearts("💔");
    
    // Trigger same behavior as pointerdown but without text change
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
