<template>
  <div class="d-flex flex-column">
    <v-card class="mb-1  controller-block">
      <v-row class="d-none d-md-flex">
        <v-col cols="6">
          <v-list class="bt-0 pb-0" color="transparent" dense>
            <v-list-item-group class="goal-type-list" v-model="activeGoalType" mandatory>
              <v-tooltip
                top
                v-for="(item, i) in goalTypes"
                :key="i"
                eager
                transition="none"
                open-delay="200"
                max-width="400"
                nudge-right="516"
                :nudge-top="18 + 40 * (i + 1)"
                bottom
                content-class="tooltip-content"
                allow-overflow
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item
                    v-bind="attrs"
                    v-on="on"
                    :value="item.value"
                    @change="resetGoalModel"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <v-card flat class="tooltip-card">
                  <v-card-title>
                    <v-img
                      class="tooltip-card_img"
                      contain
                      max-height="45"
                      :src="item.headerImg"
                    ></v-img>
                  </v-card-title>
                  <v-card-text class="tooltip-card_text">
                    {{ item.description }}
                  </v-card-text>
                </v-card>
              </v-tooltip>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col cols="6">
          <v-list
            color="transparent"
            v-if="activeGoalType === 'pillars'"
            dense
          >
            <v-list-item-group v-model="activePillar" mandatory>
              <v-tooltip
                right
                v-for="(item, i) in goals.pillars"
                :key="i"
                eager
                open-delay="200"
                transition="none"
                :nudge-top="18 + 40 * (i + 1)"
                max-width="400"
                bottom
                :nudge-right="303"
                content-class="tooltip-content"
                allow-overflow
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-list-item
                    v-bind="attrs"
                    v-on="on"
                    class="pillar"
                    :value="i + 1"
                  >
                    <v-list-item-icon class="pillars_icon">
                      <v-img
                        max-height="24"
                        max-width="24"
                        :src="item.icon"
                      ></v-img>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title v-text="item.name"></v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <v-card flat>
                  <v-card-title>
                    <v-img
                      class="pillar-tooltip_img"
                      max-height="60"
                      max-width="60"
                      :src="item.icon"
                    ></v-img>
                    {{ item.name }}
                  </v-card-title>
                  <v-card-text>{{ item.description }}</v-card-text>
                </v-card>
              </v-tooltip>
            </v-list-item-group>
          </v-list>
          <v-slide-group
            v-else
            class="goals-slider"
            @click:next="goalUpdateNext($event)"
            @click:prev="goalUpdatePrev($event)"
            show-arrows
            ref="slider"
          >
            <v-slide-item
              v-for="(n, index) in activeGoals"
              :key="n.name"
              :value="index + 1"
            >
              <v-menu
                open-on-hover
                bottom
                :nudge-left="256"
                :nudge-bottom="98"
                content-class="sdg-menu"
              >
                <template v-slot:activator="{ on }">
                  <img
                    v-on="on"
                    :src="getGoalImage(index)"
                    height="100"
                    width="100"
                  />
                </template>
                <div class="goals-tooltip-content">
                  <v-tooltip
                    right
                    v-for="(n, index) in activeGoals"
                    :key="n.name"
                    eager
                    transition="none"
                    open-delay="300"
                    :nudge-right="(4 - (index % 5)) * 80 || 6"
                    :nudge-top="Math.floor(index / 5) * 80 || 6"
                    max-width="400"
                    content-class="tooltip-content"
                    allow-overflow
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <img
                        v-bind="attrs"
                        v-on="on"
                        @click="selectGoal(index + 1)"
                        :src="getGoalImage(index)"
                        class="tooltip-image"
                        height="80"
                        width="80"
                      />
                    </template>
                    <v-card flat>
                      <v-card-title class="coal-title">
                        {{ n.name }}
                      </v-card-title>
                      <v-card-text>
                        {{ n.content }}
                      </v-card-text>
                    </v-card>
                  </v-tooltip>
                </div>
              </v-menu>
            </v-slide-item>
          </v-slide-group>
        </v-col>
      </v-row>
      <layer-selector
        class="mb-4 ml-4 mr-4"
        :dataset="activeDataset"
        :year="activeYear"
        :datasets="filteredDatasets"
        :datasetLabel="firstDatasetName"
        :layer="activeLayer"
        :layerLabel="firstLayerName"
        @datasetChange="firstDatasetChange"
        @layerChange="firstLayerChange"
        @yearChange="firstYearChange"
      />

      <layer-selector
        class="mb-4 ml-4 mr-4"
        :disabled="!activeLayer"
        v-if="bivariateModeEnabled || dualModeEnabled"
        :dataset="secondDataset"
        :year="secondYear"
        :datasets="filteredDatasets"
        :datasetLabel="dualModeEnabled ? 'Right Dataset' : 'Second Dataset'"
        :layer="secondLayer"
        :layerLabel="dualModeEnabled ? 'Right Layer' : 'Second Layer'"
        @datasetChange="secondDatasetChange"
        @layerChange="secondLayerChange"
        @yearChange="secondYearChange"
      />
    </v-card>
    <layers-tabs
      class="d-none d-md-flex"
      :dataset="activeDataset"
      :firstLayer="activeLayer"
      :secondDataset="secondDataset"
      :secondLayer="secondLayer"
      :activeYear="activeYear"
      :secondYear="secondYear"
      :dualModeEnabled="dualModeEnabled"
      :bivariateModeEnabled="bivariateModeEnabled"
      :pillar="activeGoal"
      :goal="activePillar"
      :goalType="activeGoalType"
      @tabUpdate="hadleTabUpdate"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { goalTypesGis, goals } from '@/assets/goalsList'
import LayerSelector from './LayerSelector'
import LayersTabs from './LayersTabs'

export default {
  name: 'LayersController',
  data() {
    return {
      activeGoalType: "sdgs",
      goalTypes: goalTypesGis,
      goals,
      activeGoal: 1,
      activePillar: 1,
      activeDataset:null,
      activeLayer:null,
      secondDataset:null,
      secondLayer:null,
      activeYear: null,
      secondYear: null
    }
  },
  props:[
    'dualModeEnabled',
    'bivariateModeEnabled'
  ],
  components: {
    LayerSelector,
    LayersTabs
  },
  computed:{
    ...mapState({
      datasets: state => state.gis.datasets
    }),
    filteredDatasets() {
      let filteredDatasets = this.datasets.reduce((array, dataset) => {
        let hasGoal = false;
        if (this.activeGoalType === "pillars") {
          hasGoal = dataset.pillars.includes(this.activePillar)
        } else if (this.activeGoalType === "sdgs") {
          hasGoal = dataset.sdg.includes(this.activeGoal)
        } else if (this.activeGoalType === "samoa") {
          hasGoal = dataset.samoa.includes(this.activeGoal)
        }
        if (hasGoal) {
          array.push(dataset);
        }
        return array;
      }, []);
      if(this.activeDataset && !filteredDatasets.includes(this.activeDataset)) {
        filteredDatasets.push(this.activeDataset)
      }
      if((this.dualModeEnabled || this.bivariateModeEnabled)
        && this.secondDataset
        && !filteredDatasets.includes(this.secondDataset)) {
        filteredDatasets.push(this.secondDataset)
      }
      return filteredDatasets
    },
    activeGoals() {
      return this.goals[this.activeGoalType];
    },
    firstDatasetName() {
      if(this.dualModeEnabled) {
        return 'Left Dataset'
      }
      if(this.bivariateModeEnabled) {
        return 'First Dataset'
      }
      return 'Dataset'
    },
    firstLayerName() {
      if(this.dualModeEnabled) {
        return 'Left Layer'
      }
      if(this.bivariateModeEnabled) {
        return 'First Layer'
      }
      return 'Layer'
    }
  },
  methods:{
    resetGoalModel() {
      this.activeGoal = 1;
      this.$refs.slider && this.$refs.slider.items[0].toggle();
      this.$refs.slider && this.$refs.slider.scrollIntoView();
    },
    getGoalImage(index) {
      if (this.activeGoalType === "sdgs") {
        return require(`@/assets/media/goals-icons/sdgs/${index + 1}.png`);
      } else {
        return require(`@/assets/media/goals-icons/samoa/${index + 1}.png`);
      }
    },
    goalUpdateNext() {
      this.activeGoal = this.activeGoal + 1;
    },
    goalUpdatePrev() {
      this.activeGoal = this.activeGoal - 1;
    },
    selectGoal(goalNumber) {
      this.activeGoal = goalNumber;
      this.$refs.slider.scrollOffset = 100 * (goalNumber - 1);
    },
    firstDatasetChange(dataset) {
      this.activeDataset = dataset;
    },
    firstLayerChange(layer) {
      this.activeLayer = layer;
      this.emitUpdate()
    },
    firstYearChange(year) {
      this.activeYear = year;
    },
    secondDatasetChange(dataset) {
      this.secondDataset = dataset;
    },
    secondLayerChange(layer) {
      this.secondLayer = layer;
      this.emitUpdate()
    },
    secondYearChange(year) {
      this.secondYear = year;
    },
    emitUpdate() {
      return this.$emit('layersChange', {
        dataset: this.activeDataset,
        layer: this.activeLayer,
        secondDataset: this.secondDataset,
        secondLayer: this.secondLayer,
      });
    },
    hadleTabUpdate(e) {
      this.activeDataset = e.layers.dataset
      this.activeLayer = e.layers.firstLayer
      this.activeYear = e.layers.activeYear
      this.secondYear = e.layers.secondYear
      this.secondDataset = e.layers.secondDataset
      this.secondLayer = e.layers.secondLayer
      this.activeGoalType = e.filters.goalType
      this.activeGoal = e.filters.goal
      this.activePillar = e.filters.pillar
      if(this.bivariateModeEnabled !== e.modes.bivariateModeEnabled) {
        this.$emit('modeUpdate', e.modes.bivariateModeEnabled)
      }
      if(this.dualModeEnabled !== e.modes.dualModeEnabled) {
        this.$emit('dualModeUpdate', e.modes.bivariateModeEnabled)
      }
      this.$nextTick(() => {
        this.emitUpdate()
      })
    }
  }
}
</script>

<style>
  .goals-slider {
    padding: 8px 0 0;
    width: 150px;
    margin: auto;
  }
  .goals-slider .v-slide-group__next,
  .goals-slider .v-slide-group__prev {
    min-width: 25px;
  }
  .goals-tooltip-content {
    display: flex;
    max-width: 400px;
    flex-wrap: wrap;
  }
  .tooltip-image {
    transition: 200ms;
    cursor: pointer;
  }
  .tooltip-card_img {
    margin: auto;
  }
  .tooltip-card_text {
    font-weight: 600;
  }
  .pillars_icon {
    margin-right: 5px !important;
  }
  .pillar {
    padding: 0 8px;
  }
  .pillar-tooltip_img {
    margin-right: 10px;
  }
  .controller-block {
    border-radius: 0 !important;
    background-color: rgba(221, 221, 221, 0.7) !important;
  }
  .goal-type-list .v-list-item{
    min-height: 28px !important;
  }
  @media (max-width:959px) {
    .controller-block {
      background-color: transparent !important;
    }
  }
</style>
