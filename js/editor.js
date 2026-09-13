(() => {
  const $ = (id) => document.getElementById(id);
  const page = $("studioPage");
  const title = $("title");
  const lead = $("lead");
  const body = $("body");
  const live = $("live");
  const wordsEl = $("words");
  const minsEl = $("mins");
  const savedEl = $("saved");
  const cover = $("cover");
  const coverBox = $("coverBox");
  const KEY = "roytalex-studio";

  let category = "Наука";
  let coverData = "";
  let saveTimer = 0;

  const escape = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const plural = (n, one, few, many) => {
    const n10 = n % 10;
    const n100 = n % 100;
    if (n10 === 1 && n100 !== 11) return one;
    if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
    return many;
  };

  const toHtml = (raw) => {
    const lines = String(raw).replace(/\r\n/g, "\n").split("\n");
    const out = [];
    let list = [];

    const flush = () => {
      if (!list.length) return;
      out.push("<ul>" + list.map((x) => `<li>${x}</li>`).join("") + "</ul>");
      list = [];
    };

    const inline = (s) =>
      escape(s)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, "$1<em>$2</em>");

    lines.forEach((line) => {
      const t = line.trim();
      if (!t) {
        flush();
        return;
      }
      if (/^[-*]\s+/.test(t)) {
        list.push(inline(t.replace(/^[-*]\s+/, "")));
        return;
      }
      flush();
      if (/^###\s+/.test(t)) out.push(`<h3>${inline(t.replace(/^###\s+/, ""))}</h3>`);
      else if (/^##\s+/.test(t)) out.push(`<h2>${inline(t.replace(/^##\s+/, ""))}</h2>`);
      else if (/^#\s+/.test(t)) out.push(`<h2>${inline(t.replace(/^#\s+/, ""))}</h2>`);
      else if (/^>\s+/.test(t)) out.push(`<blockquote>${inline(t.replace(/^>\s+/, ""))}</blockquote>`);
      else out.push(`<p>${inline(line)}</p>`);
    });
    flush();
    return out.join("");
  };

  const countWords = (s) => (String(s).trim().match(/[0-9A-Za-zА-Яа-яЁё]+/g) || []).length;

  const formatDate = (d) => {
    const months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря",
    ];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const render = () => {
    const t = title.value.trim() || "Заголовок";
    const l = lead.value.trim() || "Одно предложение — о чём эта статья";
    const html = toHtml(body.value);
    const coverHtml = coverData ? `<img class="cover" src="${coverData}" alt="">` : "";
    live.innerHTML =
      coverHtml +
      `<p class="badge">${escape(category)}</p>` +
      `<h1>${escape(t)}</h1><p class="lead">${escape(l)}</p>` +
      (html || '<p class="empty">Начните писать слева — текст появится здесь.</p>');

    const n = countWords(`${title.value} ${lead.value} ${body.value}`);
    const mins = Math.max(1, Math.ceil(n / 180) || 1);
    wordsEl.textContent = `${n} ${plural(n, "слово", "слова", "слов")}`;
    minsEl.textContent = String(mins);
  };

  const persist = () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        title: title.value,
        lead: lead.value,
        body: body.value,
        category,
        coverData,
      })
    );
    savedEl.textContent = "сохранено";
    clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      savedEl.textContent = "черновик на этом устройстве";
    }, 1400);
  };

  const scheduleSave = () => {
    clearTimeout(saveTimer);
    saveTimer = window.setTimeout(persist, 280);
  };

  const applyCover = (data) => {
    coverData = data && String(data).startsWith("data:image") ? data : "";
    if (coverData) {
      coverBox.classList.add("has-img");
      coverBox.style.backgroundImage = `url("${coverData}")`;
      coverBox.style.backgroundSize = "cover";
      coverBox.style.backgroundPosition = "center";
    } else {
      coverBox.classList.remove("has-img");
      coverBox.style.backgroundImage = "";
    }
  };

  const setReaderCover = (data) => {
    const wrap = $("rCover");
    wrap.classList.remove("is-on");
    wrap.replaceChildren();
    if (!data || !String(data).startsWith("data:image")) return;
    const img = new Image();
    img.alt = "";
    img.onload = () => {
      if (!img.naturalWidth) return;
      wrap.replaceChildren(img);
      wrap.classList.add("is-on");
    };
    img.onerror = () => {
      applyCover("");
      persist();
    };
    img.src = data;
  };

  const restore = () => {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (d.title) title.value = d.title;
      if (d.lead) lead.value = d.lead;
      if (d.body) body.value = d.body;
      if (d.category) category = d.category;
      if (d.coverData && String(d.coverData).startsWith("data:image")) {
        const probe = new Image();
        probe.onload = () => {
          applyCover(d.coverData);
          render();
        };
        probe.onerror = () => applyCover("");
        probe.src = d.coverData;
      }
      document.querySelectorAll(".studio-cat").forEach((b) => {
        b.classList.toggle("is-on", b.dataset.cat === category);
      });
    } catch {
      /* ignore broken draft */
    }
    render();
    if (!title.value) title.focus();
  };

  const toast = (text) => {
    document.querySelectorAll(".toast").forEach((el) => el.remove());
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  };

  const insertMark = (mark) => {
    const start = body.selectionStart;
    const end = body.selectionEnd;
    const selected = body.value.slice(start, end);
    let insert = mark;
    if (mark === "**" || mark === "*") {
      insert = selected ? mark + selected + mark : mark + mark;
    } else if (selected) {
      insert = mark + selected;
    }
    body.setRangeText(insert, start, end, "end");
    if ((mark === "**" || mark === "*") && !selected) {
      const caret = start + mark.length;
      body.setSelectionRange(caret, caret);
    }
    body.focus();
    render();
    persist();
  };

  document.querySelectorAll(".studio-cat").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".studio-cat").forEach((b) => b.classList.remove("is-on"));
      btn.classList.add("is-on");
      category = btn.dataset.cat;
      persist();
      render();
    });
  });

  document.querySelectorAll(".studio-tools [data-md]").forEach((btn) => {
    btn.addEventListener("click", () => insertMark(btn.dataset.md));
  });

  cover.addEventListener("change", () => {
    const file = cover.files && cover.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Нужно изображение");
      return;
    }
    const readerFile = new FileReader();
    readerFile.onload = () => {
      applyCover(String(readerFile.result || ""));
      persist();
      render();
    };
    readerFile.readAsDataURL(file);
  });

  [title, lead, body].forEach((el) => {
    el.addEventListener("input", () => {
      render();
      scheduleSave();
    });
  });

  const showReader = () => {
    if (!title.value.trim() || !body.value.trim()) {
      toast("Нужны заголовок и текст статьи");
      if (!title.value.trim()) title.focus();
      else body.focus();
      return;
    }
    persist();
    $("rCat").textContent = category;
    $("rTitle").textContent = title.value.trim();
    $("rLead").textContent = lead.value.trim();
    $("rBody").innerHTML = toHtml(body.value);
    const n = countWords(body.value);
    const mins = Math.max(1, Math.ceil(n / 180));
    $("rMeta").textContent = `${formatDate(new Date())} · ${mins} мин · ${category}`;
    setReaderCover(coverData);
    page.classList.add("is-reading");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showStudio = () => {
    page.classList.remove("is-reading");
    title.focus();
  };

  $("publishBtn").addEventListener("click", showReader);
  $("editAgain").addEventListener("click", showStudio);

  $("clearBtn").addEventListener("click", () => {
    title.value = "";
    lead.value = "";
    body.value = "";
    cover.value = "";
    applyCover("");
    persist();
    render();
    title.focus();
  });

  document.addEventListener("keydown", (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const key = e.key.toLowerCase();
    if (key === "b") {
      e.preventDefault();
      insertMark("**");
    }
    if (key === "i") {
      e.preventDefault();
      insertMark("*");
    }
  });

  if (location.hash === "#file") {
    setTimeout(() => cover.click(), 240);
  }

  restore();
})();
