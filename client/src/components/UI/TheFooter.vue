<template>
    <footer class="dh-footer">
    <div class="container py-3">
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <a href="/" class="text-decoration-none">
          <span class="dh-wordmark">dorm<span class="dh-chip">hub</span></span>
        </a>

        <ul class="nav col-12 col-lg-auto justify-content-center">
          <li><router-link to="/privacy" class="nav-link px-2 dh-footer-link">Privacy</router-link></li>
          <li><router-link to="/impressum" class="nav-link px-2 dh-footer-link">Impressum</router-link></li>
        </ul>

        <p class="mb-0 dh-footer-note">&copy; Jesse Günzl</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.dh-footer {
  background: var(--dh-ink);
  color: rgba(255, 255, 255, 0.78);
  margin-top: 3rem;
}

.dh-wordmark {
  font-family: var(--dh-font-display);
  font-weight: 680;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
  color: #fff;
}

.dh-wordmark .dh-chip {
  margin-left: 0.18em;
  font-size: 0.92em;
}

.dh-footer-link {
  color: rgba(255, 255, 255, 0.78);
}

.dh-footer-link:hover {
  color: #fff;
}

.dh-footer-note {
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.9rem;
}
</style>
