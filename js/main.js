let currentHeroSlide = 0;
    const heroTrack = document.getElementById("heroTrack");
    const heroSlides = document.querySelectorAll(".hero-slide");
    const heroDotsContainer = document.getElementById("heroDots");

    heroSlides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "slider-dot";
      dot.type = "button";
      dot.setAttribute("aria-label", "Vai alla foto " + (index + 1));
      dot.addEventListener("click", () => goToHeroSlide(index));
      heroDotsContainer.appendChild(dot);
    });

    const heroDots = document.querySelectorAll(".slider-dot");

    function updateHeroSlider() {
      heroTrack.style.transform = `translateX(-${currentHeroSlide * 100}%)`;
      heroDots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentHeroSlide);
      });
    }

    function moveHeroSlide(direction) {
      currentHeroSlide = (currentHeroSlide + direction + heroSlides.length) % heroSlides.length;
      updateHeroSlider();
    }

    function goToHeroSlide(index) {
      currentHeroSlide = index;
      updateHeroSlider();
    }

    updateHeroSlider();

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
