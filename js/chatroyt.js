(() => {
  const body = document.getElementById("roytBody");
  const form = document.getElementById("roytForm");
  const input = document.getElementById("roytInput");
  const welcome = document.getElementById("roytWelcome");
  const newBtn = document.getElementById("roytNew");
  if (!body || !form || !input) return;

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const answers = [
    {
      test: /лев|льв|саванн/i,
      text: "Лев (Panthera leo) — крупный хищник семейства кошачьих. Самцы отличаются гривой, живут прайдами в саваннах Африки. Могу открыть связанные статьи: экология саванн, биомеханика охоты, охрана вида. Читать вслух?",
    },
    {
      test: /нейрон|нейросет|ии|искусственн/i,
      text: "Нейросеть — модель, которая учится на примерах: слои «нейронов» преобразуют вход в ответ. Кратко: данные → обучение → предсказание. Есть статьи «Как работает нейросеть» и «История ИИ». Нужно проще или глубже, на уровне архитектуры?",
    },
    {
      test: /квант/i,
      text: "Квантовые вычисления используют кубиты: они могут быть в суперпозиции, а не только 0 или 1. Это не «очень быстрый обычный компьютер», а другой принцип для отдельных задач. Есть материал для начинающих — открыть саммари?",
    },
    {
      test: /матем/i,
      text: "Для обучения математике на Roytalex есть статьи и курсы: от базовой алгебры до анализа. Могу начать с понятного разбора или подобрать задачу по уровню. С чего удобнее: формулы, примеры или видеоурок?",
    },
    {
      test: /робот/i,
      text: "Робототехника шла от промышленных манипуляторов к автономным системам и ИИ-управлению. Ключевые вехи: Чарльз Бэббидж как идея вычислений, промышленные роботы XX века, современные нейросети в управлении. Открыть статью «История развития робототехники»?",
    },
  ];

  const fallback = [
    "Хороший вопрос. Вот краткое саммари и два связанных материала по теме Roytalex.",
    "Могу переформулировать сложный абзац проще — или прочитать его голосом.",
    "Нашёл актуальные тезисы. Открыть статью для обучения или углублённый обзор?",
  ];

  const replyTo = (text) => {
    const match = answers.find((item) => item.test.test(text));
    if (match) return match.text;
    return fallback[Math.floor(Math.random() * fallback.length)];
  };

  const addBubble = (role, text, typing = false) => {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble chat-bubble--${role}${typing ? " chat-bubble--typing" : ""}`;
    if (typing) {
      bubble.innerHTML = "<i></i><i></i><i></i>";
    } else {
      bubble.textContent = text;
    }
    body.appendChild(bubble);
    body.scrollTop = body.scrollHeight;
    return bubble;
  };

  const hideWelcome = () => {
    welcome?.remove();
  };

  const ask = async (text) => {
    const value = text.trim();
    if (!value) return;
    hideWelcome();
    addBubble("user", value);
    const typing = addBubble("bot", "", true);
    await wait(700 + Math.random() * 500);
    typing.remove();
    addBubble("bot", replyTo(value));
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value;
    input.value = "";
    ask(value);
  });

  document.querySelectorAll(".royt-chip, .royt-topic").forEach((el) => {
    el.addEventListener("click", () => {
      const prompt = el.dataset.prompt || el.textContent.trim();
      document.querySelectorAll(".royt-topic").forEach((topic) => {
        topic.classList.toggle("is-active", topic === el);
      });
      ask(prompt);
      input.focus();
    });
  });

  newBtn?.addEventListener("click", () => {
    body.innerHTML = "";
    if (welcome) {
      body.appendChild(welcome);
    } else {
      body.innerHTML = `
        <div class="royt-welcome" id="roytWelcome">
          <div class="mark"><i class="fas fa-robot"></i></div>
          <h1>ChatRoyt</h1>
          <p>Новый диалог. Задайте вопрос по статье.</p>
        </div>`;
    }
    document.querySelectorAll(".royt-topic").forEach((topic) => topic.classList.remove("is-active"));
    input.focus();
  });
})();
