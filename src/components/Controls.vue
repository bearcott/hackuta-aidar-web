<template>
  <div>
    <button v-on:click="toggle" class="toggle">
      <div class="square" v-bind:class="{green: isDispatch}" />
      {{isDispatch ? 'dispatch' : 'victim' }}
    </button>
    <div v-for="person in dispatch" class="node dispatch">
      <button v-on:click="focus(person.id)" class="title">{{person.username}}</button>
      <button v-on:click="switchAid(person)" class="switch first">needs help</button>
      <button v-on:click="destroy(person.id)" class="switch">dismiss</button>
    </div>
    <div v-for="person in victim" class="node">
      <button v-on:click="focus(person.id)" class="title">{{person.username}}</button>
      <button v-on:click="switchAid(person)" class="switch full">already saved</button>
    </div>
    <div v-for="person in unknowns" class="node" v-bind:class="{dispatch: person.needsAid}" >
      <button v-on:click="focus(person.id)" class="title">{{person.username || 'unknown'}}</button>
      <input v-on:input="onInput($event,person.id)" @keyup.enter="submit(person)"/>
    </div>
  </div>
</template>

<script>
import { setMap, createGeoJSONCircle } from '@/helpers/map'
import axios from 'axios'
export default {
  name: 'controls',
  computed: {
    isDispatch () { return this.$store.state.isDispatch },
    dispatch () {
      return Object.values(this.$store.state.people).filter(
        ({needsAid, isUnknown}) => !needsAid && !isUnknown
      )
    },
    victim () {
      return Object.values(this.$store.state.people).filter(
        ({needsAid, isUnknown}) => needsAid && !isUnknown
      )
    },
    unknowns () {
      return Object.values(this.$store.state.people).filter(
        ({isUnknown}) => isUnknown
      )
    }
  },
  methods: {
    toggle () {
      this.$store.commit('togglePerson')
    },
    focus (name) {
      const {longitude, latitude} = this.$store.state.people[name] || {}
      if (!isNaN(longitude) && !isNaN(latitude)) {
        this.$store.state.map.getSource('userCircle').setData({
          'type': 'FeatureCollection',
          'features': [
            createGeoJSONCircle([longitude, latitude], 0.5),
            createGeoJSONCircle([longitude, latitude], 0.2),
            createGeoJSONCircle([longitude, latitude], 0.1)
          ]
        })
        this.$store.state.map.jumpTo({
          center: [
            longitude,
            latitude
          ],
          zoom: 17
        })
      }
    },
    switchAid ({id, username, latitude, longitude, needsAid}) {
      this.$store.commit('setPerson', [id, {
        id,
        username,
        needsAid: !needsAid
      }])
      axios.get(`https://mryktvov7a.execute-api.us-east-1.amazonaws.com/prod/users?username=${username}&latitude=${latitude}&longitude=${longitude}&needsAid=${!needsAid}`)
      setMap(this.$store.state)
    },
    destroy (id) {
      this.$store.commit('deletePerson', id)
      axios.delete(`https://mryktvov7a.execute-api.us-east-1.amazonaws.com/prod/users?username=${id}`)
      setMap(this.$store.state)
    },
    submit ({id, username, latitude, longitude, needsAid}) {
      this.$store.commit('setPerson', [id, {
        id,
        username,
        isUnknown: false
      }])
      axios.get(`https://mryktvov7a.execute-api.us-east-1.amazonaws.com/prod/users?username=${username}&latitude=${latitude}&longitude=${longitude}&needsAid=${needsAid}`)
      setMap(this.$store.state)
    },
    onInput (e, id) {
      this.$store.commit('setPerson', [id, {username: e.target.value}])
      setMap(this.$store.state)
    }
  }
}
</script>

<style scoped>
.toggle {
  position: absolute;
  top: 0;
  margin: 10px;
  padding: 5px;
  left: 30%;
  z-index: 1337;
  background: #FCFCFC;
  color: #333;
  padding: 10px 15px;
  font-weight: bold;
  font-size: 14px;
  vertical-align: middle;
  line-height: 14px;
  border-radius: 4px;
  border: none;
}
.square {
  width: 15px;
  height: 15px;
  line-height: 14px;
  display: inline-block;
  border-radius: 3px;
  background: red;
  vertical-align: middle;
  margin-right: 10px;
}
.square.green {
  background: green;
}
.node {
  display: inline-block;
  background: #1c2322;
  width: 100%;
  border-bottom: 2px solid;
  border-image: linear-gradient(to right, transparent, rgba(84, 255, 179, 0.29));
  border-image-slice: 1;
}
.dispatch {
  background: linear-gradient(to right,#193e1f 0, rgba(25, 62, 31, 0.25))
}
.dispatch:hover {
  background: linear-gradient(to right,#184820 0, rgba(25, 62, 31, 0.25))
}
.switch {
  width: 50%;
  background: transparent;
  border: none;
  display: inline-block;
  color: rgba(252, 252, 252, 0.68);
  font-weight: bold;
  float: left;
  padding: 10px 0;
}
.switch:hover {
  box-shadow: inset 0 -10px 15px rgba(84, 255, 179, 0.05);
  color: #FFF;
}
.switch.first {
  border-right: 2px solid;
  border-image: linear-gradient(to top right, transparent, rgba(84, 255, 179, 0.29));
  border-image-slice: 1;
}
.switch.full {
  width: 100%;
}
.title {
  width: 100%;
  display: inline-block;
  padding: 10px;
  background: none;
  border: none;
  text-align: left;
  font-size: 16px;
  color: #FCFCFC;
}
.node input {
  border: 2px solid;
  background: none;
  border-top: none;
  width: 100%;
  margin: 5px;
  padding: 5px;
  font-size: 14px;
  color: #FCFCFC;
  border-color: rgba(84, 255, 179, 0.29);
  border-image-slice: 1;
}
</style>