<template>
  <ul class="navbar">
    <li>
      <RouterLink to="/">Tasks</RouterLink>
    </li>
    <li>
      <RouterLink to="/about">About</RouterLink>
    </li>
  </ul>
  <main>
    <RouterView />
  </main>
</template>
