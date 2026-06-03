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
