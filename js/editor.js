(() => {
  const form = document.getElementById("editorForm");
  const title = document.getElementById("articleTitle");
  const category = document.getElementById("articleCategory");
  const body = document.getElementById("articleBody");
  const view = document.getElementById("articleView");
  const viewTitle = document.getElementById("viewTitle");
  const viewCategory = document.getElementById("viewCategory");
  const viewBody = document.getElementById("viewBody");
  const previewBtn = document.getElementById("previewBtn");
  const editAgainBtn = document.getElementById("editAgainBtn");
  if (!form || !body) return;

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  const toHtml = (text) =>
    escapeHtml(text)
      .replaceAll("**", "")
      .split(/\n{2,}/)
      .map((block) => {
        const lines = block.split("\n");
        if (lines[0].startsWith("## ")) {
          return `<h3>${lines[0].slice(3)}</h3>${lines
            .slice(1)
            .map((line) => `<p>${line}</p>`)
            .join("")}`;
        }
        return `<p>${lines.join("<br>")}</p>`;
      })
      .join("");

  const showToast = (msg) => {
    document.querySelectorAll(".toast").forEach((el) => el.remove());
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  const renderView = () => {
    viewTitle.textContent = title.value.trim() || "Без названия";
    viewCategory.textContent = category.value;
    viewBody.innerHTML = toHtml(body.value.trim() || "Текст пока пуст.");
    form.classList.add("is-hidden");
    view.classList.add("is-open");
  };

  document.querySelectorAll(".editor-toolbar button").forEach((button) => {
    button.addEventListener("click", () => {
      const start = body.selectionStart;
      const end = body.selectionEnd;
      const selected = body.value.slice(start, end);
      const wrap = button.dataset.wrap;
      const insert = (button.dataset.insert || "").replaceAll("\\n", "\n");
      if (wrap) {
        body.setRangeText(`${wrap}${selected || "текст"}${wrap}`, start, end, "end");
      } else {
        body.setRangeText(insert, start, start, "end");
      }
      body.focus();
    });
  });

  previewBtn?.addEventListener("click", () => {
    if (!title.value.trim() && !body.value.trim()) {
      showToast("Сначала напишите заголовок или текст");
      return;
    }
    renderView();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    renderView();
    showToast("Статья опубликована без комментариев");
  });

  editAgainBtn?.addEventListener("click", () => {
    view.classList.remove("is-open");
    form.classList.remove("is-hidden");
    title.focus();
  });
})();
