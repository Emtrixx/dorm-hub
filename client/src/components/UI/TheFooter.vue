<template>
    <footer class="p-3 bg-dark text-white">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-between">
        <a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
          <h5>Dorm-Hub</h5>
        </a>

        <ul class="nav col-12 col-lg-auto  mb-2 justify-content-center mb-md-0">
          <li><router-link to="/privacy" class="nav-link px-2 text-white">Privacy</router-link></li>
          <li><router-link to="/impressum" class="nav-link px-2 text-white">Impressum</router-link></li>
        </ul>

        <div class="text-end mb-2 mb-md-0">
            <p>&copy; Jesse Günzl</p>
        </div>
      </div>
    </div>
  </footer>
</template>
