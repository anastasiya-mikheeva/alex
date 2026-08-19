(() => {
  const allUsers = [
    { id: 1, name: "Екатерина Смирнова", nick: "@kat_smi", avatar: "fa-user" },
    { id: 2, name: "Дмитрий Иванов", nick: "@dima_ivan", avatar: "fa-user" },
    { id: 3, name: "Ольга Петрова", nick: "@olga_petr", avatar: "fa-user" },
    { id: 4, name: "Сергей Козлов", nick: "@serge_kozl", avatar: "fa-user" },
    { id: 5, name: "Анна Морозова", nick: "@anna_moroz", avatar: "fa-user" },
    { id: 6, name: "Максим Новиков", nick: "@max_nov", avatar: "fa-user" },
    { id: 7, name: "Татьяна Васильева", nick: "@tanya_vas", avatar: "fa-user" },
    { id: 8, name: "Игорь Петров", nick: "@igor_petr", avatar: "fa-user" },
    { id: 9, name: "Мария Соколова", nick: "@maria_sok", avatar: "fa-user" },
    { id: 10, name: "Андрей Ковалёв", nick: "@andrey_kov", avatar: "fa-user" },
  ];

  const contacts = [
    {
      id: 1,
      name: "Екатерина Смирнова",
      nick: "@kat_smi",
      avatar: "fa-user",
      status: "онлайн",
      unread: 2,
      messages: [
        { from: "them", text: "Привет! Как дела?", time: "12:30" },
        { from: "me", text: "Привет! Всё отлично, работаю над статьёй.", time: "12:32" },
        { from: "them", text: "Круто! Удачи :)", time: "12:34" },
      ],
    },
    {
      id: 2,
      name: "Дмитрий Иванов",
      nick: "@dima_ivan",
      avatar: "fa-user",
      status: "был(а) вчера",
      unread: 0,
      messages: [
        { from: "me", text: "Привет, как твой проект?", time: "14:50" },
        { from: "them", text: "Всё супер, спасибо за помощь!", time: "15:20" },
      ],
    },
    {
      id: 3,
      name: "Ольга Петрова",
      nick: "@olga_petr",
      avatar: "fa-user",
      status: "печатает...",
      unread: 1,
      messages: [
        { from: "them", text: "Привет! Есть планы на завтра?", time: "09:50" },
        { from: "me", text: "Привет! Пока нет, а что?", time: "10:00" },
        { from: "them", text: "Давай встретимся завтра?", time: "10:05" },
      ],
    },
    {
      id: 4,
      name: "Сергей Козлов",
      nick: "@serge_kozl",
      avatar: "fa-user",
      status: "был(а) 2 часа назад",
      unread: 0,
      messages: [
        { from: "them", text: "Прочитал твою новую статью, отлично!", time: "вчера 18:20" },
        { from: "me", text: "Спасибо, рад что понравилось!", time: "вчера 18:45" },
      ],
    },
    {
      id: 5,
      name: "Анна Морозова",
      nick: "@anna_moroz",
      avatar: "fa-user",
      status: "онлайн",
      unread: 0,
      messages: [
        { from: "them", text: "Привет! Ты не мог бы скинуть ссылку на источник?", time: "09:10" },
        { from: "me", text: "Да, конечно, сейчас скину.", time: "09:15" },
      ],
    },
  ];

  const page = document.getElementById("messengerPage");
  const chatListItems = document.getElementById("chatListItems");
  const chatMessages = document.getElementById("chatMessages");
  const chatContactName = document.getElementById("chatContactName");
  const chatContactStatus = document.getElementById("chatContactStatus");
  const chatInput = document.getElementById("chatInput");
  const chatForm = document.getElementById("chatForm");
  const chatSendBtn = document.getElementById("chatSendBtn");
  const chatCount = document.getElementById("chatCount");
  const newChatBtn = document.getElementById("newChatBtn");
  const addChatModal = document.getElementById("addChatModal");
  const addChatModalClose = document.getElementById("addChatModalClose");
  const searchUsersInput = document.getElementById("searchUsersInput");
  const searchResults = document.getElementById("searchResults");
  const chatBackBtn = document.getElementById("chatBackBtn");

  if (!page || !chatListItems) return;

  let currentContactId = null;
  let activeChatContact = null;

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");

  const getTime = () => {
    const date = new Date();
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
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

  const lastPreview = (contact) => {
    if (!contact.messages.length) return { text: "Начните общение", time: "" };
    const last = contact.messages[contact.messages.length - 1];
    return { text: last.text, time: last.time };
  };

  const emptyState = (html) => `<div class="inbox-empty">${html}</div>`;

  const resetWindow = (title, hint) => {
    currentContactId = null;
    activeChatContact = null;
    chatContactName.textContent = title;
    chatContactStatus.textContent = "";
    chatContactStatus.classList.remove("is-online");
    chatMessages.innerHTML = emptyState(hint);
    chatInput.disabled = true;
    chatSendBtn.disabled = true;
    page.classList.remove("is-chat-open");
  };

  const renderChatList = () => {
    chatListItems.innerHTML = "";
    chatCount.textContent = String(contacts.length);
    if (!contacts.length) {
      chatListItems.innerHTML = emptyState("Нет чатов. Нажмите + чтобы начать.");
      return;
    }

    contacts.forEach((contact) => {
      const preview = lastPreview(contact);
      const item = document.createElement("div");
      item.className = `chat-item${currentContactId === contact.id ? " active" : ""}`;
      item.dataset.id = String(contact.id);
      item.innerHTML = `
        <div class="avatar"><i class="fas ${escapeHtml(contact.avatar)}"></i></div>
        <div class="info">
          <div class="name">${escapeHtml(contact.name)} <span>${escapeHtml(preview.time)}</span></div>
          <div class="last-msg">${escapeHtml(preview.text)}</div>
        </div>
        ${contact.unread > 0 ? `<div class="unread">${contact.unread}</div>` : ""}
        <button class="delete-chat" type="button" data-id="${contact.id}" title="Удалить чат" aria-label="Удалить чат">
          <i class="fas fa-trash"></i>
        </button>
      `;
      item.addEventListener("click", (event) => {
        if (event.target.closest(".delete-chat")) return;
        openChat(contact.id);
      });
      item.querySelector(".delete-chat").addEventListener("click", (event) => {
        event.stopPropagation();
        deleteChat(contact.id);
      });
      chatListItems.appendChild(item);
    });
  };

  const renderMessages = (messages) => {
    chatMessages.innerHTML = "";
    if (!messages.length) {
      chatMessages.innerHTML = emptyState('<i class="fas fa-comment"></i> Нет сообщений. Напишите что-нибудь!');
      return;
    }
    messages.forEach((msg) => {
      const bubble = document.createElement("div");
      bubble.className = `message ${msg.from === "me" ? "outgoing" : "incoming"}`;
      bubble.innerHTML = `${escapeHtml(msg.text)} <span class="time">${escapeHtml(msg.time)}</span>`;
      chatMessages.appendChild(bubble);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const openChat = (contactId) => {
    const contact = contacts.find((item) => item.id === contactId);
    if (!contact) return;
    currentContactId = contactId;
    activeChatContact = contact;
    contact.unread = 0;
    chatContactName.textContent = contact.name;
    chatContactStatus.textContent = contact.status || "";
    chatContactStatus.classList.toggle("is-online", contact.status === "онлайн");
    renderMessages(contact.messages);
    chatInput.disabled = false;
    chatSendBtn.disabled = false;
    page.classList.add("is-chat-open");
    chatInput.focus();
    renderChatList();
  };

  const deleteChat = (contactId) => {
    const contact = contacts.find((item) => item.id === contactId);
    if (!contact) return;
    if (!window.confirm(`Удалить чат с ${contact.name}?`)) return;
    const index = contacts.findIndex((item) => item.id === contactId);
    contacts.splice(index, 1);
    if (currentContactId === contactId) {
      resetWindow("Выберите диалог", '<i class="fas fa-arrow-left"></i> Выберите чат из списка слева');
    }
    renderChatList();
    showToast("Чат удалён");
  };

  const sendMessage = () => {
    if (!activeChatContact) return;
    const text = chatInput.value.trim();
    if (!text) return;
    const time = getTime();
    const contactId = activeChatContact.id;
    activeChatContact.messages.push({ from: "me", text, time });
    renderMessages(activeChatContact.messages);
    renderChatList();
    chatInput.value = "";
    chatInput.focus();

    window.setTimeout(() => {
      if (!activeChatContact || activeChatContact.id !== contactId) return;
      const replies = ["Отлично!", "Понял, спасибо!", "Интересно...", "Договорились!", "Хорошо, до встречи!"];
      activeChatContact.messages.push({
        from: "them",
        text: replies[Math.floor(Math.random() * replies.length)],
        time: getTime(),
      });
      renderMessages(activeChatContact.messages);
      renderChatList();
      showToast(`Новое сообщение от ${activeChatContact.name}`);
    }, 1500 + Math.random() * 2000);
  };

  const closeAddModal = () => {
    addChatModal.classList.remove("open");
    document.body.style.overflow = "";
  };

  const openAddModal = () => {
    addChatModal.classList.add("open");
    document.body.style.overflow = "hidden";
    searchUsersInput.value = "";
    searchResults.innerHTML = '<li class="no-results">Введите запрос для поиска</li>';
    searchUsersInput.focus();
  };

  const addNewChat = (userId) => {
    if (contacts.some((item) => item.id === userId)) {
      showToast("Чат с этим пользователем уже есть");
      return;
    }
    const user = allUsers.find((item) => item.id === userId);
    if (!user) return;
    const contact = {
      id: user.id,
      name: user.name,
      nick: user.nick,
      avatar: user.avatar,
      status: "онлайн",
      unread: 0,
      messages: [],
    };
    contacts.push(contact);
    renderChatList();
    openChat(contact.id);
    closeAddModal();
    showToast(`Чат с ${user.name} создан`);
  };

  newChatBtn.addEventListener("click", openAddModal);
  addChatModalClose.addEventListener("click", closeAddModal);
  addChatModal.addEventListener("click", (event) => {
    if (event.target === addChatModal) closeAddModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && addChatModal.classList.contains("open")) closeAddModal();
  });

  searchUsersInput.addEventListener("input", () => {
    const query = searchUsersInput.value.trim().toLowerCase();
    if (!query) {
      searchResults.innerHTML = '<li class="no-results">Введите запрос для поиска</li>';
      return;
    }
    const existingIds = contacts.map((item) => item.id);
    const results = allUsers.filter(
      (user) =>
        (user.name.toLowerCase().includes(query) || user.nick.toLowerCase().includes(query)) &&
        !existingIds.includes(user.id)
    );
    if (!results.length) {
      searchResults.innerHTML = '<li class="no-results">Пользователи не найдены</li>';
      return;
    }
    searchResults.innerHTML = "";
    results.forEach((user) => {
      const item = document.createElement("li");
      item.className = "search-result-item";
      item.innerHTML = `
        <div class="avatar"><i class="fas ${escapeHtml(user.avatar)}"></i></div>
        <div class="info">
          <div class="name">${escapeHtml(user.name)}</div>
          <div class="nick">${escapeHtml(user.nick)}</div>
        </div>
        <button class="add-btn" type="button" data-id="${user.id}"><i class="fas fa-plus"></i> Добавить</button>
      `;
      item.addEventListener("click", () => addNewChat(user.id));
      searchResults.appendChild(item);
    });
  });

  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage();
  });

  chatBackBtn?.addEventListener("click", () => {
    page.classList.remove("is-chat-open");
  });

  if (contacts.length) {
    openChat(contacts[0].id);
    if (window.matchMedia("(max-width: 860px)").matches) {
      page.classList.remove("is-chat-open");
    }
  } else {
    resetWindow("Нет чатов", '<i class="fas fa-plus-circle"></i> Нажмите + чтобы создать новый чат');
  }
  renderChatList();
})();
