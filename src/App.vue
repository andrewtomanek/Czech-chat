<template>
  <div id="app">
    <nav id="nav">
      <router-link :to="{ name: 'login' }">Login</router-link>
      <router-link :to="{ name: 'chat' }">Chat</router-link>
    </nav>
    <router-view />
  </div>
</template>

<style>
html {
  margin: 0rem;
  padding: 0rem;
}

body {
  margin: 0rem;
  padding: 0rem;
  background-color: hsla(178, 100%, 37%, 0.1);
}

#app {
  font-family: "Source Sans Pro", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin: 0;
  padding: 0;
  width: 100%;
}
nav {
  display: grid;
  grid-auto-flow: column;
  grid-gap: 0rem 2rem;
  height: 5vh;
  padding: 1rem;
  background-color: hsla(178, 56%, 29%, 1);
}

nav a {
  width: 100%;
  color: white;
  border-bottom: 0.3rem solid hsla(178, 56%, 29%, 1);
  text-decoration: none;
  font-weight: 800;
  font-size: 2rem;
}

nav a.router-link-exact-active {
  border-bottom: 0.3rem solid hsla(21, 48%, 51%, 1);
}

button {
  font-family: "Ubuntu", monospace;
}

@media all and (max-width: 736px) {
  nav a {
    font-size: 1rem;
  }
}
</style>
