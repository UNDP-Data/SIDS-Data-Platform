<template>
  <div class="tooltip-root">
    <h4 class="block-subheader">{{header}}</h4>
    <v-list dense class="indicators-list">
      <v-list-item-group>
        <v-list-item class="p-0">
          <v-list-item-content class="one-line">
            <v-list-item-title class="" v-text="'Budget:'"></v-list-item-title>
            <v-list-item-subtitle class="one-line_subtitle">{{finance}} USD</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item  class="p-0">
          <v-list-item-content class="one-line">
            <v-list-item-title class="" v-text="'Share:'"></v-list-item-title>
            <v-list-item-subtitle class="one-line_subtitle">{{share}} %</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'PortfolioPieChartTooltip',
  props: ['header','finance','percetage','budget'],
  computed: {
    share() {
      let full = this.percetage.reduce((share, budget) => {return share + budget.value}, 0);
      return (this.budget/full * 100).toFixed(2)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.tooltip-root {
  max-width: 360px;
}
.indicators-list {
  padding-bottom: 0;
}
.indicators-list .one-line {
  flex-wrap: nowrap;
  align-items: flex-start;
  padding: 4px 0;
}
.indicators-list .v-list-item {
  min-height: 25px;
}
.indicators-list .one-line_subtitle{
  overflow: visible;
  margin-left: 1em;
}
.p-0{
  padding:0 !important;
}
</style>
