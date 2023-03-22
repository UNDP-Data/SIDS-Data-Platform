<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="export-button"
        :icon="!isDesktop"
        :large="isDesktop"
        :disabled="indiCode === 'region' || indiCode === 'mvi-index'"
        :outlined="!isDesktop"
        :block="isDesktop"
        v-bind="attrs"
        v-on="on"
      >
        <span v-if="isDesktop">{{$t('root.buttons.export')}}</span>
        <v-icon dark v-else>mdi-export-variant</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item-group>
        <v-list-item @click="exportCSV">
          <v-list-item-title>{{$t('root.export.csv')}}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="exportPDF">
          <v-list-item-title>{{$t('root.export.pdf')}}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import sizeMixin from '@/mixins/size.mixin'
import sidsList from '@/assets/sidsList'
export default {
  name: 'IndicatorsExport',
  mixins:[sizeMixin],
  props:['data', 'meta', 'indiCode'],
  data() {
    return {
    }
  },
  computed:{
    headers() {
      return ['Year'].concat(sidsList.filter(c => !c.average).map(c=> `"${c.name}"`))
    }
  },
  methods: {
    exportCSV() {
      let data = this.data.data;
      let csvString = '';
      csvString += '"#' +this.meta.indicator + ' ' + this.meta.def+'"\r\n';
      csvString += this.headers.toString() + '\r\n';
      let years = Object.keys(data).filter(c => !(c==='recentYear') && !(c==='recentValue'));
      years.map(year => {
        let yearDataArr = [year].concat(sidsList.filter(c => !c.average).map(c => {
          return data[year][c.iso] ? data[year][c.iso] : 'No Data';
        }));
        csvString += yearDataArr.toString() + '\r\n';
      })

      var exportedFilenmae = this.meta.indicator ? this.meta.indicator+'.csv' : 'export.csv';
      var blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", exportedFilenmae);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    },
    exportPDF() {
      this.$emit('print')
      this.$nextTick(()=>{
        window.print();
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
