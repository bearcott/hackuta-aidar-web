export const transformPerson = ({id, username, needsAid, latitude, longitude, rescuer}) => ({
  'type': 'Feature',
  'geometry': {
    'type': 'Point',
    'coordinates': [longitude, latitude]
  },
  'properties': {
    'title': username,
    'icon': 'monument',
    needsAid: rescuer ? null : needsAid,
    rescuer,
    id
  }
})

export const setMap = (state) => {
  state.map.getSource('people').setData({
    'type': 'FeatureCollection',
    'features': Object.values(state.people).map(person =>
      transformPerson(person)
    )
  })
}

export const setCircles = (state) => {
  state.map.getSource('')
}

export const createCircleSource = (vals) => ({
  'type': 'geojson',
  'data': {
    'type': 'FeatureCollection',
    'features': vals
  }
})

export const createGeoJSONCircle = (center, radiusInKm, points) => {
  if (!points) points = 64

  var coords = {
    latitude: center[1],
    longitude: center[0]
  }

  var km = radiusInKm

  var ret = []
  var distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180))
  var distanceY = km / 110.574

  var theta, x, y
  for (var i = 0; i < points; i++) {
    theta = (i / points) * (2 * Math.PI)
    x = distanceX * Math.cos(theta)
    y = distanceY * Math.sin(theta)

    ret.push([coords.longitude + x, coords.latitude + y])
  }
  ret.push(ret[0])

  return {
    'type': 'Feature',
    'geometry': {
      'type': 'Polygon',
      'coordinates': [ret]
    },
    'properties': {
      'title': `${km} km`
    }
  }
}

export const geocircleLayer = (source, color, opacity) => ({
  'id': `${source}-1-${color}`,
  'type': 'fill',
  'source': source,
  'layout': {},
  'paint': {
    'fill-color': color,
    'fill-opacity': opacity
  }
})

export const circleLayer = (source, color, opacity, filter) => ({
  'id': `${source}-1-${color}`,
  'type': 'circle',
  'source': source,
  'layout': {},
  filter,
  paint: {
    'circle-color': {
      type: 'interval',
      stops: [
        [0, color],
        [50, color]
      ]
    }
  }
})
export const geocircleLabelLayer = (source) => ({
  'id': `${source}-count`,
  'type': 'symbol',
  'source': source,
  'layout': {
    'text-field': '{title}',
    'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
    'text-offset': [0, 0],
    'text-size': 12
  },
  'paint': {
    'text-color': '#FFF'
  }
})

