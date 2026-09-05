// TISZTA VÍZ — shared site behavior (nav scroll state, reveal-on-scroll,
// and mobile hamburger menu). Loaded on every page.

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Nav background on scroll ---- */
  const navEl = document.getElementById('nav');
  if (navEl) {
    const updateNav = () => navEl.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', updateNav);
    updateNav();
  }

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.14 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---- Mobile hamburger + slide-down panel ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const mobilePanel = document.querySelector('.mobile-panel');

  if (navToggle && mobilePanel) {
    navToggle.addEventListener('click', () => {
      const open = navToggle.classList.toggle('open');
      mobilePanel.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close mobile panel when a direct link is tapped
    mobilePanel.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mobilePanel.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- About page: highlight the active chapter in the sticky sub-nav ---- */
  const storyNav = document.getElementById('storyNav');
  if (storyNav) {
    const storyLinks = storyNav.querySelectorAll('a[data-story]');
    const storySections = Array.from(storyLinks)
      .map(link => document.getElementById(link.dataset.story))
      .filter(Boolean);

    if ('IntersectionObserver' in window && storySections.length) {
      const setActive = (id) => {
        storyLinks.forEach(link => link.classList.toggle('active', link.dataset.story === id));
      };
      const storyIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      }, { rootMargin: '-140px 0px -60% 0px', threshold: 0 });
      storySections.forEach(sec => storyIO.observe(sec));
    }

    /* Solid background only once the sub-nav is actually pinned under the main nav */
    const sentinel = document.getElementById('storyNavSentinel');
    if (sentinel && 'IntersectionObserver' in window) {
      const pinIO = new IntersectionObserver(
        ([entry]) => storyNav.classList.toggle('pinned', !entry.isIntersecting),
        { rootMargin: '-71px 0px 0px 0px', threshold: 0 }
      );
      pinIO.observe(sentinel);
    }
  }

  /* ---- Shared Web3Forms submit handler (real, no backend of our own needed) ---- */
  const submitToWeb3Forms = async (form, statusEl, successMsg, busyText) => {
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = busyText;
    btn.disabled = true;
    statusEl.classList.remove('show', 'success', 'error');

    const showStatus = (text, kind) => {
      statusEl.textContent = text;
      statusEl.classList.add('show', kind);
    };

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        showStatus(successMsg, 'success');
        form.reset();
      } else {
        showStatus("Something went wrong — please email us directly instead.", 'error');
        console.error('Web3Forms error:', data.message);
      }
    } catch (err) {
      showStatus("Network error — please email us directly instead.", 'error');
      console.error('Web3Forms network error:', err);
    }
    btn.textContent = original;
    btn.disabled = false;
    setTimeout(() => statusEl.classList.remove('show'), 8000);
  };

  /* ---- Contact form ---- */
  const contactForm = document.getElementById('contact-form');
  const contactStatus = document.getElementById('contact-status');
  if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitToWeb3Forms(
        contactForm, contactStatus,
        "✓ Your enquiry has been sent — we'll follow up shortly.",
        'Sending…'
      );
    });
  }

  /* ---- Newsletter form ---- */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterStatus = document.getElementById('newsletter-status');
  if (newsletterForm && newsletterStatus) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitToWeb3Forms(
        newsletterForm, newsletterStatus,
        "✓ You're subscribed — thanks for joining.",
        'Submitting…'
      );
    });
  }

});

/* ---- Simple rule-based FAQ chat widget (no AI, no backend) ---- */
document.addEventListener('DOMContentLoaded', function () {
  var FAQ = [
    { keywords: ['stp', 'sewage'], q: 'I need an STP', a: 'We design Sewage Treatment Plants (STP) for municipal and industrial applications. <a href="knowledge-hub.html">Learn more in our Knowledge Hub &rarr;</a>' },
    { keywords: ['mbr', 'membrane bioreactor'], q: 'What is MBR?', a: 'MBR (Membrane Bioreactor) combines biological treatment with membrane filtration for high-quality treated water. <a href="technologies.html">See all our technologies &rarr;</a>' },
    { keywords: ['start a project', 'quote', 'hire', 'work with you'], q: 'I want to start a project', a: 'Great &mdash; the best next step is to reach our team directly. <a href="contact.html">Contact us &rarr;</a>' },
    { keywords: ['your projects', 'portfolio', 'show me'], q: 'Show me your projects', a: 'Take a look at our project portfolio here: <a href="projects.html">View Projects &rarr;</a>' },
    { keywords: ['what does tiszta', 'what do you do', 'who are you', 'about tiszta'], q: 'What does Tiszta Víz do?', a: 'Tiszta Víz delivers sustainable engineering solutions across Water, Energy, and Infrastructure &mdash; from concept to commissioning. <a href="about.html">Learn more about us &rarr;</a>' },
    { keywords: ['technolog'], q: 'What technologies do you use?', a: 'We work with SBR, MBR, RO/UF, Biogas and ZLD systems, selected to fit each project. <a href="technologies.html">Explore our technologies &rarr;</a>' },
    { keywords: ['locat', 'address', 'office', 'where are you'], q: 'Where are you located?', a: 'You can find our location on the map on our About page. <a href="about.html#presence">View our location &rarr;</a>' },
    { keywords: ['contact', 'phone', 'email', 'call', 'reach you'], q: 'How do I contact you?', a: 'You can reach us at <a href="tel:+919824555431">+91 98245 55431</a> or <a href="mailto:md@tisztavizprojects.com">md@tisztavizprojects.com</a>, or use our <a href="contact.html">Contact page &rarr;</a>.' }
  ];

  var launcher = document.getElementById('chatLauncher');
  var panel = document.getElementById('chatPanel');
  var messagesEl = document.getElementById('chatMessages');
  var input = document.getElementById('chatInput');
  var sendBtn = document.getElementById('chatSend');
  if (!launcher || !panel) return;

  var started = false;

  function addMessage(html, from) {
    var div = document.createElement('div');
    div.className = 'chat-msg ' + from;
    div.innerHTML = html;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addQuickReplies() {
    var wrap = document.createElement('div');
    wrap.className = 'chat-quick-replies';
    FAQ.forEach(function (item) {
      var btn = document.createElement('button');
      btn.className = 'chat-quick-btn';
      btn.type = 'button';
      btn.textContent = item.q;
      btn.addEventListener('click', function () { handleQuestion(item.q); });
      wrap.appendChild(btn);
    });
    messagesEl.appendChild(wrap);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function findAnswer(text) {
    var lower = text.toLowerCase();
    return FAQ.find(function (item) {
      return item.keywords.some(function (k) { return lower.indexOf(k) !== -1; });
    });
  }

  function handleQuestion(text) {
    if (!text || !text.trim()) return;
    addMessage(text.replace(/</g, '&lt;'), 'user');
    var match = findAnswer(text);
    setTimeout(function () {
      if (match) {
        addMessage(match.a, 'bot');
      } else {
        addMessage("I don't have an exact answer for that yet &mdash; here's what I can help with, or reach our team directly:", 'bot');
      }
      addQuickReplies();
    }, 300);
  }

  function startChat() {
    if (started) return;
    started = true;
    addMessage("Hi! I'm here to help with quick questions about Tiszta Víz. Choose a topic below, or type your own question.", 'bot');
    addQuickReplies();
  }

  launcher.addEventListener('click', function () {
    var isOpen = panel.classList.toggle('open');
    launcher.classList.toggle('open', isOpen);
    if (isOpen) startChat();
  });

  if (sendBtn) {
    sendBtn.addEventListener('click', function () {
      handleQuestion(input.value);
      input.value = '';
    });
  }
  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        handleQuestion(input.value);
        input.value = '';
      }
    });
  }
});
