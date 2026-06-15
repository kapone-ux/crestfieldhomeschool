const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const navSectionLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const fullscreenContainer = document.getElementById("fullscreenContainer");
const sections = document.querySelectorAll(".fullscreen-section");
const allNavigateLinks = document.querySelectorAll("[data-navigate]");

// Fullscreen Navigation System
let currentSection = "home";
let isTransitioning = false;

// Section order for keyboard navigation
const sectionOrder = ["home", "about", "programs", "homeschooling", "coding-courses", "partners", "why-parents-choose-crestfield", "ai-study-assistant", "gallery", "ice-skating", "blog", "testimonials", "admissions", "careers", "contact"];

// Open a specific section by ID - ensures only one section is visible at a time
function openSection(id) {
  // Remove active class from all sections
  document.querySelectorAll('.fullscreen-section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Add active class to target section
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    currentSection = id;
    updateActiveNav(id);
  }
}

function scrollToInSectionAnchor(link) {
  const href = link.getAttribute("href") || "";

  if (!href.startsWith("#")) {
    return;
  }

  const anchorId = href.slice(1);
  const anchor = document.getElementById(anchorId);

  if (anchor && anchorId !== currentSection) {
    window.setTimeout(() => {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }
}

// Initialize fullscreen navigation
function initFullscreenNav() {
  // Handle all navigation clicks - prevent default anchor behavior
  allNavigateLinks.forEach(link => {
    link.addEventListener("click", function(e) {
      e.preventDefault();
      const targetSection = this.getAttribute("data-navigate");
      if (targetSection && targetSection !== currentSection) {
        openSection(targetSection);
      }
      scrollToInSectionAnchor(this);
      // Close mobile menu if open
      header?.classList.remove("nav-open");
    });
  });

  // Keyboard navigation
  document.addEventListener("keydown", function(e) {
    if (isTransitioning) return;
    
    const currentIndex = sectionOrder.indexOf(currentSection);
    
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = Math.min(currentIndex + 1, sectionOrder.length - 1);
      if (nextIndex !== currentIndex) {
        openSection(sectionOrder[nextIndex]);
      }
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = Math.max(currentIndex - 1, 0);
      if (prevIndex !== currentIndex) {
        openSection(sectionOrder[prevIndex]);
      }
    }
  });

  // Set initial active section - make Home active by default
  openSection("home");
}

// Update active navigation link
function updateActiveNav(sectionId) {
  // Remove active class from all nav links
  navLinks.forEach(link => {
    link.classList.remove("is-active");
  });
  
  // Add active class to matching links
  allNavigateLinks.forEach(link => {
    if (link.getAttribute("data-navigate") === sectionId) {
      link.classList.add("is-active");
    }
  });
}

// Initialize fullscreen navigation
initFullscreenNav();

const navDropdowns = document.querySelectorAll(".nav-dropdown");
const navDropdownTriggers = document.querySelectorAll(".nav-dropdown-trigger");
const contactForm = document.querySelector("#contactForm");
const formNote = document.querySelector("#formNote");
const codingContactForm = document.querySelector("#codingContactForm");
const codingFormNote = document.querySelector("#codingFormNote");
const courseSearch = document.querySelector("#courseSearch");
const filterButtons = document.querySelectorAll(".filter-btn");
const courseCards = document.querySelectorAll(".course-card");
const emptyCourses = document.querySelector("#emptyCourses");
const counters = document.querySelectorAll(".counter");
const newsletterForm = document.querySelector("#newsletterForm");
const newsletterNote = document.querySelector("#newsletterNote");
const footerNewsletterForm = document.querySelector("#footerNewsletterForm");
const footerNewsletterNote = document.querySelector("#footerNewsletterNote");
const skatingGrid = document.querySelector("#skatingGrid");
const skatingTrack = document.querySelector("#skatingTrack");
const skatingEmpty = document.querySelector("#skatingEmpty");
const skatingLightbox = document.querySelector("#skatingLightbox");
const testimonialTrack = document.querySelector("#testimonialTrack");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
const aiAssistant = document.querySelector("#aiAssistant");
const aiLauncher = document.querySelector("#aiLauncher");
const aiChatPanel = document.querySelector("#aiChatPanel");
const aiClose = document.querySelector("#aiClose");
const aiMinimize = document.querySelector("#aiMinimize");
const aiThemeToggle = document.querySelector("#aiThemeToggle");
const aiChatForm = document.querySelector("#aiChatForm");
const aiChatInput = document.querySelector("#aiChatInput");
const aiMessages = document.querySelector("#aiMessages");
const aiNotification = document.querySelector("#aiNotification");
const careersSection = document.querySelector("#careers");
const careerFloatingApply = document.querySelector(".career-floating-apply");
const careerForm = document.querySelector("#careerForm");
const careerFormNote = document.querySelector("#careerFormNote");
const careerProgressBar = document.querySelector(".application-progress span");
const careerProgressLabel = document.querySelector("#careerProgressLabel");
const careerRevealItems = document.querySelectorAll(".career-reveal");
const fileDropLabels = document.querySelectorAll(".file-drop");
const consultationModal = document.querySelector("#consultationModal");
const consultationOpenButtons = document.querySelectorAll("[data-consultation-open]");
const consultationClose = document.querySelector("#consultationClose");
const consultationForm = document.querySelector("#consultationForm");
const consultationNote = document.querySelector("#consultationNote");
const feeTabs = document.querySelectorAll(".fee-tab");
const feePanels = document.querySelectorAll(".fee-panel");
const notesGrid = document.querySelector("#notesGrid");
const notesEmpty = document.querySelector("#notesEmpty");
const notesLoadMore = document.querySelector("#notesLoadMore");
const noteForm = document.querySelector("#noteForm");
const noteSubmitButton = document.querySelector("#noteSubmitButton");
const noteCancelButton = document.querySelector("#noteCancelButton");
const noteFormNote = document.querySelector("#noteFormNote");
const adminNoteList = document.querySelector("#adminNoteList");
const NOTES_STORAGE_KEY = "crestfield-notes-updates";
const NOTES_PAGE_SIZE = 4;
const NOTE_PREVIEW_LENGTH = 220;
const DEFAULT_NOTES = [
  {
    id: "default-admissions",
    title: "Admissions consultations are open",
    content:
      "Families can book a consultation for tuition, homeschooling, Cambridge, Pearson Edexcel, IGCSE, A Levels, Checkpoints, and online learning support.",
    date: "2026-05-21"
  },
  {
    id: "default-online-learning",
    title: "Live online homeschooling support",
    content:
      "Crestfield students can learn through structured online classes, guided assignments, recorded lesson support, and regular parent communication.",
    date: "2026-05-20"
  },
  {
    id: "default-coding",
    title: "Coding and technology course enquiries",
    content:
      "Learners can enquire about Web Development, Python Programming, Cyber Security, Artificial Intelligence, Graphic Design, and Digital Marketing programs.",
    date: "2026-05-18"
  }
];
let visibleNotesCount = NOTES_PAGE_SIZE;
const skatingCaptions = [
  "Students enjoying ice skating",
  "Fun outdoor learning experiences",
  "Memories beyond the classroom",
  "Building confidence through adventure"
];
const skatingImages = [
  "images/site/ice-skating-wide.jpg",
  "images/site/ice-skating-activity.jpg",
  "images/site/ice-skating-team-practice.jpg",
  "images/site/ice-skating-students.jpg",
  "images/site/ice-skating-portrait.jpg",
  "images/site/ice-skating-coaching.jpg"
];

const aiReplies = [
  {
    keywords: ["apply", "admission", "admissions", "enroll", "application"],
    reply:
      "Admissions start with a short conversation about the learner's class level, curriculum, subjects, schedule, and goals. You can use the Apply Now button or visit the admissions section, and our team will guide the next step."
  },
  {
    keywords: ["cambridge", "curriculum", "igcse", "a levels", "checkpoint", "checkpoints", "pearson", "edexcel"],
    reply:
      "Crestfield Tuition & Homeschool supports Cambridge, Pearson Edexcel, IGCSE, A Levels, and Checkpoints pathways with tuition, revision, exam preparation, and structured academic guidance."
  },
  {
    keywords: ["homeschool", "homeschooling", "home school", "home learning"],
    reply:
      "Our homeschooling support gives learners a structured study plan, guided lessons, assignments, progress feedback, and parent communication. Students can learn online or with in-person support depending on their needs."
  },
  {
    keywords: ["coding", "technology", "python", "web", "cyber", "ai", "graphic", "digital marketing"],
    reply:
      "Crestfield Tuition & Homeschool offers practical technology courses including Web Development, Python Programming, Cyber Security, Artificial Intelligence, Graphic Design, and Digital Marketing. Beginners are welcome."
  },
  {
    keywords: ["fee", "fees", "cost", "price", "pricing", "payment"],
    reply:
      "Fee details depend on the program, number of subjects, learning mode, and schedule. Share the learner's program interest and our admissions team can prepare the best fee guidance."
  },
  {
    keywords: ["support", "student", "help", "online", "learning", "guidance"],
    reply:
      "Students receive academic support through guided lessons, feedback, exam preparation, online learning help, and subject-specific coaching. We can recommend support after understanding the learner's current needs."
  },
  {
    keywords: ["recommend", "course", "program", "subject"],
    reply:
      "For course recommendations, tell us the student's age or class level, current curriculum, strongest subjects, and the area where they need support. We can then suggest tuition, homeschooling, exam prep, online learning, or coding options."
  },
  {
    keywords: ["contact", "phone", "email", "whatsapp", "location", "call"],
    reply:
      "You can contact Crestfield Tuition & Homeschool in Ruiru, Kiambu by phone or WhatsApp on +254 758 219 179, or email hrcrestfieldschool@gmail.com."
  },
  {
    keywords: ["schedule", "consultation", "meeting", "appointment", "book"],
    reply:
      "Yes, you can schedule a consultation with the admissions team. Share your preferred time, learner details, and program interest, or use the WhatsApp button for the fastest response."
  }
];

const scrollAiMessages = () => {
  if (aiMessages) {
    aiMessages.scrollTop = aiMessages.scrollHeight;
  }
};

const addAiMessage = (message, sender = "bot") => {
  if (!aiMessages) {
    return null;
  }

  const article = document.createElement("article");
  article.className = `ai-message ai-message-${sender}`;

  if (sender === "bot") {
    const avatar = document.createElement("div");
    avatar.className = "ai-message-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = "AI";
    article.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "ai-bubble";
  const text = document.createElement("p");
  text.textContent = message;
  bubble.appendChild(text);
  article.appendChild(bubble);
  aiMessages.appendChild(article);
  scrollAiMessages();

  return article;
};

const showAiTyping = () => {
  if (!aiMessages) {
    return null;
  }

  const article = document.createElement("article");
  article.className = "ai-message ai-message-bot ai-typing";

  const avatar = document.createElement("div");
  avatar.className = "ai-message-avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = "AI";

  const bubble = document.createElement("div");
  bubble.className = "ai-bubble";

  for (let index = 0; index < 3; index += 1) {
    const dot = document.createElement("span");
    dot.className = "ai-typing-dot";
    bubble.appendChild(dot);
  }

  article.append(avatar, bubble);
  aiMessages.appendChild(article);
  scrollAiMessages();

  return article;
};

const getLocalAiReply = (message) => {
  const normalizedMessage = message.toLowerCase();
  const match = aiReplies.find((item) =>
    item.keywords.some((keyword) => normalizedMessage.includes(keyword))
  );

  if (match) {
    return match.reply;
  }

  return "I can help with admissions, Cambridge curriculum, homeschooling, coding courses, fees, student support, online learning, course recommendations, contact details, and consultation scheduling. What would you like to know?";
};

const getAssistantReply = async (message) => {
  // Replace this function later with an OpenAI, WhatsApp, or live-chat request.
  return getLocalAiReply(message);
};

const sendAiPrompt = async (message) => {
  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return;
  }

  addAiMessage(trimmedMessage, "user");
  const typingIndicator = showAiTyping();
  const reply = await getAssistantReply(trimmedMessage);

  window.setTimeout(() => {
    typingIndicator?.remove();
    addAiMessage(reply, "bot");
  }, 680);
};

const openAiAssistant = () => {
  aiAssistant?.classList.add("is-open");
  aiAssistant?.classList.remove("is-minimized");
  aiChatPanel?.setAttribute("aria-hidden", "false");
  aiLauncher?.setAttribute("aria-expanded", "true");
  aiNotification?.setAttribute("aria-hidden", "true");
  window.setTimeout(() => aiChatInput?.focus(), 180);
  scrollAiMessages();
};

const closeAiAssistant = () => {
  aiAssistant?.classList.remove("is-open", "is-minimized");
  aiChatPanel?.setAttribute("aria-hidden", "true");
  aiLauncher?.setAttribute("aria-expanded", "false");
};

const minimizeAiAssistant = () => {
  aiAssistant?.classList.add("is-minimized");
  aiChatPanel?.setAttribute("aria-hidden", "true");
  aiLauncher?.setAttribute("aria-expanded", "false");
};

aiLauncher?.addEventListener("click", () => {
  if (aiAssistant?.classList.contains("is-open") && !aiAssistant.classList.contains("is-minimized")) {
    minimizeAiAssistant();
  } else {
    openAiAssistant();
  }
});

aiClose?.addEventListener("click", closeAiAssistant);
aiMinimize?.addEventListener("click", minimizeAiAssistant);

aiThemeToggle?.addEventListener("click", () => {
  const isDark = aiAssistant?.classList.toggle("ai-dark");
  aiAssistant?.classList.toggle("ai-light", !isDark);
  aiThemeToggle.textContent = isDark ? "Dark" : "Light";
});

aiChatForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = aiChatInput?.value || "";
  aiChatForm.reset();
  sendAiPrompt(message);
});

document.querySelectorAll("[data-ai-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    openAiAssistant();
    sendAiPrompt(button.dataset.aiPrompt || "");
  });
});

const openConsultationModal = () => {
  consultationModal?.classList.add("is-open");
  consultationModal?.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  window.setTimeout(() => consultationModal?.querySelector("input")?.focus(), 160);
};

const closeConsultationModal = () => {
  consultationModal?.classList.remove("is-open");
  consultationModal?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

consultationOpenButtons.forEach((button) => {
  button.addEventListener("click", openConsultationModal);
});

consultationClose?.addEventListener("click", closeConsultationModal);

consultationModal?.addEventListener("click", (event) => {
  if (event.target === consultationModal) {
    closeConsultationModal();
  }
});

consultationForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!consultationForm.checkValidity()) {
    consultationForm.reportValidity();
    return;
  }

  const data = new FormData(consultationForm);
  const name = data.get("name");
  const consultationType = data.get("consultationType");
  const date = data.get("date");
  const time = data.get("time");

  consultationNote.textContent = `Thank you, ${name}. Your ${consultationType} request for ${date} at ${time} has been received. Admissions will contact you shortly.`;
  consultationForm.reset();
});

if ("IntersectionObserver" in window && careerRevealItems.length) {
  const careerRevealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  careerRevealItems.forEach((item) => careerRevealObserver.observe(item));
} else {
  careerRevealItems.forEach((item) => item.classList.add("is-visible"));
}

if ("IntersectionObserver" in window && careersSection && careerFloatingApply) {
  const careerApplyObserver = new IntersectionObserver(
    (entries) => {
      const isVisible = entries.some((entry) => entry.isIntersecting);
      careerFloatingApply.classList.toggle("is-visible", isVisible);
    },
    { threshold: 0.02 }
  );

  careerApplyObserver.observe(careersSection);
} else if (careerFloatingApply) {
  careerFloatingApply.classList.add("is-visible");
}

const updateCareerProgress = () => {
  if (!careerForm || !careerProgressBar || !careerProgressLabel) {
    return;
  }

  const fields = Array.from(careerForm.querySelectorAll("input, textarea"));
  const completedFields = fields.filter((field) => {
    if (field.type === "file") {
      return field.files.length > 0;
    }

    return field.value.trim().length > 0;
  });
  const progress = Math.round((completedFields.length / fields.length) * 100);

  careerProgressBar.style.width = `${progress}%`;
  careerProgressLabel.textContent = `Application progress: ${progress}%`;
};

fileDropLabels.forEach((label) => {
  const input = label.querySelector("input");
  const helperText = label.querySelector("span");
  const defaultText = helperText?.textContent || "";

  const setFileName = () => {
    const fileName = input?.files?.[0]?.name;
    label.classList.toggle("has-file", Boolean(fileName));
    if (helperText) {
      helperText.textContent = fileName ? `Selected file: ${fileName}` : defaultText;
    }
    updateCareerProgress();
  };

  label.addEventListener("dragover", (event) => {
    event.preventDefault();
    label.classList.add("is-dragging");
  });

  label.addEventListener("dragleave", () => {
    label.classList.remove("is-dragging");
  });

  label.addEventListener("drop", (event) => {
    event.preventDefault();
    label.classList.remove("is-dragging");

    if (input && event.dataTransfer?.files?.length) {
      input.files = event.dataTransfer.files;
      setFileName();
    }
  });

  input?.addEventListener("change", setFileName);
});

careerForm?.addEventListener("input", updateCareerProgress);

careerForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!careerForm.checkValidity()) {
    careerForm.reportValidity();
    return;
  }

  const data = new FormData(careerForm);
  const name = data.get("fullName");
  const specialization = data.get("specialization");

  careerFormNote.textContent = `Thank you, ${name}. Your ${specialization} application has been received for review.`;
  careerFormNote.classList.add("is-success");
  careerProgressBar.style.width = "100%";
  careerProgressLabel.textContent = "Application progress: 100%";
  careerForm.reset();

  fileDropLabels.forEach((label) => {
    label.classList.remove("has-file", "is-dragging");
    const helperText = label.querySelector("span");
    if (helperText) {
      helperText.textContent = label.textContent.includes("Passport")
        ? "Drag and drop a professional passport photo, or click to upload."
        : "Drag and drop your CV here, or click to upload PDF/DOC.";
    }
  });

  window.setTimeout(updateCareerProgress, 1200);
});

updateCareerProgress();

menuToggle?.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("nav-open");
    navDropdowns.forEach((dropdown) => dropdown.classList.remove("is-open"));
    menuToggle?.setAttribute("aria-expanded", "false");
    menuToggle?.setAttribute("aria-label", "Open navigation");
    navDropdownTriggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
  });
});

navDropdownTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const dropdown = trigger.closest(".nav-dropdown");
    const shouldOpen = !dropdown?.classList.contains("is-open");

    navDropdowns.forEach((item) => item.classList.remove("is-open"));
    navDropdownTriggers.forEach((item) => item.setAttribute("aria-expanded", "false"));

    if (dropdown && shouldOpen) {
      dropdown.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".nav-dropdown")) {
    navDropdowns.forEach((dropdown) => dropdown.classList.remove("is-open"));
    navDropdownTriggers.forEach((trigger) => trigger.setAttribute("aria-expanded", "false"));
  }
});

const updateActiveNavigation = () => {
  const sections = Array.from(navSectionLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  const activeSection = sections
    .filter((section) => section.getBoundingClientRect().top <= 120)
    .at(-1);

  navLinks.forEach((link) => link.classList.remove("is-active"));
  navDropdowns.forEach((dropdown) => dropdown.classList.remove("has-active-link"));

  if (!activeSection) {
    return;
  }

  navSectionLinks.forEach((link) => {
    if (link.getAttribute("href") === `#${activeSection.id}`) {
      link.classList.add("is-active");
      link.closest(".nav-dropdown")?.classList.add("has-active-link");
    }
  });
};

window.addEventListener("scroll", updateActiveNavigation, { passive: true });
updateActiveNavigation();

feeTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.feeTab;

    feeTabs.forEach((item) => item.classList.remove("active"));
    feePanels.forEach((panel) => panel.classList.remove("active"));

    tab.classList.add("active");
    document.querySelector(`#fee-${target}`)?.classList.add("active");
  });
});

const sendMailForm = (form, note, subjectPrefix) => {
  const data = new FormData(form);
  const name = data.get("name");
  const phone = data.get("phone");
  const program = data.get("program");
  const message = data.get("message") || "No extra message provided.";
  const subject = encodeURIComponent(`${subjectPrefix} from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nPhone: ${phone}\nProgram: ${program}\n\nMessage:\n${message}`
  );

  note.textContent = "Opening your email app with the enquiry details.";
  window.location.href = `mailto:hrcrestfieldschool@gmail.com?subject=${subject}&body=${body}`;
};

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMailForm(contactForm, formNote, "Admissions enquiry");
});

codingContactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMailForm(codingContactForm, codingFormNote, "Coding course enquiry");
});

let activeFilter = "all";

const filterCourses = () => {
  const query = courseSearch?.value.trim().toLowerCase() || "";
  let visibleCount = 0;

  courseCards.forEach((card) => {
    const category = card.dataset.category;
    const title = card.dataset.title || "";
    const matchesFilter = activeFilter === "all" || category === activeFilter;
    const matchesSearch = !query || title.includes(query);
    const isVisible = matchesFilter && matchesSearch;

    card.classList.toggle("is-hidden", !isVisible);
    if (isVisible) {
      visibleCount += 1;
    }
  });

  emptyCourses?.classList.toggle("is-visible", visibleCount === 0);
};

courseSearch?.addEventListener("input", filterCourses);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter || "all";
    filterCourses();
  });
});

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count || 0);
  const duration = 1100;
  const start = performance.now();

  const tick = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased).toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window && counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.45 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach(animateCounter);
}

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) {
      return;
    }

    document.querySelectorAll(".faq-list details").forEach((item) => {
      if (item !== detail) {
        item.removeAttribute("open");
      }
    });
  });
});

newsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(newsletterForm);
  const email = data.get("email");
  newsletterNote.textContent = `Thanks. Coding updates will be sent to ${email}.`;
  newsletterForm.reset();
});

footerNewsletterForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(footerNewsletterForm);
  const email = data.get("email");
  footerNewsletterNote.textContent = `Thanks. School updates will be sent to ${email}.`;
  footerNewsletterForm.reset();
});

const getTodayDateValue = () => new Date().toISOString().slice(0, 10);

const formatNoteDate = (dateValue) =>
  new Intl.DateTimeFormat("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(`${dateValue}T12:00:00`));

const getStoredNotes = () => {
  try {
    const notes = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY) || "[]");
    return Array.isArray(notes) && notes.length ? notes : DEFAULT_NOTES;
  } catch (error) {
    return DEFAULT_NOTES;
  }
};

const saveStoredNotes = (notes) => {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
};

const sortNotesNewestFirst = (notes) =>
  [...notes].sort((first, second) => {
    const dateDifference = new Date(second.date) - new Date(first.date);
    return dateDifference || Number(second.id) - Number(first.id);
  });

const setDefaultNoteDate = () => {
  if (noteForm?.elements.date && !noteForm.elements.date.value) {
    noteForm.elements.date.value = getTodayDateValue();
  }
};

const resetNoteForm = () => {
  noteForm?.reset();
  if (noteForm?.elements.noteId) {
    noteForm.elements.noteId.value = "";
  }
  if (noteSubmitButton) {
    noteSubmitButton.textContent = "Add Note";
  }
  if (noteCancelButton) {
    noteCancelButton.hidden = true;
  }
  setDefaultNoteDate();
};

const renderNotes = () => {
  if (!notesGrid) {
    return;
  }

  const notes = sortNotesNewestFirst(getStoredNotes());
  const visibleNotes = notes.slice(0, visibleNotesCount);

  notesGrid.innerHTML = "";
  notesEmpty?.classList.toggle("is-visible", notes.length === 0);
  if (notesLoadMore) {
    notesLoadMore.hidden = visibleNotesCount >= notes.length;
  }

  visibleNotes.forEach((note) => {
    const article = document.createElement("article");
    article.className = "note-card";

    const time = document.createElement("time");
    time.dateTime = note.date;
    time.textContent = formatNoteDate(note.date);

    const title = document.createElement("h3");
    title.textContent = note.title;

    const content = document.createElement("p");
    const isLongNote = note.content.length > NOTE_PREVIEW_LENGTH;
    content.textContent = isLongNote
      ? `${note.content.slice(0, NOTE_PREVIEW_LENGTH).trim()}...`
      : note.content;

    article.append(time, title, content);

    if (isLongNote) {
      const readMore = document.createElement("button");
      readMore.className = "note-read-more";
      readMore.type = "button";
      readMore.setAttribute("aria-expanded", "false");
      readMore.textContent = "Read More";
      readMore.addEventListener("click", () => {
        const expanded = readMore.getAttribute("aria-expanded") === "true";
        readMore.setAttribute("aria-expanded", String(!expanded));
        readMore.textContent = expanded ? "Read More" : "Show Less";
        content.textContent = expanded
          ? `${note.content.slice(0, NOTE_PREVIEW_LENGTH).trim()}...`
          : note.content;
      });
      article.appendChild(readMore);
    }

    notesGrid.appendChild(article);
  });
};

const renderAdminNotes = () => {
  if (!adminNoteList) {
    return;
  }

  const notes = sortNotesNewestFirst(getStoredNotes());
  adminNoteList.innerHTML = "";

  notes.forEach((note) => {
    const item = document.createElement("article");
    item.className = "admin-note-item";

    const summary = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = note.title;
    const date = document.createElement("time");
    date.dateTime = note.date;
    date.textContent = formatNoteDate(note.date);
    summary.append(title, date);

    const actions = document.createElement("div");
    actions.className = "admin-note-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.dataset.action = "edit";
    editButton.dataset.noteId = note.id;
    editButton.textContent = "Edit";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.noteId = note.id;
    deleteButton.textContent = "Delete";

    actions.append(editButton, deleteButton);
    item.append(summary, actions);
    adminNoteList.appendChild(item);
  });
};

const refreshNotesCms = () => {
  renderNotes();
  renderAdminNotes();
};

noteForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(noteForm);
  const noteId = data.get("noteId");
  const note = {
    id: noteId || String(Date.now()),
    title: String(data.get("title") || "").trim(),
    content: String(data.get("content") || "").trim(),
    date: data.get("date") || getTodayDateValue()
  };

  if (!note.title || !note.content) {
    noteFormNote.textContent = "Add a title and note content before saving.";
    return;
  }

  const notes = getStoredNotes();
  const updatedNotes = noteId
    ? notes.map((item) => (item.id === noteId ? note : item))
    : [...notes, note];

  saveStoredNotes(updatedNotes);
  visibleNotesCount = Math.max(visibleNotesCount, NOTES_PAGE_SIZE);
  refreshNotesCms();
  resetNoteForm();
  noteFormNote.textContent = noteId ? "Note updated." : "Note added.";
});

noteCancelButton?.addEventListener("click", () => {
  resetNoteForm();
  noteFormNote.textContent = "Edit cancelled.";
});

adminNoteList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const noteId = button.dataset.noteId;
  const notes = getStoredNotes();
  const note = notes.find((item) => item.id === noteId);

  if (!note) {
    return;
  }

  if (button.dataset.action === "edit") {
    noteForm.elements.noteId.value = note.id;
    noteForm.elements.title.value = note.title;
    noteForm.elements.content.value = note.content;
    noteForm.elements.date.value = note.date;
    noteSubmitButton.textContent = "Update Note";
    noteCancelButton.hidden = false;
    noteFormNote.textContent = "Editing selected note.";
    noteForm.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  saveStoredNotes(notes.filter((item) => item.id !== noteId));
  refreshNotesCms();
  resetNoteForm();
  noteFormNote.textContent = "Note deleted.";
});

notesLoadMore?.addEventListener("click", () => {
  visibleNotesCount += NOTES_PAGE_SIZE;
  renderNotes();
});

setDefaultNoteDate();
refreshNotesCms();

const imageExists = (src) =>
  new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve({ src, width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => resolve(null);
    image.src = src;
  });

let activeSkatingIndex = 0;
let loadedSkatingImages = [];

const setLightboxImage = (index) => {
  if (!loadedSkatingImages.length || !lightboxImage || !lightboxCaption) {
    return;
  }

  activeSkatingIndex = (index + loadedSkatingImages.length) % loadedSkatingImages.length;
  const item = loadedSkatingImages[activeSkatingIndex];
  lightboxImage.src = item.src;
  lightboxImage.alt = item.caption;
  lightboxCaption.textContent = item.caption;
};

const openSkatingLightbox = (index) => {
  setLightboxImage(index);
  skatingLightbox?.classList.add("is-open");
  skatingLightbox?.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeSkatingLightbox = () => {
  skatingLightbox?.classList.remove("is-open");
  skatingLightbox?.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

const buildSkatingGallery = async () => {
  if (!skatingGrid || !skatingTrack) {
    return;
  }

  const availableImages = (await Promise.all(skatingImages.map(imageExists))).filter(Boolean);
  loadedSkatingImages = availableImages.map((image, index) => ({
    ...image,
    caption: image.src.includes("ice-skating-adventure")
      ? "Ice Skating Adventure"
      : skatingCaptions[index % skatingCaptions.length],
    featured: index === 0 || image.width > image.height * 1.45,
    wide: image.width > image.height * 1.2
  }));

  skatingEmpty?.classList.toggle("is-visible", loadedSkatingImages.length === 0);

  loadedSkatingImages.forEach((item, index) => {
    const figure = document.createElement("figure");
    figure.className = "skating-card";
    if (item.featured) {
      figure.classList.add("featured");
    } else if (item.wide) {
      figure.classList.add("wide");
    }
    figure.innerHTML = `
      <img src="${item.src}" alt="${item.caption}" loading="lazy" decoding="async">
      <figcaption>${item.caption}</figcaption>
    `;
    figure.addEventListener("click", () => openSkatingLightbox(index));
    skatingGrid.appendChild(figure);

    if (index < 6) {
      const slide = document.createElement("figure");
      slide.className = "skating-slide";
      slide.innerHTML = `
        <img src="${item.src}" alt="${item.caption}" loading="${index === 0 ? "eager" : "lazy"}" decoding="async">
        <figcaption>${item.caption}</figcaption>
      `;
      slide.addEventListener("click", () => openSkatingLightbox(index));
      skatingTrack.appendChild(slide);
    }
  });

  const revealCards = document.querySelectorAll(".skating-card");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealCards.forEach((card) => revealObserver.observe(card));
  } else {
    revealCards.forEach((card) => card.classList.add("is-visible"));
  }
};

document.querySelector(".skating-next")?.addEventListener("click", () => {
  skatingTrack?.scrollBy({ left: skatingTrack.clientWidth * 0.72, behavior: "smooth" });
});

document.querySelector(".skating-prev")?.addEventListener("click", () => {
  skatingTrack?.scrollBy({ left: -skatingTrack.clientWidth * 0.72, behavior: "smooth" });
});

document.querySelector(".testimonial-next")?.addEventListener("click", () => {
  testimonialTrack?.scrollBy({ left: testimonialTrack.clientWidth * 0.86, behavior: "smooth" });
});

document.querySelector(".testimonial-prev")?.addEventListener("click", () => {
  testimonialTrack?.scrollBy({ left: -testimonialTrack.clientWidth * 0.86, behavior: "smooth" });
});

document.querySelector(".lightbox-next")?.addEventListener("click", () => setLightboxImage(activeSkatingIndex + 1));
document.querySelector(".lightbox-prev")?.addEventListener("click", () => setLightboxImage(activeSkatingIndex - 1));
document.querySelector(".lightbox-close")?.addEventListener("click", closeSkatingLightbox);

skatingLightbox?.addEventListener("click", (event) => {
  if (event.target === skatingLightbox) {
    closeSkatingLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && consultationModal?.classList.contains("is-open")) {
    closeConsultationModal();
    return;
  }

  if (!skatingLightbox?.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeSkatingLightbox();
  } else if (event.key === "ArrowRight") {
    setLightboxImage(activeSkatingIndex + 1);
  } else if (event.key === "ArrowLeft") {
    setLightboxImage(activeSkatingIndex - 1);
  }
});

buildSkatingGallery();
