<template>
  <div id="app">
    <ul class="nav nav-tabs">
      <li class="nav-item">
        <router-link class="nav-link" to="/">Servants</router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link" to="/ce">Craft Essences</router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
import ServantList from './components/ServantList.vue'

export default {
  name: 'app'
}
</script>
