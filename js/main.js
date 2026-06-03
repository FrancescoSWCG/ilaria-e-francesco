let currentHeroSlide = 0;
const heroTrack = document.getElementById("heroTrack");
const heroDotsContainer = document.getElementById("heroDots");
const galleryImages = window.galleryImages || [];

function createGalleryAlt(filename) {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function createImageSrc(filename) {
  return "assets/images/" + encodeURIComponent(filename);
}

function createHeroSlide(filename, index) {
  const slide = document.createElement("div");
  const image = document.createElement("img");

  slide.className = "hero-slide";
  image.src = createImageSrc(filename);
  image.alt = createGalleryAlt(filename) || "Foto di Ilaria e Francesco";

  if (index === 0) {
    image.fetchPriority = "high";
  } else {
    image.loading = "lazy";
  }

  slide.appendChild(image);
  return slide;
}

function createHeroDot(index) {
  const dot = document.createElement("button");

  dot.className = "slider-dot";
  dot.type = "button";
  dot.setAttribute("aria-label", "Vai alla foto " + (index + 1));
  dot.addEventListener("click", () => goToHeroSlide(index));

  return dot;
}

function renderHeroSlider() {
  galleryImages.forEach((filename, index) => {
    heroTrack.appendChild(createHeroSlide(filename, index));
    heroDotsContainer.appendChild(createHeroDot(index));
  });

  updateHeroSlider();
}

function updateHeroSlider() {
  const heroDots = document.querySelectorAll(".slider-dot");

  heroTrack.style.transform = `translateX(-${currentHeroSlide * 100}%)`;
  heroDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentHeroSlide);
  });
}

function moveHeroSlide(direction) {
  if (galleryImages.length === 0) {
    return;
  }

  currentHeroSlide = (currentHeroSlide + direction + galleryImages.length) % galleryImages.length;
  updateHeroSlider();
}

function goToHeroSlide(index) {
  currentHeroSlide = index;
  updateHeroSlider();
}

renderHeroSlider();

    const weddingDate = new Date("2026-09-18T11:30:00+02:00");
    const countdownUnits = {
      days: document.getElementById("countdownDays"),
      hours: document.getElementById("countdownHours"),
      minutes: document.getElementById("countdownMinutes"),
      seconds: document.getElementById("countdownSeconds"),
    };

    function createCountdownValue(value, className) {
      const valueElement = document.createElement("span");
      valueElement.className = className
        ? `countdown-value ${className}`
        : "countdown-value";
      valueElement.textContent = value;
      return valueElement;
    }

    function setCountdownValue(element, value) {
      const nextValue = String(value);
      const currentValue = element.dataset.value;

      if (currentValue === nextValue) {
        return;
      }

      element.dataset.value = nextValue;

      if (currentValue === undefined) {
        element.replaceChildren(createCountdownValue(nextValue));
        return;
      }

      const oldValue = createCountdownValue(currentValue, "countdown-old");
      const newValue = createCountdownValue(nextValue, "countdown-new");
      let settled = false;

      function settleAnimation() {
        if (settled || element.dataset.value !== nextValue) {
          return;
        }

        settled = true;
        element.classList.remove("is-animating");
        element.replaceChildren(createCountdownValue(nextValue));
      }

      element.classList.remove("is-animating");
      element.replaceChildren(oldValue, newValue);
      void element.offsetWidth;
      element.classList.add("is-animating");

      newValue.addEventListener("animationend", settleAnimation, { once: true });
      setTimeout(settleAnimation, 520);
    }

    function updateCountdown() {
      const distance = Math.max(weddingDate.getTime() - Date.now(), 0);
      const days = Math.floor(distance / 86400000);
      const hours = Math.floor((distance % 86400000) / 3600000);
      const minutes = Math.floor((distance % 3600000) / 60000);
      const seconds = Math.floor((distance % 60000) / 1000);

      setCountdownValue(countdownUnits.days, days);
      setCountdownValue(countdownUnits.hours, String(hours).padStart(2, "0"));
      setCountdownValue(countdownUnits.minutes, String(minutes).padStart(2, "0"));
      setCountdownValue(countdownUnits.seconds, String(seconds).padStart(2, "0"));
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
