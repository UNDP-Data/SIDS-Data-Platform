<template>
  <!-- v-card
    class="ma-2"
  >
    <v-card-title class="custom-chip_header">{{value}}</v-card-title>
    <v-card-text class="custom-chip_text">{{title}}</v-card-text>
  </v-card-->
  <div class="stat-card small">
      <h3>{{value}}</h3>
      <p>{{title}}</p>
    </div>
</template>

<script>
export default {
  name: 'PortfolioIndicatorBox',
  props: ['value','title'],
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.custom-chip_header {
  justify-content: center;
  padding: 0.1em;
  font-weight: 700;
}
.custom-chip_text {
  justify-content: center;
  padding: 0.4em;
  max-width: 120px;
  text-align: center;
  font-size: 12px;
  line-height: 1;
  font-weight: 900;
  margin: auto;
}
</style>
