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
