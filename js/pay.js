(() => {
  const plans = {
    reader: { name: "Читатель", month: 0, year: 0 },
    plus: { name: "Plus", month: 299, year: 2390 },
    pro: { name: "Исследователь", month: 799, year: 6390 },
  };

  const formatPrice = (value) =>
    value === 0 ? "0 ₽" : `${value.toLocaleString("ru-RU")} ₽`;

  const periodLabel = (planId, cycle) => {
    if (planId === "reader") return "навсегда";
    return cycle === "year" ? "в год" : "в месяц";
  };

  const page = document.getElementById("payPage");
  if (!page) return;

  const planButtons = [...document.querySelectorAll(".pay-plan")];
  const cycleButtons = [...document.querySelectorAll(".pay-toggle button")];
  const summaryPlan = document.getElementById("summaryPlan");
  const summaryPrice = document.getElementById("summaryPrice");
  const payAmount = document.getElementById("payAmount");
  const form = document.getElementById("payForm");
  const success = document.getElementById("paySuccess");
  const successText = document.getElementById("paySuccessText");
  const cardNumber = document.getElementById("cardNumber");
  const cardExpiry = document.getElementById("cardExpiry");
  const cardCvc = document.getElementById("cardCvc");

  let selected = "plus";
  let cycle = "month";

  const refreshPrices = () => {
    planButtons.forEach((button) => {
      const id = button.dataset.plan;
      const plan = plans[id];
      const priceEl = button.querySelector(".price");
      if (!plan || !priceEl) return;
      const amount = cycle === "year" ? plan.year : plan.month;
      priceEl.innerHTML = `${formatPrice(amount)}<small>${periodLabel(id, cycle)}</small>`;
    });

    const current = plans[selected];
    const amount = cycle === "year" ? current.year : current.month;
    summaryPlan.textContent = current.name;
    summaryPrice.textContent = formatPrice(amount);
    payAmount.textContent = amount === 0 ? "бесплатно" : formatPrice(amount);
  };

  planButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selected = button.dataset.plan;
      planButtons.forEach((item) => item.classList.toggle("is-selected", item === button));
      refreshPrices();
    });
  });

  cycleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      cycle = button.dataset.cycle;
      cycleButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      refreshPrices();
    });
  });

  cardNumber?.addEventListener("input", () => {
    const digits = cardNumber.value.replace(/\D/g, "").slice(0, 16);
    cardNumber.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  });

  cardExpiry?.addEventListener("input", () => {
    const digits = cardExpiry.value.replace(/\D/g, "").slice(0, 4);
    cardExpiry.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  });

  cardCvc?.addEventListener("input", () => {
    cardCvc.value = cardCvc.value.replace(/\D/g, "").slice(0, 4);
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const current = plans[selected];
    form.classList.add("is-hidden");
    success.classList.add("is-open");
    successText.textContent =
      current.month === 0
        ? "Тариф «Читатель» активен. Можно читать статьи и пользоваться базовым ChatRoyt."
        : `Тариф «${current.name}» активен. Можно читать, слушать и спрашивать ChatRoyt без пауз.`;
  });

  refreshPrices();
})();
