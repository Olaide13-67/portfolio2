// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to dark mode
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  htmlElement.classList.add('light-mode');
  updateThemeIcon();
}

// Toggle theme
themeToggle.addEventListener('click', () => {
  htmlElement.classList.toggle('light-mode');
  
  // Save preference
  if (htmlElement.classList.contains('light-mode')) {
    localStorage.setItem('theme', 'light');
  } else {
    localStorage.setItem('theme', 'dark');
  }
  
  updateThemeIcon();
});

function updateThemeIcon() {
  const icon = themeToggle.querySelector('i');
  if (htmlElement.classList.contains('light-mode')) {
    icon.className = 'bx bx-moon';
    themeToggle.title = 'Switch to dark mode';
  } else {
    icon.className = 'bx bx-sun';
    themeToggle.title = 'Switch to light mode';
  }
}

// ===== CV DOWNLOAD =====
const downloadCVBtn = document.getElementById('download-cv-btn');

if (downloadCVBtn) {
  downloadCVBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Create a blob from the PDF file path
    fetch('./Resume.pdf')
      .then(response => response.blob())
      .then(blob => {
        // Create a temporary download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Olaide_Adeshina_Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(err => {
        console.error('Error downloading CV:', err);
        alert('Failed to download CV. Please try again.');
      });
  });
}



// Cursor
const cursor = document.getElementById("cursor");
const ring = document.getElementById("cursor-ring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + "px";
  cursor.style.top = my + "px";
});
function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(animateRing);
}
animateRing();

// Header scroll
window.addEventListener("scroll", () => {
  document
    .getElementById("header")
    .classList.toggle("scrolled", window.scrollY > 60);
});

// Mobile nav
const toggle = document.getElementById("nav-toggle");
const links = document.getElementById("nav-links");
toggle.addEventListener("click", () => {
  links.classList.toggle("open");
  toggle.querySelector("i").className = links.classList.contains("open")
    ? "bx bx-x"
    : "bx bx-menu";
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.querySelector("i").className = "bx bx-menu";
  }),
);

// Scroll reveal
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        obs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal, .reveal-left, .reveal-right")
  .forEach((el) => obs.observe(el));

// Skill bars
const barObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target
          .querySelectorAll(".prof-fill")
          .forEach((b) => (b.style.width = b.dataset.width + "%"));
        barObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.3 },
);
document.querySelectorAll(".proficiency").forEach((el) => barObs.observe(el));

// FAQ accordion
document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");
  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");
    document
      .querySelectorAll(".faq-item.active")
      .forEach((openItem) => {
        if (openItem !== item) openItem.classList.remove("active");
      });
    item.classList.toggle("active", !isActive);
  });
});

// Projects carousel — seamless infinite loop
const track = document.getElementById("projects-track");
const prevBtn = document.getElementById("projects-prev");
const nextBtn = document.getElementById("projects-next");

if (track && prevBtn && nextBtn) {
  const originals = Array.from(track.children);
  const setCount = originals.length;

  // Clone the full set once before and once after the originals so
  // sliding past either edge always reveals identical-looking content.
  const makeClone = (el) => {
    const clone = el.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("tabindex", "-1");
    clone
      .querySelectorAll("a, button")
      .forEach((el2) => el2.setAttribute("tabindex", "-1"));
    return clone;
  };

  const afterFrag = document.createDocumentFragment();
  const beforeFrag = document.createDocumentFragment();
  originals.forEach((card) => afterFrag.appendChild(makeClone(card)));
  originals.forEach((card) => beforeFrag.appendChild(makeClone(card)));
  track.appendChild(afterFrag);
  track.insertBefore(beforeFrag, track.firstChild);

  const cardGap = 28;

  // Position is tracked as an integer "step" count (one card = one step)
  // rather than a raw scroll offset, and the strip is moved with a CSS
  // transform instead of native scrolling. This avoids any fight with
  // scroll-snap or native smooth-scroll timing — the wrap-around reset
  // happens the instant the transition ends, every time, exactly.
  let stepWidth = 0;
  const measureStep = () => {
    const card = track.querySelector(".project-card");
    stepWidth = card ? card.offsetWidth + cardGap : track.clientWidth;
  };

  let currentStep = setCount; // start on the first card of the real (middle) set

  const applyTransform = (animate) => {
    track.style.transition = animate
      ? "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
      : "none";
    track.style.transform = `translateX(${-currentStep * stepWidth}px)`;
  };

  measureStep();
  applyTransform(false);

  // The instant the slide-transition finishes, silently re-map back into
  // the middle set if we've drifted into a clone region. Because the
  // clone region is pixel-identical to the real set, this remap changes
  // the transform value but produces zero visible difference on screen.
  track.addEventListener("transitionend", (e) => {
    if (e.target !== track || e.propertyName !== "transform") return;
    if (currentStep >= setCount * 2) {
      currentStep -= setCount;
      applyTransform(false);
    } else if (currentStep < setCount) {
      currentStep += setCount;
      applyTransform(false);
    }
  });

  const scrollNext = () => {
    currentStep++;
    applyTransform(true);
  };
  const scrollPrev = () => {
    currentStep--;
    applyTransform(true);
  };

  let autoScrollTimer = null;
  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollTimer = setInterval(scrollNext, 3000);
  };
  const stopAutoScroll = () => {
    if (autoScrollTimer) clearInterval(autoScrollTimer);
  };
  const restartAutoScroll = () => {
    stopAutoScroll();
    startAutoScroll();
  };

  prevBtn.addEventListener("click", () => {
    scrollPrev();
    restartAutoScroll();
  });
  nextBtn.addEventListener("click", () => {
    scrollNext();
    restartAutoScroll();
  });

  // Pause auto-scroll while the user is interacting, resume after
  track.addEventListener("mouseenter", stopAutoScroll);
  track.addEventListener("mouseleave", startAutoScroll);
  track.addEventListener("touchstart", stopAutoScroll, { passive: true });
  track.addEventListener("touchend", startAutoScroll);

  window.addEventListener("resize", () => {
    measureStep();
    applyTransform(false);
  });

  startAutoScroll();
}

// ===== WHATSAPP FLOATING WIDGET =====
const WA_NUMBER = "2348144589405"; // Olaide's WhatsApp number, no + or leading 0
const waWidget = document.getElementById("wa-widget");
const waFab = document.getElementById("wa-fab");
const waPanelClose = document.getElementById("wa-panel-close");
const waForm = document.getElementById("wa-panel-form");
const waMessageInput = document.getElementById("wa-message");

if (waWidget && waFab) {
  waFab.addEventListener("click", () => {
    waWidget.classList.toggle("open");
    if (waWidget.classList.contains("open")) {
      waMessageInput.focus();
    }
  });

  waPanelClose.addEventListener("click", () => {
    waWidget.classList.remove("open");
  });

  waForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = waMessageInput.value.trim();
    if (!message) return;
    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    waMessageInput.value = "";
    waWidget.classList.remove("open");
  });

  // Close panel when clicking outside of it
  document.addEventListener("click", (e) => {
    if (waWidget.classList.contains("open") && !waWidget.contains(e.target)) {
      waWidget.classList.remove("open");
    }
  });
}

// Toast
function handleSend(e) {
  e.preventDefault();
  const t = document.createElement("div");
  t.style.cssText =
    "position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:var(--accent);color:#0b0d0f;padding:.75rem 1.75rem;border-radius:50px;font-weight:700;font-size:.9rem;z-index:9999;box-shadow:0 8px 32px rgba(200,240,74,.3)";
  t.textContent = "✓ Message sent! I'll be in touch soon.";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}
