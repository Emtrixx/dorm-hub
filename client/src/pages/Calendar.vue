<template>
  <div>
    <header class="dh-page-head">
      <span class="dh-eyebrow">Dates & events</span>
      <h1>Calendar</h1>
    </header>
    <div class="calendar-frame">
      <iframe
        title="calendar"
        src="https://calendar.google.com/calendar/embed?src=grnoav1jbkp958a095bbnat9q4%40group.calendar.google.com&ctz=Europe%2FBerlin"
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
.calendar-frame {
  border: 1px solid var(--dh-line);
  border-radius: var(--dh-radius);
  overflow: hidden;
  background: var(--dh-card);
}

.calendar-frame iframe {
  display: block;
  width: 100%;
  height: 70vh;
  border: 0;
}
</style>
