<template>
  <div class="dashboard-container">
    <div>
      <img src="../../assets/images/dashboard.svg" />
    </div>
    <p>Halo selamat {{ greeting }} {{ name }}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      name: '',
      greeting: ''
    }
  },

  mounted() {
    this.handleSetGreeting()
  },

  methods: {
    handleSetGreeting() {
      const hours = new Date().getHours()

      if (hours >= 0 && hours < 11) {
        this.greeting = 'pagi'
      } else if (hours >= 11 && hours < 15) {
        this.greeting = 'siang'
      } else if (hours >= 15 && hours < 18) {
        this.greeting = 'sore'
      } else {
        this.greeting = 'malam'
      }

      this.name = localStorage.getItem('name')
    }
  }
})
</script>

<style>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.dashboard-container div {
  width: 50%;
}
.dashboard-container div img {
  width: 100%;
}
.dashboard-container p {
  font-size: 2em;
}
.delivered {
  width: 100px;
}
</style>
