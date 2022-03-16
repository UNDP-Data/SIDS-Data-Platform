<template>
  <div class="tooltip-root">
    <h4 class="block-subheader">{{header}}</h4>
    <div class="tableContainer">

        <v-data-table
          :headers="headers"
          :items="dataWithIDs"
          height="200"
          fixed-header
          width="370"
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
  props: ['header','data', 'year'],
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
          text: 'Country',
          align: 'start',
          sortable: false,
          value: 'country',
        },
        { text: 'Budget', value: 'budget',
        sortable: false, },
        { text: 'Project title', value: 'title',
        sortable: false, },
      ];
      if(this.year === 'all') {
        headers.push({
          text: 'Year', value: 'year',
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
.tooltip-root {
  max-width: 400px;
  padding: 0;
}
.tableContainer {
  margin: 0 -9px 0;
}
</style>
