(function () {
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var run = function (fn) { try { fn(); } catch (e) { console.error(e); } };

  // 1. Animasi muncul saat di-scroll
  run(function () {
    var items = $$(".reveal");
    var showAll = function () {
      items.forEach(function (el) { el.classList.add("is-visible"); });
    };

    document.documentElement.classList.add("js");

    if (!("IntersectionObserver" in window)) { showAll(); return; }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });

    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 90 + "ms";
      obs.observe(el);
    });

    // Pengaman: apa pun yang terjadi, semua isi muncul setelah 2,5 detik
    setTimeout(showAll, 2500);
  });

  // 2. Tahun di footer
  run(function () {
    var y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  });

  // 3. Navbar, menu HP, tombol ke atas
  run(function () {
    var nav = $("#nav"), toggle = $("#navToggle"), links = $("#navLinks"), toTop = $("#toTop");

    if (toggle && links) {
      toggle.addEventListener("click", function () {
        var open = links.classList.toggle("is-open");
        toggle.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open);
      });
      $$("a", links).forEach(function (a) {
        a.addEventListener("click", function () {
          links.classList.remove("is-open");
          toggle.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", false);
        });
      });
    }

    window.addEventListener("scroll", function () {
      if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 10);
      if (toTop) toTop.classList.toggle("is-show", window.scrollY > 500);
    });
    if (toTop) toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  // 4. Menu aktif mengikuti bagian yang sedang dilihat
  run(function () {
    var links = $("#navLinks");
    if (!links || !("IntersectionObserver" in window)) return;
    var anchors = $$("a", links);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          anchors.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { spy.observe(s); });
  });

  // 5. Efek mengetik
  run(function () {
    var el = $("#typed");
    if (!el) return;
    var words = ["Mahasiswa Sistem Informasi", "Bendahara Organisasi", "Master of Ceremony"];
    var w = 0, c = 0, del = false;

    function type() {
      var word = words[w];
      el.textContent = word.slice(0, c);
      if (!del && c < word.length) { c++; setTimeout(type, 110); }
      else if (!del) { del = true; setTimeout(type, 1400); }
      else if (c > 0) { c--; setTimeout(type, 55); }
      else { del = false; w = (w + 1) % words.length; setTimeout(type, 300); }
    }
    type();
  });

  // 6. Form kontak
  run(function () {
    var form = $("#contactForm"), status = $("#formStatus");
    if (!form || !status) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;

      $$("input, textarea", form).forEach(function (f) {
        var v = f.value.trim();
        var bad = !v || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
        f.classList.toggle("is-invalid", bad);
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

    $$("input, textarea", form).forEach(function (f) {
      f.addEventListener("input", function () { f.classList.remove("is-invalid"); });
    });
  });
})();
