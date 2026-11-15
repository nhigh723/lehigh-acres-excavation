/* Lehigh Acres Excavation Guide — site JavaScript.
   Small and dependency-free. Handles the mobile nav, the Services
   dropdown, and the quote form. */

(function () {
  "use strict";

  /* ---------------- Mobile nav ---------------- */
  var navToggle = document.querySelector(".nav-toggle");
  var mainNav = document.getElementById("main-nav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.querySelector(".nav-toggle-label").textContent = open ? "Close" : "Menu";
    });
  }

  /* ---------------- Services dropdown (touch / keyboard) ---------------- */
  var subToggles = document.querySelectorAll(".sub-toggle");
  subToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".has-sub");
      if (!item) return;
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ---------------- Quote form ---------------- */

  // ---- CONFIG: set ONE of these when the quote pipeline is ready. ----
  // FORM_ENDPOINT: URL of a form service that accepts a JSON POST
  // (for example a Formspree form URL). Leave empty until then.
  var FORM_ENDPOINT = "";

  // FORM_MAILTO: fallback inbox used by the mailto fallback below.
  // Leave empty until a real inbox exists — with no recipient set, the
  // visitor's email app still opens with the request pre-filled, and
  // the details are shown on the page so nothing is lost.
  var FORM_MAILTO = "";

  var form = document.getElementById("quote-form");
  if (!form) return;

  var statusBox = document.getElementById("form-status");
  var summaryBox = document.getElementById("quote-summary");
  var copyBtn = document.getElementById("copy-details");

  function showStatus(type, html) {
    statusBox.className = "form-status show form-status--" + type;
    statusBox.innerHTML = html;
    statusBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function setInvalid(input, invalid) {
    var row = input.closest(".form-row");
    if (row) row.classList.toggle("invalid", invalid);
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validPhone(value) {
    var digits = value.replace(/\D/g, "");
    return digits.length >= 10;
  }

  function buildSummary(data) {
    var lines = [
      "Excavation Quote Request — Lehigh Acres, FL",
      "",
      "Name: " + data.name,
      "Phone: " + data.phone,
      "Email: " + data.email,
      "Property area: " + (data.area || "Not specified"),
      "Service needed: " + data.service,
      "Project size: " + data.size,
      "",
      "About the job:",
      data.description
    ];
    return lines.join("\n");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Honeypot: bots fill it, humans never see it.
    var honeypot = form.querySelector('[name="company"]');
    if (honeypot && honeypot.value) return;

    var name = form.elements["name"];
    var phone = form.elements["phone"];
    var email = form.elements["email"];
    var service = form.elements["service"];
    var size = form.elements["size"];
    var area = form.elements["area"];
    var description = form.elements["description"];

    var ok = true;
    if (!name.value.trim()) { setInvalid(name, true); ok = false; } else setInvalid(name, false);
    if (!validPhone(phone.value)) { setInvalid(phone, true); ok = false; } else setInvalid(phone, false);
    if (!validEmail(email.value.trim())) { setInvalid(email, true); ok = false; } else setInvalid(email, false);
    if (!service.value) { setInvalid(service, true); ok = false; } else setInvalid(service, false);
    if (!size.value) { setInvalid(size, true); ok = false; } else setInvalid(size, false);
    if (!description.value.trim()) { setInvalid(description, true); ok = false; } else setInvalid(description, false);

    if (!ok) {
      showStatus("error", "<p><strong>Please check the highlighted fields.</strong> We need a name, a working phone number and email, the service and project size, and a short description of the job so a local pro can price it.</p>");
      return;
    }

    var data = {
      name: name.value.trim(),
      phone: phone.value.trim(),
      email: email.value.trim(),
      area: area.value.trim(),
      service: service.options[service.selectedIndex].text,
      size: size.options[size.selectedIndex].text,
      description: description.value.trim()
    };

    var summary = buildSummary(data);

    // Path 1: a configured form endpoint (live once set above).
    if (FORM_ENDPOINT) {
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (response) {
        if (!response.ok) throw new Error("Request failed");
        form.reset();
        showStatus("success",
          "<p><strong>Thanks, " + escapeHtml(data.name.split(" ")[0]) + " — your quote request was sent.</strong></p>" +
          "<p>A local excavation professional who works in Lehigh Acres will contact you at the number or email you provided, usually within one business day. There is no obligation.</p>");
      }).catch(function () {
        showStatus("error",
          "<p><strong>Something went wrong sending your request.</strong></p>" +
          "<p>Please try again in a moment. If it keeps failing, use the email option below — your details are shown so you can copy them.</p>");
        showMailtoFallback(summary);
      });
      return;
    }

    // Path 2 (current): no endpoint configured yet. Open the visitor's
    // email app with the request pre-filled, and show the same details
    // on the page so nothing is lost.
    showMailtoFallback(summary);
  });

  function showMailtoFallback(summary) {
    var subject = encodeURIComponent("Excavation Quote Request — Lehigh Acres, FL");
    var body = encodeURIComponent(summary);
    var href = "mailto:" + FORM_MAILTO + "?subject=" + subject + "&body=" + body;
    window.location.href = href;

    if (summaryBox) {
      summaryBox.textContent = summary;
      summaryBox.style.display = "block";
    }
    if (copyBtn) copyBtn.style.display = "inline-block";

    showStatus("info",
      "<p><strong>Your email app should have opened with your quote request ready to send.</strong></p>" +
      "<p>Our online quote system is still being set up, so for now your request is prepared as an email with everything filled in. Your details are also shown below — you can copy them and send them to any local excavation professional.</p>" +
      "<p>Nothing about your request was sent anywhere by this site until you choose to send it.</p>");
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = summaryBox ? summaryBox.textContent : "";
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          copyBtn.textContent = "Copied!";
          setTimeout(function () { copyBtn.textContent = "Copy my request details"; }, 2000);
        });
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); copyBtn.textContent = "Copied!"; } catch (e) { /* ignore */ }
        document.body.removeChild(ta);
      }
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
})();
