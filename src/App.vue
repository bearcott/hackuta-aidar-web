<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
input:focus, button:focus {
  outline: none;
}
button, a, input, div {
  transition: all 200ms ease-in-out;
}
button:hover {
  cursor: pointer;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background: #0f1311;
  color: #fcfcfc;
}
canvas.mapboxgl-canvas {
  position: relative !important;
}
</style>
