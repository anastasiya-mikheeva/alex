(() => {
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  const nav = document.querySelector(".nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const rain = document.getElementById("codeRain");
  if (rain) {
    const snippets = [
      "def boot():",
      "print('roytalex')",
      "for i in range(n):",
      "const app = () => {}",
      "#include <bits/stdc++.h>",
      "while True:",
      "npm run build",
      "pygame.init()",
      "tk.Tk()",
      "dp[i] = min(dp[i], dp[j]+1)",
      "async def handler():",
      "git commit -m 'ship'",
    ];
    for (let i = 0; i < 18; i += 1) {
      const span = document.createElement("span");
      span.textContent = snippets[i % snippets.length];
      span.style.left = `${(i * 5.5) % 100}%`;
      span.style.animationDuration = `${8 + (i % 7)}s`;
      span.style.animationDelay = `${(i % 10) * 0.45}s`;
      rain.appendChild(span);
    }
  }

  const laptop = document.getElementById("laptop");
  const laptopScreen = document.getElementById("laptopScreen");
  const screenTyped = document.getElementById("screenTyped");
  const bootPanel = document.getElementById("bootPanel");
  const idle = laptopScreen?.querySelector(".laptop__idle");
  const live = laptopScreen?.querySelector(".laptop__live");

  const bootLines = [
    "whoami",
    "\nАлександр Ройтберг",
    "\ncat about.txt",
    "\nIT-блогер · мини-бизнесмен",
    "\nskills --list",
    "\nsites · bots · pygame · tkinter",
    "\njs · python · c++ · olympiad",
  ];

  let booted = false;

  const typeScreen = async () => {
    if (!screenTyped) return;
    screenTyped.textContent = "";
    for (const chunk of bootLines) {
      for (const ch of chunk) {
        screenTyped.textContent += ch;
        await wait(28);
      }
      await wait(180);
    }
  };

  laptop?.addEventListener("click", async () => {
    if (booted) {
      const open = bootPanel?.hasAttribute("hidden");
      if (open) {
        bootPanel?.removeAttribute("hidden");
        laptop.setAttribute("aria-expanded", "true");
      } else {
        bootPanel?.setAttribute("hidden", "");
        laptop.setAttribute("aria-expanded", "false");
      }
      return;
    }

    booted = true;
    laptop.classList.add("is-on");
    laptop.setAttribute("aria-expanded", "true");
    idle?.setAttribute("hidden", "");
    live?.removeAttribute("hidden");
    bootPanel?.removeAttribute("hidden");
    await typeScreen();
  });

  const terminalBody = document.getElementById("terminalBody");
  const replayBtn = document.getElementById("replayTerminal");

  const terminalScript = [
    { type: "cmd", text: "roytalex --skills" },
    { type: "out", text: "✓ сайты" },
    { type: "out", text: "✓ telegram-боты" },
    { type: "out", text: "✓ игры на pygame" },
    { type: "out", text: "✓ приложения на tkinter" },
    { type: "out", text: "✓ javascript · python · c++" },
    { type: "out", text: "✓ алгоритмы и олимпиадное программирование" },
    { type: "cmd", text: "echo 'build · ship · tell'" },
    { type: "out", text: "build · ship · tell" },
  ];

  let terminalRunning = false;

  const runTerminal = async () => {
    if (!terminalBody || terminalRunning) return;
    terminalRunning = true;
    terminalBody.textContent = "";

    for (const line of terminalScript) {
      if (line.type === "cmd") {
        terminalBody.textContent += `$ `;
        for (const ch of line.text) {
          terminalBody.textContent += ch;
          await wait(36);
        }
        terminalBody.textContent += "\n";
        await wait(220);
      } else {
        terminalBody.textContent += `${line.text}\n`;
        await wait(160);
      }
    }

    terminalBody.textContent += `$ ▍`;
    terminalRunning = false;
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        if (entry.target.id === "terminalBox") runTerminal();
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.25 }
  );

  document.querySelectorAll("[data-skill], #terminalBox").forEach((el, index) => {
    if (el.hasAttribute("data-skill")) {
      el.style.transitionDelay = `${(index % 8) * 70}ms`;
    }
    io.observe(el);
  });

  replayBtn?.addEventListener("click", () => {
    if (!terminalRunning) runTerminal();
  });

  const floatImg = document.querySelector(".hero__img--float");
  window.addEventListener(
    "pointermove",
    (event) => {
      if (!floatImg || window.matchMedia("(max-width: 720px)").matches) return;
      const x = (event.clientX / window.innerWidth - 0.5) * 16;
      const y = (event.clientY / window.innerHeight - 0.5) * 12;
      floatImg.style.translate = `${x}px ${y}px`;
    },
    { passive: true }
  );
})();
