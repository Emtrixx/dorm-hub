<template>
<div>
<h1>Wiki</h1>
<div class="with-sidebar">
    <div class="sidebar">
        <ul>
            <li><a href="#">Turnier-AG</a></li>
            <li><a href="#">Turnier-AG</a></li>
            <li><a href="#">Turnier-AG</a></li>
            <li><a href="#">Turnier-AG</a></li>
            <li><a href="#">Turnier-AG</a></li>
        </ul>
    </div>
    <div class="content">
        <h3>content</h3>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Distinctio ipsum, adipisci architecto nihil maiores facere fugit quisquam dolore. Beatae quo ea voluptatibus saepe. Nulla mollitia culpa minima quibusdam assumenda? Fuga.</p>
    </div>
</div>
</div>
</template>

<style scoped>
.with-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s1);
}

.with-sidebar > :first-child {
  flex-grow: 1;
}

.with-sidebar > :last-child {
  flex-basis: 0;
  flex-grow: 999;
  min-width: 50%;
}

.sidebar {
    border-right: 2px black solid;
    padding-right: 3rem;
}

.content {
    padding-left: 2rem;
}
</style>