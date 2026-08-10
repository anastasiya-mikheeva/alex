(() => {
  const nav = document.getElementById("wikiNav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (toggle && nav && links) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.innerHTML = open
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    const isMobileNav = () => window.matchMedia("(max-width: 1100px)").matches;

    links.querySelectorAll(":scope > li").forEach((item) => {
      const trigger = item.querySelector(":scope > span");
      if (!trigger) return;
      trigger.addEventListener("click", (event) => {
        if (!isMobileNav()) return;
        event.preventDefault();
        const open = item.classList.toggle("is-open");
        if (open) {
          links.querySelectorAll(":scope > li.is-open").forEach((other) => {
            if (other !== item) other.classList.remove("is-open");
          });
        }
      });
    });

    links.querySelectorAll(".has-submenu > a").forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        if (!isMobileNav()) return;
        event.preventDefault();
        anchor.parentElement.classList.toggle("is-open");
      });
    });

    window.addEventListener("resize", () => {
      if (!isMobileNav() && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.innerHTML = '<i class="fas fa-bars"></i>';
        links.querySelectorAll(".is-open").forEach((el) => el.classList.remove("is-open"));
      }
    });

    links.querySelectorAll("a[href^='#']").forEach((anchor) => {
      anchor.addEventListener("click", () => {
        if (nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });
    });
  }

  const search = document.getElementById("wikiSearch");
  if (search) {
    search.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = new FormData(search).get("q") || search.querySelector("input")?.value;
      if (value) {
        const about = document.getElementById("about");
        about?.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  const ticker = document.getElementById("topicTicker");
  if (ticker) {
    ticker.innerHTML += ticker.innerHTML;
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* Constellation canvas */
  const canvas = document.getElementById("constellation");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let points = [];
    let raf = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const count = Math.min(70, Math.floor((width * height) / 22000));
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.6 + 0.4,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(181, 240, 168, 0.55)";
        ctx.fill();

        for (let j = i + 1; j < points.length; j += 1) {
          const q = points[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(123, 201, 106, ${0.16 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduceMotion) {
      draw();
    } else {
      draw();
      cancelAnimationFrame(raf);
    }
  }

  /* ChatRoyt demo */
  const chatBody = document.getElementById("chatBody");
  const chatForm = document.getElementById("chatDemo");
  if (!chatBody || !chatForm) return;

  const script = [
    { role: "bot", text: "Привет! Я ChatRoyt. Могу объяснить термин из статьи или найти материал по теме." },
    { role: "user", text: "Найди что-нибудь про льва" },
    { role: "bot", text: "Готово: краткая справка о льве, биология вида и связанные статьи о саваннах. Читать вслух?" },
  ];

  const replies = [
    "Хороший вопрос. Вот краткое саммари и два связанных материала по теме.",
    "Могу переформулировать сложный абзац проще — или прочитать его голосом.",
    "Нашёл актуальные тезисы. Открыть статью для обучения или углублённый обзор?",
  ];

  const addBubble = (role, text, typing = false) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble chat-bubble--${role}${typing ? " chat-bubble--typing" : ""}`;
    if (typing) {
      bubble.innerHTML = "<i></i><i></i><i></i>";
    } else {
      bubble.textContent = text;
    }
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
    return bubble;
  };

  let demoStarted = false;
  const playIntro = async () => {
    if (demoStarted) return;
    demoStarted = true;
    for (const message of script) {
      if (message.role === "bot") {
        const typing = addBubble("bot", "", true);
        await wait(700);
        typing.remove();
      } else {
        await wait(500);
      }
      addBubble(message.role, message.text);
      await wait(900);
    }
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  if ("IntersectionObserver" in window) {
    const chatObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playIntro();
            chatObserver.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    chatObserver.observe(chatBody);
  } else {
    playIntro();
  }

  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = chatForm.querySelector("input");
    const value = input.value.trim();
    if (!value) return;
    addBubble("user", value);
    input.value = "";
    const typing = addBubble("bot", "", true);
    await wait(800);
    typing.remove();
    addBubble("bot", replies[Math.floor(Math.random() * replies.length)]);
  });
})();
