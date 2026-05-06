(() => {
  // Theme switch
  const body = document.body;
  const lamp = document.getElementById("mode");

  const toggleTheme = (state) => {
    if (state === "dark") {
      localStorage.setItem("theme", "light");
      body.removeAttribute("data-theme");
    } else if (state === "light") {
      localStorage.setItem("theme", "dark");
      body.setAttribute("data-theme", "dark");
    } else {
      initTheme(state);
    }
  };

  lamp.addEventListener("click", () =>
    toggleTheme(localStorage.getItem("theme"))
  );

  // Blur the content when the menu is open
  const cbox = document.getElementById("menu-trigger");

  cbox.addEventListener("change", function () {
    const area = document.querySelector(".wrapper");
    this.checked
      ? area.classList.add("blurry")
      : area.classList.remove("blurry");
  });

  // Intersection Observer for Scroll Animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Use setTimeout to ensure DOM is fully parsed for Jekyll dynamically generated content
  setTimeout(() => {
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observer.observe(el);
    });
  }, 100);

  // Project Slider & Carousel Focus
  const slider = document.getElementById('project-slider');
  const prevBtn = document.getElementById('prev-project');
  const nextBtn = document.getElementById('next-project');

  if (slider && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      if (slider.scrollLeft <= 50) {
        slider.scrollTo({ left: slider.scrollWidth, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: -slider.offsetWidth * 0.5, behavior: 'smooth' });
      }
    });

    nextBtn.addEventListener('click', () => {
      if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 50) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: slider.offsetWidth * 0.5, behavior: 'smooth' });
      }
    });

    // Detect which card is centered
    const focusObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Using a lower threshold for 2-column layouts
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
        } else {
          entry.target.classList.remove('is-active');
        }
      });
    }, {
      root: slider,
      threshold: 0.5,
      rootMargin: '0px -10% 0px -10%' // Add some margin to focus on the center
    });

    document.querySelectorAll('.project-card-container').forEach(card => {
      focusObserver.observe(card);
    });
  }

})();
