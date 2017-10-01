import mapboxgl from 'mapbox-gl'
import Vue from 'vue'

export const mapLoaded = (map, data) => {
  console.log(data)
  map.addLayer({
    'id': 'points',
    'type': 'symbol',
    'source': {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': data.map(
            ({username, needsAid, latitude, longitude}) => ({
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [longitude, latitude]
              },
              'properties': {
                'title': username,
                'icon': 'monument'
              }
            })
        )
      }
    },
    'layout': {
      'icon-image': '{icon}-15',
      'text-field': '{title}',
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 0.6],
      'text-anchor': 'top'
    }
  })
}

export const mapClicked = (map, e) => {
  addPopUp(map, e)
  console.log(e)
  map.addLayer({
    'id': 'lolol',
    'type': 'symbol',
    'source': {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [{
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [e.lngLat.lng, e.lngLat.lat]
          },
          'properties': {
            'title': 'Mapbox DC',
            'icon': 'monument'
          }
        }]
      }
    },
    'layout': {
      'icon-image': '{icon}-15',
      'text-field': '{title}',
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 0.6],
      'text-anchor': 'top'
    }
  })
}
export const mapMouseMoved = (map, e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['points']
  })
  map.getCanvas().style.cursor = (features.length) ? 'pointer' : ''
}
export const addPopUp = (map, e) => {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ['points']
  })
  if (!features.length) {
    return
  }

  const feature = features[0]

  const PopupContent = Vue.extend({
    template: '<button @click="popupClicked">Click Me!</button>',
    methods: {
      popupClicked () {
        alert('Popup Clicked!')
      }
    }
  })

  // Populate the popup and set its coordinates
  // based on the feature found.
  new mapboxgl.Popup()
      .setLngLat(feature.geometry.coordinates)
      .setHTML('<div id="vue-popup-content"></div>')
      .addTo(map)

  new PopupContent().$mount('#vue-popup-content')
}
