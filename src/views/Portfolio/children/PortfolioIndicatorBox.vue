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
@media (min-width:960px) and (max-width:1264px) {
  .stat-card{
    max-width: 150px;
    padding: .5rem 1rem 0;
  }
  .stat-card h3{
    font-size: 2.5rem;
    margin-bottom: .5rem;
    color: #000;
    -webkit-text-stroke: 0;
  }
}
</style>
