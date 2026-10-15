/* EcoWaste — vanilla JavaScript interactions */
document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Mobile navigation: toggle, close after selecting a section, and support Escape.
  const menuToggle = $(".menu-toggle");
  const navLinks = $("#nav-links");
  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  }
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
  });
  $$("#nav-links a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeMenu(); });

  // Highlight the current section in the navigation.
  const sections = $$("main section[id]");
  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        $$("#nav-links a[href^='#']").forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => navObserver.observe(section));
  }

  // Animate content into view and count sample metrics once visible.
  const countElements = $$("[data-count]");
  function animateCounter(element) {
    if (element.dataset.counted === "true") return;
    element.dataset.counted = "true";
    const target = Number(element.dataset.count);
    const suffix = element.dataset.suffix || "";
    const decimals = Number(element.dataset.decimals || 0);
    const duration = 1200;
    const start = performance.now();
    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      element.textContent = value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const revealItems = $$(".waste-card,.solution-card,.blog-card,.impact-stat,.intro-copy,.intro-visual,.form-card,.sorter-panel,.faq-item");
  revealItems.forEach(item => item.classList.add("js-reveal"));
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        const counter = entry.target.matches("[data-count]") ? entry.target : $("[data-count]", entry.target);
        if (counter) animateCounter(counter);
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
    countElements.forEach(counter => {
      if (!counter.closest(".js-reveal")) {
        const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) { animateCounter(counter); counterObserver.unobserve(counter); }
        }), { threshold: 0.3 });
        counterObserver.observe(counter);
      }
    });
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
    countElements.forEach(animateCounter);
  }

  // Waste sorting guide: item names, practical directions, and safety notes.
  const wasteItems = [
    { names: ["plastic bottle", "water bottle", "soda bottle"], title: "Plastic bottle", category: "Dry recyclable — if accepted locally", guidance: "Empty the bottle and follow your local recycling rules. Rinse if required; replace the cap only if your local programme accepts it that way.", bin: "blue", warning: "" },
    { names: ["banana peel", "food scraps", "vegetable scraps", "fruit peel"], title: "Banana peel / food scraps", category: "Organic waste", guidance: "Place in an organic-waste collection or home compost system where accepted. Keep plastic wrappers and stickers out of the compost.", bin: "green", warning: "" },
    { names: ["newspaper", "paper", "cardboard", "paper box"], title: "Newspaper / clean paper", category: "Dry recyclable — if clean and accepted", guidance: "Keep paper dry and free of food or oil. Wet, heavily soiled, or laminated paper may not be accepted by your local recycler.", bin: "blue", warning: "" },
    { names: ["battery", "batteries", "lithium battery", "button battery"], title: "Battery", category: "Special collection", guidance: "Take batteries to a designated battery drop-off or authorised collection point. Keep terminals protected where recommended, and never puncture, crush, or burn a battery.", bin: "amber", warning: "Do not place loose batteries in ordinary household waste. If a lithium battery is swollen, hot, leaking, or damaged, avoid handling it and seek local hazardous-waste guidance." },
    { names: ["glass jar", "glass bottle", "jar", "glass"], title: "Glass jar / bottle", category: "Glass recycling — if accepted locally", guidance: "Empty and rinse the container. Check whether your local service accepts glass and whether lids or broken glass require separate handling.", bin: "blue", warning: "Wrap broken glass securely and follow local instructions; do not put loose shards into a recycling bin." },
    { names: ["old phone", "mobile phone", "phone", "laptop", "computer", "charger", "electronics", "earphones"], title: "Electronic waste", category: "Authorised e-waste collection", guidance: "Use an authorised e-waste collection point or retailer take-back programme. Back up and erase personal data from devices where possible before handing them over.", bin: "amber", warning: "Do not dismantle electronics or put devices containing batteries into ordinary bins." },
    { names: ["light bulb", "fluorescent bulb", "tube light"], title: "Light bulb / tube light", category: "Special collection where required", guidance: "Check local rules for lamp recycling or hazardous-waste collection. Keep bulbs intact and package carefully for transport.", bin: "amber", warning: "Some fluorescent lamps contain mercury. If one breaks, keep people away and follow local clean-up guidance." },
    { names: ["paint", "paint tin", "cleaning chemical", "pesticide", "chemical"], title: "Household chemical", category: "Hazardous-waste guidance", guidance: "Keep the product in its original labelled container and check local hazardous-waste collection instructions. Never pour chemicals into drains or mix unknown products.", bin: "amber", warning: "Do not place chemicals in ordinary bins or pour them into drains unless the product label and local authority explicitly allow it." },
    { names: ["clothes", "old clothes", "textile", "shoes"], title: "Clothing / textiles", category: "Reuse or textile collection", guidance: "Donate wearable items in good condition. For worn-out textiles, check for a textile take-back or recycling programme before using residual waste.", bin: "green", warning: "" },
    { names: ["diaper", "nappy", "sanitary waste", "tissue", "used tissue"], title: "Hygiene / residual waste", category: "Residual waste — follow local rules", guidance: "Wrap and dispose of hygiene waste according to municipal guidance. Keep it separate from recyclable materials and compost unless a specific service accepts it.", bin: "grey", warning: "" },
    { names: ["steel can", "aluminium can", "metal can", "tin can"], title: "Metal can", category: "Dry recyclable — if accepted locally", guidance: "Empty and rinse the can, then place it in the locally designated metal recycling stream if accepted.", bin: "blue", warning: "" },
    { names: ["pizza box", "greasy cardboard"], title: "Greasy pizza box", category: "Depends on local rules", guidance: "Clean, dry cardboard may be recyclable, but food-soiled sections can contaminate a paper stream. Separate clean parts if your local programme allows.", bin: "grey", warning: "Do not assume greasy cardboard is recyclable; check your local service's guidance." }
  ];
  const searchInput = $("#waste-search");
  const sortResult = $("#sort-result");
  function findWaste(query) {
    const cleaned = query.toLowerCase().trim();
    if (!cleaned) return null;
    return wasteItems.find(item => item.names.some(name => name === cleaned || cleaned.includes(name) || name.includes(cleaned)));
  }
  function showWaste(query) {
    const item = findWaste(query);
    if (!item) {
      sortResult.innerHTML = `<div class="result-placeholder"><span>⌕</span><strong>No exact match found</strong><p>Try a common item such as plastic bottle, banana peel, newspaper, battery, glass jar, or old phone. When unsure, check local municipal guidance.</p></div>`;
      return;
    }
    sortResult.innerHTML = `<span class="result-category">${item.category}</span><h4 class="result-title">${item.title}</h4><p class="result-guidance">${item.guidance}</p>${item.warning ? `<p class="result-warning">⚠ ${item.warning}</p>` : ""}`;
  }
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim().length >= 2) showWaste(searchInput.value);
    else sortResult.innerHTML = `<div class="result-placeholder"><span>♻</span><strong>Your sorting tip will appear here</strong><p>Choose an item above or enter a waste item in the search box.</p></div>`;
  });
  $$("#item-chips button").forEach(button => button.addEventListener("click", () => {
    searchInput.value = button.dataset.item;
    showWaste(button.dataset.item);
    searchInput.focus();
  }));

  // Accessible modal for waste categories and article details.
  const dialog = $("#detail-dialog");
  const dialogTitle = $("#dialog-title");
  const dialogContent = $("#dialog-content");
  const closeDialog = () => { if (dialog.open) dialog.close(); };
  $(".dialog-close").addEventListener("click", closeDialog);
  $(".dialog-done").addEventListener("click", closeDialog);
  dialog.addEventListener("click", event => { if (event.target === dialog) closeDialog(); });
  function openDialog(title, html) {
    dialogTitle.textContent = title;
    dialogContent.innerHTML = html;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else alert(`${title}\n\n${dialogContent.textContent}`);
  }
  const typeDetails = {
    organic: ["Organic Waste", "Keep food scraps and garden trimmings separate where an organic collection or composting service exists. Avoid adding meat, dairy, oils, or pet waste to a home compost system unless that system specifically supports them.", ["Use a local food-waste collection if available.", "Compost suitable scraps in a balanced, well-managed system.", "Keep packaging and plastic out of organics."]],
    recyclable: ["Recyclable Waste", "Recycling rules vary by facility. Clean, dry, correctly sorted materials are more likely to be recovered.", ["Check accepted materials with your local recycler.", "Empty and rinse containers where requested.", "Keep paper dry and separate from food waste."]],
    plastic: ["Plastic Waste", "The most effective first step is often to avoid unnecessary single-use plastics. Not every plastic item or resin type is accepted for recycling.", ["Carry a reusable bottle and bag.", "Check local rules rather than relying only on a recycling symbol.", "Never burn plastic waste."]],
    electronic: ["Electronic Waste", "Electronic devices can contain valuable materials and components that require controlled handling. Use authorised e-waste collection or retailer take-back programmes.", ["Back up and erase personal data where possible.", "Do not dismantle devices or batteries yourself.", "Keep damaged or swollen batteries away from heat and seek specialist advice."]],
    hazardous: ["Hazardous Waste", "Some batteries, chemicals, paints, lamps, and household products need special collection. Keep products labelled and do not mix chemicals.", ["Follow product-label and municipal instructions.", "Keep hazardous items away from children and pets.", "Never pour unknown chemicals into drains or burn them."]],
    general: ["General Waste", "Residual waste is material that cannot be reused or accepted for recovery through available local services. Correct sorting reduces contamination.", ["Check whether an item has a reuse or take-back option.", "Keep hazardous and electronic waste out of general bins.", "Follow collection and packaging instructions for residual waste."]]
  };
  $$(".learn-type").forEach(button => button.addEventListener("click", () => {
    const details = typeDetails[button.dataset.type];
    openDialog(details[0], `<p>${details[1]}</p><h3>Good next steps</h3><ul>${details[2].map(tip => `<li>${tip}</li>`).join("")}</ul><p><strong>Remember:</strong> local municipal rules take priority over general advice.</p>`);
  }));
  const articles = {
    reduce: ["10 Simple Ways to Reduce Household Waste", "<p>Waste prevention starts before you throw anything away. Buy only what you need, plan meals, store food well, and choose durable items where possible.</p><ul><li>Carry a reusable bag, bottle, and cup.</li><li>Repair, borrow, or buy second-hand when practical.</li><li>Choose products with less packaging.</li><li>Donate useful items instead of discarding them.</li><li>Keep a small recycling station at home.</li></ul><p>Pick one change that fits your routine and build on it over time.</p>"],
    compost: ["How to Start Composting at Home", "<p>Composting turns suitable organic material into a useful soil amendment. A simple system needs a suitable container, air, moisture, and a balance of green and brown materials.</p><ul><li>Greens can include fruit and vegetable scraps or fresh plant trimmings.</li><li>Browns can include dry leaves and untreated shredded paper, where suitable.</li><li>Keep the pile damp, not waterlogged, and allow airflow.</li><li>Check local guidance for meat, dairy, oils, and pet waste.</li></ul><p>If home composting is not practical, look for a local organics collection programme.</p>"],
    segregation: ["Why Waste Segregation Matters", "<p>Mixing all waste together can contaminate materials that could otherwise be recovered. Separation at the point where waste is created makes handling clearer and safer.</p><ul><li>Keep organics separate where collection is available.</li><li>Keep recyclable containers empty and clean as requested.</li><li>Use designated channels for batteries and electronics.</li><li>Learn the rules for your municipality and building.</li></ul><p>Bin colours and collection rules differ by location, so follow your local service's instructions.</p>"],
    plastic: ["The Environmental Impact of Plastic Pollution", "<p>Plastic pollution can persist in the environment and harm wildlife when litter escapes into waterways and natural habitats. Reducing unnecessary use and improving collection both matter.</p><ul><li>Choose reusable products when practical.</li><li>Prevent litter and secure waste until collection.</li><li>Sort packaging according to local recycling rules.</li><li>Support refill, reuse, and responsible take-back options.</li></ul><p>Recycling helps, but reducing avoidable plastic use is an important first step.</p>"]
  };
  $$(".read-more").forEach(button => button.addEventListener("click", () => {
    const article = articles[button.dataset.article];
    openDialog(article[0], article[1]);
  }));

  // Accessible FAQ accordion; only one answer is expanded at a time.
  $$(".faq-question").forEach(button => button.addEventListener("click", () => {
    const willOpen = button.getAttribute("aria-expanded") !== "true";
    $$(".faq-question").forEach(other => {
      other.setAttribute("aria-expanded", "false");
      other.closest(".faq-item").classList.remove("open");
    });
    if (willOpen) {
      button.setAttribute("aria-expanded", "true");
      button.closest(".faq-item").classList.add("open");
    }
  }));

  // Shared form helpers: validate locally and never transmit or store data.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function setFormMessage(element, text, type) {
    element.textContent = text;
    element.className = `form-message visible ${type}`;
  }
  function validateFields(form, fieldIds) {
    let valid = true;
    fieldIds.forEach(id => {
      const input = document.getElementById(id);
      const field = input.closest(".field");
      const error = $(".field-error", field);
      let message = "";
      if (input.required && !input.value.trim()) message = "This field is required.";
      else if (input.type === "email" && !emailPattern.test(input.value.trim())) message = "Enter a valid email address.";
      else if (input.type === "tel" && input.value.replace(/\D/g, "").length < 7) message = "Enter a valid phone number.";
      else if (input.type === "date" && input.value && input.value < new Date().toISOString().slice(0, 10)) message = "Choose today or a future date.";
      field.classList.toggle("invalid", Boolean(message));
      if (error) error.textContent = message;
      input.setAttribute("aria-invalid", String(Boolean(message)));
      if (message) valid = false;
    });
    return valid;
  }
  $$("form .field input, form .field select, form .field textarea").forEach(input => {
    input.addEventListener("input", () => {
      const field = input.closest(".field");
      if (field) {
        field.classList.remove("invalid");
        const error = $(".field-error", field);
        if (error) error.textContent = "";
        input.setAttribute("aria-invalid", "false");
      }
    });
  });
  const dateInput = $("#pickup-date");
  dateInput.min = new Date().toISOString().slice(0, 10);
  $("#collection-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = $("#collection-message");
    status.className = "form-message";
    const valid = validateFields(form, ["full-name", "email", "phone", "waste-type", "quantity", "pickup-date", "address"]);
    if (!valid) {
      setFormMessage(status, "Please correct the highlighted fields. No information has been sent.", "error");
      const firstInvalid = $(".field.invalid input, .field.invalid select, .field.invalid textarea", form);
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    const name = $("#full-name").value.trim();
    const type = $("#waste-type").value;
    const date = $("#pickup-date").value;
    setFormMessage(status, `Demo preview ready for ${name}: ${type}, preferred date ${date}. This is not a booking; your information was not sent or saved.`, "success");
    showToast("Demo request validated — nothing was sent or stored.");
  });

  $("#contact-form").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const status = $("#contact-status");
    status.className = "form-message";
    const valid = validateFields(form, ["contact-name", "contact-email", "contact-subject", "contact-message"]);
    if (!valid) {
      setFormMessage(status, "Please fill in the required fields correctly. Nothing has been sent.", "error");
      const firstInvalid = $(".field.invalid input, .field.invalid textarea", form);
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    setFormMessage(status, `Thanks, ${$("#contact-name").value.trim()}. Your message passed the demo validation, but it has not been sent or saved.`, "success");
    showToast("Contact form validated — demo only.");
    form.reset();
  });

  $("#newsletter-form").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("#newsletter-email");
    const status = $("#newsletter-status");
    if (!emailPattern.test(input.value.trim())) {
      status.textContent = "Please enter a valid email address.";
      status.style.color = "#ffd1bd";
      input.focus();
      return;
    }
    status.textContent = "Demo only: signup preview complete. No email was stored.";
    status.style.color = "#d7f36b";
    input.value = "";
  });

  // Current year, back-to-top, and a lightweight toast.
  $("#current-year").textContent = new Date().getFullYear();
  const toast = $("#toast");
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
  }
  $(".back-top").addEventListener("click", event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  });

  // If an external photo fails, keep a pleasant fallback rather than a broken icon.
  $$("img").forEach(img => img.addEventListener("error", () => {
    img.style.display = "none";
    const parent = img.parentElement;
    if (parent) parent.style.background = "linear-gradient(135deg, #dcebd2, #9bbd91)";
  }, { once: true }));
});
