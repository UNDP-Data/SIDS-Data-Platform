<template>
  <v-menu
      v-model="open"
      :close-on-content-click="false"
      content-class=""
      :x-offset="true"
      nudge-left="50"
      left
    >
      <template v-slot:activator="{ on: menu, attrs }">
        <v-tooltip
          color="white"
          :disabled="open"
          content-class="tooltip-white"
          transition="fade-transition"
          left maxWidth="200">
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              class="toolbar-button"
              color="gray"
              @click="open = !open"
              dark
              v-bind="attrs"
              v-on="{ ...tooltip, ...menu }"
            >
              <i class="data-upload-icon"></i>
            </v-btn>
          </template>
          <span>
            <b>Upload geodata</b> - Use xml format according to Data Documentation Initiative (DDI) metadata standard. The data should include columns named "LAT" and "LON" containing point data coordinates for latitude and longitude respectively.
          </span>
        </v-tooltip>
      </template>
      <div v-if="!data" class="data-upload-control-container">
        <v-file-input
          hint="Upload geodata"
          hide-details
          rounded
          prepend-icon=""
          outlined
          placeholder="Select file"
          dense
          @change="uploadData"
        ></v-file-input>
      </div>
      <v-card v-else flat class="survey-filters">
        <v-card-title>
          {{data.docDscr[0].citation[0].titlStmt[0].titl[0]}}
        </v-card-title>
        <v-card-subtitle>
          {{data.docDscr[0].citation[0].titlStmt[0].subTitl[0]}}
        </v-card-subtitle>
        <v-card-text>
          <template v-for="(variableCat, index) in variableCategories">
            <v-row v-if="variableCat.variables.length" :key="index">
              <v-col cols="12">
                <h4>{{variableCat.label}}</h4>
              </v-col>
              <template v-for="(variable, indexCat) in variableCat.variables">
                <v-col :key="indexCat" cols="6" v-if="variable.catgry">
                  <div class="select" v-if="isSlider(variable)">
                    <label class="input-label">
                      {{variable.labl[0]}}</label>
                      <v-range-slider
                        hint="opacity"
                        :tick-size="getTickSice(variable)"
                        :max="variable.valrng[0].range[0].$.max"
                        :min="variable.valrng[0].range[0].$.min"
                        hide-details
                      >
                        <template slot="prepend">
                          {{variable.valrng[0].range[0].$.min}}
                        </template>
                        <template slot="append">
                          {{variable.valrng[0].range[0].$.max}}
                        </template>
                      </v-range-slider>
                  </div>
                  <div v-else class="select">
                    <label class="input-label">
                      {{variable.labl[0]}}</label>
                    <v-select
                      rounded
                      dense
                      hide-details
                      item-text="labl"
                      :items="variable.catgry"
                      outlined
                    ></v-select>
                  </div>
                </v-col>
              </template>
            </v-row>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            rounded
            small
            @click="data=null">
            clear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
</template>

<script>
import xml2js from "xml2js";


export default {
  name: 'MapFileUpload',
  data() {
    return {
      open:false,
      opacity:20,
      data:null
    }
  },
  props:[
    'map'
  ],
  computed: {
    variableCategories() {
      return this.data.dataDscr[0].varGrp.map(varGrp => {
        return {
          label: varGrp.labl[0],
          variables: varGrp.$.var.split(' ').reduce((aggregator, varId) => {
            aggregator.push(this.data.dataDscr[0].var.find(variable => {
              return variable.$.ID === varId
            }))
            this.data.dataDscr[0].var.find(variable => variable.$.id === varId)
            return aggregator
          }, []).filter(v => v.catgry)
        }
      })
    }
  },
  methods: {
    isSlider(variable){
      return variable.catgry && !variable.catgry[0].labl
    },
    getTickSice(variable) {
      return Math.abs(parseInt(variable.catgry[0].catValu[0]) - parseInt(variable.catgry[1].catValu[0]))
    },
    uploadData(data) {
      let rootThis = this
      let reader = new FileReader;
      reader.onload = function(event) {
          xml2js.parseString (event.target.result, (e, r) => {
            rootThis.open = false;
            rootThis.data = r.codeBook;
            rootThis.$nextTick(()=> {
              rootThis.open = true;
            })
          })
      };
      reader.readAsText(data);
    }
  }
}
</script>

<style>

.data-upload-icon {
  width: 38px;
  height: 38px;
  background-image: url("~@/assets/gis/sidebar/upload.png");
  background-size: contain;
}

.data-upload-control-container {
  width: 220px;
  height: 36px;
  border-radius: 18px;
  background: rgb(233, 236, 246);
}
.opacity-control-container .v-input__slot {
  padding: 0 !important;
}
.data-upload-control-container .v-input {
  display: flex;
  align-items: center;
}
.survey-filters {
  width: 500px;
  overflow-y: scroll;
  max-height: calc(100vh - 50px);
}
</style>
