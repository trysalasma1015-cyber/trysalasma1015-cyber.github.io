document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  $("#year").textContent = new Date().getFullYear();

  const nav = $("#nav");
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  const toTop = $("#toTop");

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
  });

  $$("a", links).forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", false);
    })
  );

  window.addEventListener("scroll", () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 10);
    toTop.classList.toggle("is-show", window.scrollY > 500);
  });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const sections = $$("main section[id]");
  const navAnchors = $$("a", links);
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          navAnchors.forEach((a) =>
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id)
          );
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  const typedEl = $("#typed");
  const words = ["Mahasiswa Sistem Informasi", "Bendahara Organisasi", "Master of Ceremony"];
  let w = 0, c = 0, deleting = false;

  const type = () => {
    const word = words[w];
    typedEl.textContent = word.slice(0, c);
    if (!deleting && c < word.length) { c++; setTimeout(type, 110); }
    else if (!deleting) { deleting = true; setTimeout(type, 1400); }
    else if (c > 0) { c--; setTimeout(type, 55); }
    else { deleting = false; w = (w + 1) % words.length; setTimeout(type, 300); }
  };
  type();

  const revealObs = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  $$(".reveal").forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 90 + "ms";
    revealObs.observe(el);
  });

  const form = $("#contactForm");
  const status = $("#formStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    $$("input, textarea", form).forEach((field) => {
      const v = field.value.trim();
      const bad =
        !v || (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
      field.classList.toggle("is-invalid", bad);
      if (bad) valid = false;
    });

    status.className = "form__status";
    if (!valid) {
      status.textContent = "Mohon lengkapi semua kolom dengan benar.";
      status.classList.add("err");
      return;
    }

    status.textContent = "Terima kasih! Pesanmu sudah dikirim ✉";
    status.classList.add("ok");
    form.reset();
  });

  $$("input, textarea", form).forEach((f) =>
    f.addEventListener("input", () => f.classList.remove("is-invalid"))
  );
});