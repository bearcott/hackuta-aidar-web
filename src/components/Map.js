import Mapbox from 'mapbox-gl-vue'
import axios from 'axios'
import { transformPerson, createCircleSource, circleLayer, createGeoJSONCircle, geocircleLayer, geocircleLabelLayer, setMap } from '@/helpers/map'

export default {
  name: 'map',
  computed: {
    people: function () {
      return this.$store.state.people
    }
  },
  created () {
  },
  methods: {
    mapLoaded (map) {
      this.$store.commit('setMap', map)
      map.setPitch(15)
      axios.get('https://mryktvov7a.execute-api.us-east-1.amazonaws.com/prod/users?getproblems=true')
        .then(({data}) => {
          map.addSource('hazards', createCircleSource(
            data.map(({longitude, latitude, danger}) =>
            createGeoJSONCircle([longitude, latitude], 0.1)
            )
          ))
          map.addLayer(geocircleLayer('hazards', 'red', 0.1), 'street')
          map.addLayer(geocircleLabelLayer('hazards'))
        })
      let addedSource = false
      const setPeople = () => {
        axios.get('https://mryktvov7a.execute-api.us-east-1.amazonaws.com/prod/users?getall=true')
          .then(({data}) => {
            data.forEach((person) =>
              this.$store.commit('addPerson', [person.username, {...person, id: person.username}])
            )
            const properFeat = Object.values(this.$store.state.people).map(person =>
              transformPerson(person)
            )
            if (!addedSource) {
              map.addSource('people', {
                'type': 'geojson',
                'data': {
                  'type': 'FeatureCollection',
                  'features': properFeat
                }
              })

              map.addLayer(circleLayer('people', 'limegreen', 1, ['==', 'needsAid', false]))
              map.addLayer(circleLayer('people', 'red', 1, ['==', 'needsAid', true]))
              map.addLayer(circleLayer('people', 'yellow', 1, ['>', 'rescuer', '']))

              map.addLayer({
                'id': 'points',
                'type': 'symbol',
                'source': 'people',
                'layout': {
                  'text-field': '{title}',
                  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                  'text-offset': [0, 0.6],
                  'text-anchor': 'top'
                },
                'paint': {
                  'text-color': '#FFF'
                }
              })

              map.addSource('userCircle', createCircleSource([]))
              map.addLayer(geocircleLayer('userCircle', 'blue', 0.1), 'street')
              map.addLayer(geocircleLabelLayer('userCircle'))

              // map.addSource('userCircle3', createGeoJSONCircle([data[0].longitude, data[0].latitude], 3))
              // map.addLayer(geocircleLayer('userCircle3', 'red', 0.3))

              data && [0] && map.jumpTo({
                center: [
                  data[0].longitude, data[0].latitude
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
      setInterval(setPeople, 2000)
    },
    mapClicked (map, e) {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['points']
      })
      if (features.length) {
        const feature = features[0]
        const rescuer = this.$store.state.selectedPerson
        const {longitude, latitude} = this.$store.state.people[feature.properties.id]
        this.$store.commit('setPerson', [feature.properties.id, {rescuer}])
        axios.get(`https://mryktvov7a.execute-api.us-east-1.amazonaws.com/prod/users?username=${feature.properties.id}&latitude=${latitude}&longitude=${longitude}&needsAid=false&rescuer=${rescuer}`)
        setMap(this.$store.state)
        return
      }
      const rand = new Date().getTime()
      this.$store.commit('addPerson', [rand, {
        id: rand,
        username: 'unknown',
        isUnknown: true,
        needsAid: this.$store.state.isDispatch,
        longitude: e.lngLat.lng,
        latitude: e.lngLat.lat
      }])
      map.getSource('people').setData({
        'type': 'FeatureCollection',
        'features': Object.values(this.$store.state.people).map(person =>
          transformPerson(person)
        )
      })
    }
  },
  components: {
    mapbox: Mapbox
  }
}
