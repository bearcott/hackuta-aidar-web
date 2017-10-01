<template>
  <div id="map">
    <mapbox
      access-token="pk.eyJ1IjoiYm55bm4iLCJhIjoiRU5kWlp6VSJ9.WZr4obGgqeRexfnl6_nTbw"
      :map-options="{
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [-96, 37.8],
        zoom: 3,
        classes: 'lmao',
        logoPosition: 'top-right'
      }"
      :geolocate-control="{
        show: true
      }"
      @map-load="mapLoaded"
      @map-click="mapClicked"
    />
  </div>
</template>

<script>
import Map from './Map.js'
export default Map
</script>

<style scoped>
  #map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>