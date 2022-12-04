<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="primary"
        rounded
        :icon="isTablet"
        :fab="!isDesktop && !isTablet"
        :small="isDesktop"
        class="mt-md-2 mb-md-2"
        :outlined="isTablet"
        v-bind="attrs"
        v-on="on"
      >
        <span v-if="isDesktop">{{$t('root.buttons.export')}}</span>
        <v-icon v-else>mdi-export-variant</v-icon>
      </v-btn>
    </template>
    <v-list class="d-print-none" dense>
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
  import { mapState } from 'vuex';
  import sizeMixin from '@/mixins/size.mixin'

  export default {
    name: 'Export',
    props:['idsList'],
    mixins:[sizeMixin],
    computed:{
      ...mapState({
        sidsList: state => state.profiles.sidsList,
        profiles: state => state.profiles.profiles,
        indicatorsMetadata: state => state.profiles.indicatorsMetadata
      }),
    },
    methods: {
      exportPDF() {
        window.print();
      },
      exportCSV() {
        // TODO: move export to mixins
        function convertToCSV(objArray,note) {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str=""
            if(note!=""){
            str += '#'+note+'\r\n';}
            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '') line += ','
                    line += array[i][index];
                }
                str += line + '\r\n';
            }
            return str;
        }

        function exportCSVFile(headers, items, fileTitle,note) {
            const fileData = [headers].concat(items);
            // Convert Object to JSON
            var jsonObject = JSON.stringify(fileData);
            var csv = convertToCSV(jsonObject,note);
            var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
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
        }

        function generateTextDataCVS(pillarName) {
          for (let indicator in this.profiles[this.idsList[0]][pillarName]) {
            let indicatorFull = this.profiles[this.idsList[0]][pillarName][indicator]
            let newIndi = {}
            if(pillarName === 'Finance') {
              newIndi.axis = '"' + this.$t('finance.'+this.indicatorsMetadata[indicatorFull.axis].indicator.replaceAll('.', '-')) + '"'
            } else {
              newIndi.axis = '"' + this.$t('countryProfile.infoBox.'+this.indicatorsMetadata[indicatorFull.axis].indicator.replaceAll('.', '-')) + '"'
            }
            newIndi.source = this.indicatorsMetadata[indicatorFull.axis] && this.indicatorsMetadata[indicatorFull.axis].source ?
            '"' + this.indicatorsMetadata[indicatorFull.axis].source.replace(/,/g, '') + '"' :
            'No Data';
            this.idsList.map(countryId => {
              newIndi[countryId] = this.profiles[countryId][pillarName][indicator].value.replace(/,/g, ' ')
              newIndi[countryId + ' Year'] = this.profiles[countryId][pillarName][indicator].year
            })
            console.log(newIndi)
            countryExport.push(newIndi)
          }
        }

        function generateAxisDataCVS(pillarName) {
          for (let indicator in this.profiles[this.idsList[0]][pillarName]) {
            let indicatorFull = this.profiles[this.idsList[0]][pillarName][indicator]
            let newIndi = {}
            newIndi.axis = '"' + this.$t('spiders.'+this.indicatorsMetadata[indicatorFull.axis].indicator.replaceAll('.', '-')).indicator + '"'
            newIndi.source = this.indicatorsMetadata[indicatorFull.axis] && this.indicatorsMetadata[indicatorFull.axis].source ?
            '"' + this.indicatorsMetadata[indicatorFull.axis].source.replace(/,/g, '') + '"' :
            'No Data';
            this.idsList.map(countryId => {
              newIndi[countryId] = this.profiles[countryId][pillarName][indicator].value
              newIndi[countryId + ' Year'] = this.profiles[countryId][pillarName][indicator].year
            })
            console.log(newIndi)
            countryExport.push(newIndi)
          }
        }

        let countryExport = []
        const pillars = ["MVI", "ClimateRank", "BlueRank", "DigitalRank", "Blue", "Climate", "Digital"];
        generateTextDataCVS.call(this, 'Profile');
        pillars.map(pillar => {
          generateAxisDataCVS.call(this, pillar)
        });
        generateTextDataCVS.call(this, 'Finance');

        let headers = {};
        headers.axis = "Indicator",
        headers.source = "Source";
        this.idsList.map(countryId => {
          headers[countryId] = this.sidsList.find(sids => sids.id === countryId).name
          headers[countryId + ' Year'] = 'Year'
        })
        let filename = window.location.pathname.substring(1).replaceAll('/', '_')
        exportCSVFile(headers, countryExport, filename, "")
      },
    }
  }
</script>
<style>
  .printout-logo {
    max-width: 100%;
  }
  .printout-header{
    font-weight: 400;
    font-size: 26px;
    margin-top: -7px !important;
  }
</style>
