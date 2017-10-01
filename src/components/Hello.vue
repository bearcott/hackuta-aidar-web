<template>
  <div class="main">
    <div class="left">
      <div class="graphs component">
        <div class="container">
          <h1><div class="logo" /> AidAR</h1> 
        </div>
      </div>
    </div>
    <div class="right">
      <div class="map component">
        <div class="container">
          <main-map/>
        </div>
      </div>
      <div class="chat component">
        <div class="container">
          <h1>AidAR</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Map from './Map.vue'
export default {
  name: 'hello',
  components: {
    'main-map': Map
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
  margin: 0;
  padding: 10px 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.main {
  display: flex;
  align-items: flex-start;
  height: 100vh;
}
.logo {
  background: #eee;
  width: 30px;
  height: 30px;
  display: inline-block;
  margin-right: 5px;
}
.left {
  width: 30%;
  height: 100%;
}
.right {
  width: 70%;
  height: 100%;
}
.component {
  box-sizing: border-box;
  padding: 5px;
}
.container {
  background: #2c2f3e;
  height: 100%;
}
.map {
  height: 60%;
  padding-bottom: 0;
  position: relative;
}
.chat {
  height: 40%;
}
.chat .container {
  background: transparent;
}
.graphs {
  height: 100%;
}
</style>
