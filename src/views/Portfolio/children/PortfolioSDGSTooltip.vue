<template>
  <div class="tooltip-root-sdg" :style="`max-width:${maxWidth}px`">
    <h4 class="block-subheader">{{header}}</h4>
    <div class="tableContainer">

        <v-data-table
          :headers="headers"
          :items="dataWithIDs"
          :height="maxWidth ? 200 : 300"
          fixed-header
          :width="maxWidth ? 370 : 'auto'"
          hide-default-footer
          :items-per-page="9999"
          item-key="subId"
        >
        <template v-slot:item.budget="{ item }">
          <span>{{ nFormatter( item.budget)}}</span>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
import format from '@/mixins/format.mixin'

export default {
  name: 'PortfolioSDGSTooltip',
  mixins:[format],
  props: ['header','data', 'year', 'maxWidth'],
  data() {
    return {
    }
  },
  computed: {
    dataWithIDs() {
      return this.data.map((item, index) => {
         item.subId = this.header+index;
         return item
      })
    },
    headers() {
      let headers = [
        {
          text: this.$t('portfolio.country'),
          align: 'start',
          sortable: false,
          value: 'country',
        },
        { text: this.$t('portfolio.budget'), value: 'budget',
        sortable: false, },
        { text: this.$t('portfolio.projectTitle'), value: 'title',
        sortable: false, },
      ];
      if(!this.$route.query.year || this.$route.query.year === 'all') {
        headers.push({
          text: this.$t('portfolio.year'), value: 'year',
          sortable: false
        })
      }
      return headers
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tooltip-root-sdg {
  padding: 0;
}
.tableContainer {
  margin: 0 -9px 0;
}
</style>
