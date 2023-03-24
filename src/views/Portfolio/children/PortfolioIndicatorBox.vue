<template>
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

</style>
