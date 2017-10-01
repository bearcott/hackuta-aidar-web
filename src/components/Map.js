import Mapbox from 'mapbox-gl-vue'
import axios from 'axios'
import { mapClicked } from '@/helpers/map'

export default {
  name: 'map',
  data: () => ({
    points: []
  }),
  created () {
  },
  methods: {
    mapLoaded (map) {
      map.setPitch(15)
      let addedSource = false
      const setPeople = () => {
        axios.get('https://mryktvov7a.execute-api.us-east-1.amazonaws.com/prod/users?getall=true')
          .then(({data}) => {
            const properFeat = data.map(
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
            if (!addedSource) {
              map.addSource('people', {
                'type': 'geojson',
                'data': {
                  'type': 'FeatureCollection',
                  'features': properFeat
                }
              })

              map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'people',
                'layout': {
                  'icon-image': '{icon}-15',
                  'text-field': '{title}',
                  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                  'text-offset': [0, 0.6],
                  'text-anchor': 'top'
                }
              })

              data && [0] && map.jumpTo({
                center: [
                  data[0].longitude,
                  data[0].latitude
                ],
                zoom: 14
              })
              addedSource = true
              return
            }
            map.getSource('people').setData({
              'type': 'FeatureCollection',
              'features': properFeat
            })
          })
      }
      setPeople()
      // setInterval(setPeople, 2000)
    },
    mapClicked (map, e) {
      mapClicked(map, e)
    }
  },
  components: {
    mapbox: Mapbox
  }
}
