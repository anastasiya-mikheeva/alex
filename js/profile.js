(() => {
  const editToggleBtn = document.getElementById("editToggleBtn");
  const editForm = document.getElementById("editForm");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const editName = document.getElementById("editName");
  const editNick = document.getElementById("editNick");
  const editBio = document.getElementById("editBio");
  const displayName = document.getElementById("displayName");
  const displayNick = document.getElementById("displayNick");
  const displayBio = document.getElementById("displayBio");
  const pDataNick = document.getElementById("pDataNick");
  const personalDataBtn = document.getElementById("personalDataBtn");
  const personalDataBlock = document.getElementById("personalDataBlock");
  const togglePwdBtn = document.getElementById("togglePwdBtn");
  const pDataPwd = document.getElementById("pDataPwd");
  const followsBtn = document.getElementById("followsBtn");
  const followersStat = document.getElementById("followersStat");
  const followsModal = document.getElementById("followsModal");
  const followsModalClose = document.getElementById("followsModalClose");
  const search = document.getElementById("wikiSearch");

  if (!editForm) return;

  const closeEdit = () => {
    editForm.classList.remove("open");
    if (editToggleBtn) {
      editToggleBtn.innerHTML = '<i class="fas fa-pen"></i> Редактировать профиль';
    }
  };

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

  if (editToggleBtn) {
    editToggleBtn.addEventListener("click", () => {
      const open = editForm.classList.toggle("open");
      if (open) {
        personalDataBlock?.classList.remove("open");
        if (personalDataBtn) {
          personalDataBtn.innerHTML = '<i class="fas fa-lock"></i> Личные данные';
        }
        editName.value = displayName.textContent.trim();
        editNick.value = displayNick.textContent.trim();
        editBio.value = displayBio.textContent.trim();
        editToggleBtn.innerHTML = '<i class="fas fa-times"></i> Закрыть редактирование';
        editName.focus();
      } else {
        closeEdit();
      }
    });
  }

  cancelEditBtn?.addEventListener("click", closeEdit);

  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newName = editName.value.trim() || "Без имени";
    const newNick = editNick.value.trim() || "@user";
    const newBio = editBio.value.trim() || "Информация не указана.";
    displayName.textContent = newName;
    displayNick.textContent = newNick;
    displayBio.textContent = newBio;
    if (pDataNick) pDataNick.textContent = newNick;
    closeEdit();
    showToast("Профиль обновлён");
  });

  personalDataBtn?.addEventListener("click", () => {
    const open = personalDataBlock.classList.toggle("open");
    if (open) {
      editForm.classList.remove("open");
      closeEdit();
    }
    personalDataBtn.innerHTML = open
      ? '<i class="fas fa-lock-open"></i> Скрыть данные'
      : '<i class="fas fa-lock"></i> Личные данные';
  });

  let pwdVisible = false;
  togglePwdBtn?.addEventListener("click", () => {
    pwdVisible = !pwdVisible;
    pDataPwd.textContent = pwdVisible ? "скрыто · демо" : "••••••••";
    togglePwdBtn.innerHTML = pwdVisible
      ? '<i class="fas fa-eye-slash"></i>'
      : '<i class="fas fa-eye"></i>';
    togglePwdBtn.setAttribute("aria-label", pwdVisible ? "Скрыть пароль" : "Показать пароль");
  });

  const openModal = () => {
    followsModal.classList.add("open");
    document.body.style.overflow = "hidden";
    followsModalClose?.focus();
  };

  const closeModal = () => {
    followsModal.classList.remove("open");
    document.body.style.overflow = "";
  };

  followsBtn?.addEventListener("click", openModal);
  followersStat?.addEventListener("click", openModal);
  followsModalClose?.addEventListener("click", closeModal);

  followsModal?.addEventListener("click", (event) => {
    if (event.target === followsModal) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && followsModal?.classList.contains("open")) {
      closeModal();
    }
  });

  search?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = new FormData(search).get("q") || search.querySelector("input")?.value;
    if (value) showToast(`Поиск: «${String(value).trim()}»`);
  });
})();
