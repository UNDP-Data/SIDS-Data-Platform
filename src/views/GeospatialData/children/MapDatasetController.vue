<template>
  <div class="">
    <v-card class="mb-1 background-transparent">
      <v-row>
        <v-col cols="6">
          <v-list class="background-none" dense>
            <v-list-item-group v-model="activeGoalType" mandatory>
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
                <v-card class="tooltip-card">
                  <v-card-title>
                    <v-img
                      class="tooltip-card_img"
                      max-width="160"
                      :src="item.headerImg"
                    ></v-img>
                  </v-card-title>
                  <v-card-text class="tooltip-card_text">
                    {{ item.content }}
                  </v-card-text>
                </v-card>
              </v-tooltip>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col cols="6">
          <v-list
            class="background-none"
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
                <v-card>
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
                :nudge-bottom="118"
                content-class="sdg-menu"
              >
                <template v-slot:activator="{ on }">
                  <img
                    v-on="on"
                    :src="getGoalImage(index)"
                    height="120"
                    width="120"
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
                    <v-card>
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

      <v-row dense>
        <v-col>
          <v-autocomplete
            rounded
            class="map-input"
            dense
            hide-details
            v-model="activeDatasetName"
            :items="filteredDatasets"
            item-text="name"
            item-value="name"
            :label="dualModeEnabled ? 'Left Dataset' : 'Dataset'"
            @change="onInput"
            outlined
          ></v-autocomplete>
        </v-col>
      </v-row>
      <v-row
        class="spacing-row"
        v-if="activeDataset && activeDataset.type === 'layers'"
        dense
      >
        <v-col>
          <v-select
            rounded
            dense
            hide-details
            class="map-input"
            v-model="activeLayerName"
            item-text="Description"
            item-value="Description"
            :items="activeDataset.layers"
            :label="dualModeEnabled ? 'Left Layer' : 'Layer'"
            @change="onInput"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-row
        class="spacing-row"
        v-else-if="activeDataset && activeDataset.type === 'temporal'"
        dense
      >
        <v-col>
          <v-slider
            class="map-input"
            v-model="activeLayerName"
            :tick-labels="ticksLabels"
            :max="activeDataset.layers.length - 1"
            step="1"
            ticks="always"
            tick-size="4"
            @change="onInput"
          ></v-slider>
        </v-col>
      </v-row>
      <v-row v-else class="spacing-row"> </v-row>
      <v-row
        id="modeInfoBox"
        v-show="dualModeEnabled"
        class="row row--dense"
        style="padding: 0 1em 1em 1em"
        >Comparison Slider enabled: Compare the leftmost and rightmost
        tabs</v-row
      >
      <v-row dense v-show="bivariateModeEnabled">
        <v-col>
          <v-select
            rounded
            class="map-input"
            dense
            hide-details
            v-model="bivariateDatasetName"
            :items="filteredDatasets"
            item-text="name"
            item-value="name"
            label="Second Dataset"
            @change="emitBivariateUpdate"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-row
        v-show="bivariateModeEnabled"
        class="spacing-row"
        v-if="bivariateDataset && bivariateDataset.type === 'layers'"
        dense
      >
        <v-col>
          <v-select
            rounded
            dense
            hide-details
            class="map-input"
            v-model="bivariateLayerName"
            item-text="Description"
            item-value="Description"
            :items="bivariateDataset.layers"
            :label="
              bivariateModeEnabled ? 'Second Layer' : 'Should Not Be Displayed'
            "
            @change="emitBivariateUpdate"
            outlined
          ></v-select>
        </v-col>
      </v-row>
      <v-row
        v-show="bivariateModeEnabled"
        class="spacing-row"
        v-else-if="bivariateDataset && bivariateDataset.type === 'temporal'"
        dense
      >
        <v-col>
          <v-slider
            class="map-input"
            v-model="bivariateLayerName"
            :tick-labels="bivariateTicksLabels"
            :max="bivariateDataset.layers.length - 1"
            step="1"
            ticks="always"
            tick-size="4"
            @change="emitBivariateUpdate"
          ></v-slider>
        </v-col>
      </v-row>
      <v-row v-else class="spacing-row" v-show="bivariateModeEnabled"> </v-row>
      <!-- DUPLICATE END -->
      <v-row
        id="modeInfoBox"
        v-show="dualModeEnabled || bivariateModeEnabled"
        class="row row--dense"
        style="padding: 0 1em 1em 1em"
        >BIVARIATE MODE ENABLED: Select the pair of datasets
      </v-row>
    </v-card>
    <div
      class="tab-system-box"
      v-bind:style="{
        'background-color': tabsAreVisible ? 'transparent' : '#e4e1e1',
        display: tabsAreVisible ? 'flex' : 'none',
      }"
    >
      <!-- TESTING - TAB SYSTEM -->
      <vue-tabs-chrome
        class="vue-tabs-component"
        v-bind:style="{ visibility: tabsAreVisible ? 'visible' : 'hidden' }"
        theme="default"
        ref="tab"
        :minHiddenWidth="120"
        v-model="tab"
        :tabs="tabs"
        :gap="2"
        @contextmenu="handleRightClick"
        @swap="handleSwap"
        @dragstart="handleDragStart"
        @dragging="handleDragging"
        @dragend="handleDragEnd"
        @remove="handleRemove"
      >
      </vue-tabs-chrome>
      <button class="tab-add" @click="addEmptyTab">+</button>
      <!-- ➕ -->
    </div>

    <!-- INFO CARD -->
    <v-card class="mb-1 block-info background-grey">
      <button
        v-bind:style="{ display: tabsAreVisible ? 'none' : 'block' }"
        style="position: absolute; top: 0; right: 0"
        class="tab-add"
        @click="addTab"
      >
        +
      </button>
      <v-card-subtitle class="block-header" v-if="activeLayer">
        <b
          >{{ activeLayer.Description }}
          {{ activeDataset.type === "temporal" ? activeLayer.Temporal : "" }}</b
        >
      </v-card-subtitle>
      <v-card-subtitle class="block-header" v-else>
        SIDS Geospatial Platform
      </v-card-subtitle>
      <v-card-text v-if="activeLayer">
        {{ activeLayer.Desc_long }}<br />
        <b>Reference</b> {{ activeLayer.Source_Name }} <br />
        <a :href="activeLayer.Source_Link" target="_blank">
          {{ activeLayer.Source_Link }}
        </a>
      </v-card-text>
      <v-card-text v-else>
        This map visualizes data for the SIDS at different resolutions. Select a
        dataset above or a country to view spatial data about that region.
      </v-card-text>
    </v-card>
    <v-card v-show="displayLegend" class="background-grey histogram_frame">
      <div
        v-show="activeLayer"
        id="histogram_frame"
        class="pic app-body population-per-km col-flex"
      >
        <div class="row-flex space-evenly legend-title" id="legendTitle"></div>
        <div
          class="row-flex space-evenly legend main-legend"
          id="updateLegend"
        ></div>
        <canvas
          ref="canvas_histogram"
          id="histogram"
          width="320"
          height="115"
        ></canvas>
      </div>
      <v-card-text class="histogram_placeholder" v-show="!activeLayer">
        Select a Dataset and Layer to view data on the map.
      </v-card-text>
    </v-card>
    <v-card class="background-grey bivariate_frame display-none">
      <div id="bivariate_frame" class="pic app-body col-flex">
        <canvas
          ref="canvas_bivariate"
          id="bivariate_canvas"
          width="320"
          height="200"
        ></canvas>
        <div class="toggleScaleTypeButtonWrapper">
          <div id="XType">default</div>
          <button
            @click="toggleScaleType('bivariate', 'X')"
            class="toggleScaleType"
          >
            Toggle X Scale
          </button>
          <div id="YType">default</div>
          <button
            @click="toggleScaleType('bivariate', 'Y')"
            class="toggleScaleType"
          >
            Toggle Y Scale
          </button>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
// import { gis_store } from "../gis/gis_store.js";
import globals from "@/gis/static/globals.js";
import datasets from "@/gis/static/layers";
import VueTabsChrome from "vue-tabs-chrome";
import { goalTypesGis, goals } from '@/assets/goalsList'

export default {
  name: "MapDatasetController",
  components: {
    VueTabsChrome,
  },
  props: [
    "map", //map class instance
    "displayLegend",
    "dualModeEnabled", //bool value
    "bivariateModeEnabled", //bool value
  ],
  data() {
    return {
      tab: "starting-tab",
      tabs: [
      ],
      bivariateDatasetName: null,
      bivariateLayerName: null,
      //
      comparisonDatasetName: null,
      comparisonLayerName: null,
      toggle_comparisonButtons: null, //v-model state for left 0/right 1 buttons
      //
      activeGoal: 1,
      activeDatasetName: null, //this.mainDatasetName,
      activeLayerName: null, //this.mainLayerName,
      datasets,
      activeGoalType: "sdgs",
      goalTypes: goalTypesGis,
      goals,
      activePillar: 1,
      layers: [],
    };
  },
  computed: {
    filteredDatasets() {
      return this.datasets.reduce((array, dataset) => {
        let filtered = Object.assign({}, dataset);
        if (this.activeGoalType === "pillars") {
          filtered.layers = filtered.layers.filter((layer) =>
            layer.pillars.includes(this.activePillar)
          );
        } else if (this.activeGoalType === "sdgs") {
          filtered.layers = filtered.layers.filter((layer) =>
            layer.SDG.includes(this.activeGoal)
          );
        } else if (this.activeGoalType === "samoa") {
          filtered.layers = filtered.layers.filter((layer) =>
            layer.samoa_pathway.includes(this.activeGoal)
          );
        }
        if (filtered.layers.length > 0) {
          array.push(filtered);
        }
        return array;
      }, []);
    },
    activeGoals() {
      console.log(this.goals[this.activeGoalType])
      return this.goals[this.activeGoalType];
    },
    activeGoalTypes() {
      return this.goals[this.activeGoalType];
    },
    ticksLabels() {
      return this.activeDataset.layers.map((layer) => layer.Temporal);
    },
    activeDataset() {
      return this.filteredDatasets.find(
        (dataset) => dataset.name === this.activeDatasetName
      );
    },
    activeLayer() {
      if (!this.activeDataset || this.comparisonDataset === "info") return null;
      if (this.activeDataset.type === "temporal") {
        return this.activeDataset.layers[this.activeLayerName];
      } else if (this.activeDataset.type === "layers") {
        return this.activeDataset.layers.find(
          (layer) => layer.Description === this.activeLayerName
        );
      } else {
        return this.activeDataset.layers[0];
      }
    },

    comparisonLayer() {
      if (!this.comparisonDataset || this.comparisonDataset === "info")
        return null;
      if (this.comparisonDataset.type === "temporal") {
        return this.comparisonDataset.layers[this.comparisonLayerName];
      } else if (this.comparisonDataset.type === "layers") {
        return this.comparisonDataset.layers.find(
          (layer) => layer.Description === this.comparisonLayerName
        );
      } else {
        console.log(this.comparisonDataset.layers[0]);
        return this.comparisonDataset.layers[0];
      }
    },
    comparisonDataset() {
      return this.filteredDatasets.find(
        (dataset) => dataset.name === this.comparisonDatasetName
      );
    },
    comparisonTicksLabels() {
      console.log("comparisonTicksLabels()");
      return this.comparisonDataset.layers.map((layer) => layer.Temporal);
    },

    tabsAreVisible() {
      return this.tabs.length <= 0 ? false : true;
    },

    bivariateDataset() {
      return this.filteredDatasets.find(
        (dataset) => dataset.name === this.bivariateDatasetName
      );
    },
    bivariateLayer() {
      if (!this.bivariateDataset || this.bivariateDataset === "info")
        return null;
      if (this.bivariateDataset.type === "temporal") {
        return this.bivariateDataset.layers[this.bivariateLayerName];
      } else if (this.bivariateDataset.type === "layers") {
        return this.bivariateDataset.layers.find(
          (layer) => layer.Description === this.bivariateLayerName
        );
      } else {
        return this.bivariateDataset.layers[0];
      }
    },
    bivariateTicksLabels() {
      return this.bivariateDataset.layers.map((layer) => layer.Temporal);
    },
  },
  methods: {
    toggleScaleType(chartName, axisName) {
      let chart;
      if (chartName === "bivariate") {
        chart = globals.myBivariateScatterChart;
      } else {
        console.warn("unexpected chartName passed, doing nothing");
        return;
      }
      this.map.toggleScaleType(chart, [axisName]); //call class function
    },
    //TESTING - TAB SYSTEM
    replaceCurrentTab() {
      //find current tab by looking through .getTabs() for matching this.tab key and overwrite the data and label values
      let currentTabKey = this.tab;
      // let tabList = this.$refs.tab.getTabs();
      let tabList = this.$refs.tab._props.tabs; //directly accessing the storage of tab instances
      console.info("currentTabKey", currentTabKey, "tabList:", tabList);

      //for (const tab of tabList)
      let index = null;
      for (let i = 0; i < tabList.length; i++) {
        let tab = tabList[i];
        index = i;

        console.log(
          `${currentTabKey} vs
          ${tab.key},`
        );
        if (tab.key === currentTabKey) {
          console.log("found current tab; overwriting", tab);
          tab.label = this.createTabLabel();
          tab.data.dataset = this.activeDatasetName;
          tab.data.layer = this.activeLayerName;
          tab.data.filters.pillar = this.activePillar;
          tab.data.filters.pillar = this.activeGoal;
          tab.data.filters.pillar = this.activeGoalType;
          console.log("tab new config: ", tab);
          break;
        } else
          console.warn(
            "!no matching current tab found for currentTabKey:",
            currentTabKey
          );
      }

      return index; //

      /* let tab = this.currentTabInstance;
      console.log("current tab; overwriting", tab);
      tab.label = this.createTabLabel();
      tab.data.dataset = this.activeDatasetName;
      tab.data.layer = this.activeLayerName;
      tab.data.filters.pillar = this.activePillar;
      tab.data.filters.pillar = this.activeGoal;
      tab.data.filters.pillar = this.activeGoalType;*/
    },
    addEmptyTab() {
      /* let tabLabel = ;
      let key = ""; //"tab";
      key += Date.now(); //timecode used for a unique id
      let data = {
        dataset: null,
        layer: null,
        filters: {
          //intended to facilitate resetting the filter
          pillar: null, //int
          goal: null, ///int
          goalType: null, //str
        },
      }; */
      let key = Date.now();
      let newTabs = [
        {
          label: "New Tab",
          key: key,
          data: {
            dataset: null,
            layer: null,
            filters: {
              //intended to facilitate resetting the filter
              pillar: null, //int
              goal: null, ///int
              goalType: null, //str
            },
          },
        },
      ];

      this.$refs.tab.addTab(...newTabs);
      this.tab = key;
    },
    addTab() {
      //TODO - ADD CHECK FOR MAX TAB AMOUNT BEFORE AADDING
      let key = ""; //"tab";
      key += Date.now(); //timecode used for a unique id
      let tabLabel = this.createTabLabel();
      let newTabs = [
        {
          label: tabLabel ? tabLabel : "New Tab",
          key: key,
          data: {
            dataset: this.activeDatasetName,
            layer: this.activeLayerName,
            filters: {
              //intended to facilitate resetting the filter
              pillar: this.activePillar, //int
              goal: this.activeGoal, ///int
              goalType: this.activeGoalType, //str
            },
          },
        },
      ];
      console.log(this.$refs);
      this.$refs.tab.addTab(...newTabs);
      this.tab = key;

      //
    },
    /* removeTab() {
      console.log(this.$refs.tab);
      this.$refs.tab.removeTab(this.tab);
    }, */
    handleRightClick(e, tab, index) {
      console.log("e, tab, index", e, tab, index);
      // this.tab = tab.key;
      // this.currentTabInstance.label = "rightclick";
      console.log("getTabs", this.$refs.tab.getTabs());
    },
    handleSwap(tab, targetTab) {
      // tab, targetTab
      // console.info("swap", tab, targetTab);
      console.info("swap", tab, targetTab);
      this.handleDragEnd(null, tab); //sort of a hack that solves two issues noticed right now
      //1) dragend does not seem to always trigger
      //2) comparison data layer/map instance/comparisonDataset and comparisonLayer not updating until a second attempt
    },
    handleDragStart(e, tab, index) {
      console.info("dragstart", e, tab, index);
      //disable for dual mode, allowing dragend logic to take over updating map with data
      // let tabs = this.$refs.tab.getTabs();
      if (!this.dualModeEnabled) {
        //check if it's the first or last tab, trigger to update
        this.handleTabClick(e, tab, index); //to trigger auto select
      }
      // else if (this.dualModeEnabled && index === tabs.length - 1) {
      //   //index indicates it's the last tab, do comparison update
      //   console.log("last tab dragging update");
      //   this.handleTabClick(e, tab, index, true); //to trigger auto select
      // } else if (this.dualModeEnabled && index === 0) {
      //   //index indicates it's the first tab, do normal update
      //   console.log("first tag dragging update");
      //   this.handleTabClick(e, tab, index); //to trigger auto select
      // }
      else {
        console.log("dragstart skipped due to dualmode on");
        this.updateControllerFromTab(tab);
      }
    },

    handleDragging() {
      // e, tab, index
      // console.info("dragging", e, tab, index);
    },

    handleDragEnd(e, tab) {
      console.info("dragend", e, tab);

      //dual mode tab logic
      //check position the tab has been placed in
      if (this.dualModeEnabled) {
        console.log("dualmode-dragend start");
        let key = tab.key;
        let tabs = this.$refs.tab.getTabs();
        //check if it's first or last of all tabs
        if (key === tabs[0].key) {
          //it's the first, update main map
          console.log(
            "tab dragged into first place -> updating main/left map instance"
          );
          let index = 0;
          this.handleTabClick(e, tab, index, false);
        } else if (key === tabs[tabs.length - 1].key) {
          //it's the last, update the comparison map
          console.log(
            "tab dragged into last place -> updating compare/right map instance"
          );
          let index = tabs.length - 1;
          //update the comparison-related state info, which is used in separate emitComparisonUpdate
          this.comparisonDatasetName = this.activeDatasetName;
          this.comparisonLayerName = this.activeLayerName;
          //trigger update
          this.handleTabClick(e, tab, index, true);
        }
        //CSS styling of first/last tabs in dualmode
        //get the tabs html nodes
        this.clearTabStyles();
        let tabNodeList = document.querySelectorAll(".tabs-content .tabs-item");
        // tabNodeList.forEach((tabNode) => {
        //   tabNode.classList.remove(
        //     "tab-leftmost-highlight",
        //     "tab-rightmost-highlight"
        //   );
        // });
        //add custom first/last custom styling
        //TODO add consideration for current number of tabs
        // if (tabNodeList.length > 1)
        tabNodeList[0]?.classList.add("tab-leftmost-highlight");
        tabNodeList[tabNodeList.length - 1]?.classList.add(
          "tab-rightmost-highlight"
        );
      }
    },

    handleRemove(e) {
      let tabs = this.$refs.tab.getTabs();
      if (tabs.length === 1) {
        let loneTab = tabs[0];
        this.handleTabClick(e, loneTab, 0);
      }
    },
    handleTabClick(e, tab, index, comparison = false) {
      this.activeGoalType = tab.data.filters.goalType; //str
      this.activeGoal = tab.data.filters.goal; ///int
      this.activePillar = tab.data.filters.pillar; //int
      this.updateControllerFromTab(tab);
      if (!comparison) {
        this.emitUpdate();
      } else if (comparison === true) {
        this.emitComparisonUpdate();
      }
    },

    updateControllerFromTab(tab) {
      this.activeDatasetName = tab.data.dataset;
      this.activeLayerName = tab.data.layer;
    },

    createTabLabel() {
      let labelString = "Placeholder Label";
      if (this.activeDataset.type === "single") {
        labelString = this.activeDataset.name;
      } else if (this.activeDataset.type === "temporal") {
        labelString = `${this.activeLayer.Temporal}:${this.activeDataset.name}`;
      } else if (this.activeDataset.type === "layers" && this.activeLayer) {
        labelString = this.activeLayer.Description;
      } else {
        return null;
      }
      return labelString;
    },

    clearTabStyles() {
      let tabNodeList = document.querySelectorAll(".tabs-content .tabs-item");
      tabNodeList.forEach((tabNode) => {
        tabNode.classList.remove(
          "tab-leftmost-highlight",
          "tab-rightmost-highlight"
        );
      });
    },

    onInput() {
      this.$nextTick(()=> {
        this.replaceCurrentTab();
        this.emitUpdate();
      })
    },
    emitUpdate() {
      let active = {
        dataset: this.activeDataset,
        layer: this.activeLayer,
      };
      this.$emit("update", active);
      if (globals.bivariateMode) {
        this.emitBivariateUpdate();
      }
    },
    emitComparisonUpdate() {
      let active = {
        dataset: this.comparisonDataset,
        layer: this.comparisonLayer,
      };
      this.$emit("updateComparison", active);
    },
    emitBivariateUpdate() {
      this.$nextTick(()=>{
        let active = {
          firstDataset: this.activeDataset,
          firstLayer: this.activeLayer,
          secondDataset: this.bivariateDataset,
          secondLayer: this.bivariateLayer,
        };
        this.$emit("updateBivariate", active);
      })
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
    resetGoalModel() {
      this.activeGoal = 1;
      this.$refs.slider && this.$refs.slider.items[0].toggle();
      this.$refs.slider && this.$refs.slider.scrollIntoView();
    },
    selectGoal(goalNumber) {
      this.activeGoal = goalNumber;
      this.$refs.slider.scrollOffset = 120 * (goalNumber - 1);
    },
  },
  mounted() {
    this.addEmptyTab(); //add empty tab in order to display the tab system and convey its presence to user
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/*Brandon additions*/
.toggleScaleTypeButtonWrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.toggleScaleTypeButtonWrapper > button {
  background-color: white !important;
  outline: grey !important;
}

.comparisonButtons .v-btn {
  padding: 0 1em !important;
  height: 100% !important;
}

.data-controller .v-sheet.v-card {
  border-radius: 0;
}

.dualmode-legend-container {
  background-color: transparent;
  position: absolute;
  width: 80%;
  top: 90.5%;
  left: 10%;
  z-index: 1;

  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  align-items: center;
  justify-content: space-between;
}

.legend-frame {
  flex: 0 1 320px;
  text-align: center;
  padding: 4px 0;
  border-radius: 5px;
}
.main-shadow-color {
  box-shadow: 0px 0px 20px 10px red;
}
.comparison-shadow-color {
  box-shadow: 0px 0px 20px 10px magenta;
}

.main-map-legend,
.comparison-map-legend {
  /* position: relative; */
  /* background-color: grey; */
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.main-map-legend {
  /* left: 25vw;
  top: 75vh; */
}

.comparison-map-legend {
  /* left: 75vw;
  top: 75vh; */
}

/* .left-symbol,
.right-symbol {
  position: relative;
  background-color: grey;
}
.left-symbol {
  position: absolute;
  left: -12px;
}
.right-symbol {
  position: absolute;
  right: 12px;
} */
.legend-title {
  font-weight: bold;
}

/* .left-symbol, */
#main-legend-title,
.tab-leftmost-highlight {
  color: red;
  border: red;
}
/* .right-symbol, */
#comparison-legend-title,
.tab-rightmost-highlight {
  color: magenta;
  border: magenta;
}

.tab-system-box {
  /* should force the chrome-tabs and tab-add towards extreme ends of container */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.tab-system-box .vue-tabs-component {
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
}
.tab-add {
  font-size: larger;
  color: #fff;
  padding: 0 5px;
}
.data-controller {
  display: flex;
  flex-direction: column;
}
.row-flex {
  display: flex;
  flex-direction: row;
  /* margin-top: 3px; */
  font-size: 11px;
}

.space-evenly {
  justify-content: space-evenly;
}

@media (orientation: portrait) and (max-width: 750px) {
  .data-controller {
    display: none;
  }
}
/* landscape displays below 800px */ /* reduced size data controller for shorter phone landscape modes */
@media (orientation: landscape) {
  .data-controller {
    /* display: none; */
    max-height: 85vh;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
  }
}
@media (orientation: landscape) and (max-width: 750px) {
  .data-controller {
    /* display: none; */
    max-width: 50vw;
    /* max-height: 100vh; */
    overflow-y: auto;
    overflow-x: hidden;
    /* overscroll-behavior: contain; */
  }
}
/*End of Brandon additions*/

.histogram_placeholder {
  height: 200px;
}
.goals-slider {
  padding: 8px 0 0;
  width: 170px;
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
.map-input {
  padding: 0 1em !important;
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
.tooltip-image:hover {
  transform: scale(120%);
}
.sdg-menu {
  padding: 10px;
  box-shadow: none !important;
  overflow: visible !important;
}
.coal-title {
  word-break: keep-all !important;
  word-wrap: normal;
  /* white-space: nowrap */
}
.spacing-row {
  height: 55px;
}
.background-none {
  background: none !important;
}
.background-transparent {
  background-color: rgba(221, 221, 221, 0.7) !important;
}
.block-info {
  height: 200px;
  overflow-y: scroll;
}

/* TESTING - TAB SYSTEM */
/* .vue-tabs-chrome {
} */
.vue-tabs-chrome .tabs-content,
.tab-add {
  /* height: inherit; */
  height: 22px;
}

.vue-tabs-chrome {
  font-size: smaller;
  padding-top: 0;
  background-color: transparent;
  position: relative;
}
.vue-tabs-chrome .tabs-background {
  /* disabling highlight glow on selectedactive tab */
  width: 0;
  height: 0;
}
.vue-tabs-chrome .tabs-main {
  background-color: #babcc1;
  /* background-color: #e4e1e1; */
  border-radius: 0;
  /* margin: 0 5px; */
  margin: 0 7px 0 0; /* removing leftmargin to allow tabs to align with infocard's leftedge*/
}

.vue-tabs-chrome .tabs-main,
.tab-add {
  background-color: #babcc1;
  /* background-color: #e4e1e1; */
}
.vue-tabs-chrome .active .tabs-main {
  background-color: #e4e1e1;
  /* background-color: #fff; */
}
/* .vue-tabs-chrome .tabs-main :hover {
  background-color: #fff !important;
} */

.chrome-tabs-slot-button {
  height: 20px;
  line-height: 20px;
  padding: 0 10px;
}

.vue-tabs-chrome .tabs-footer,
.vue-tabs-chrome .tabs-divider,
.vue-tabs-chrome .tabs-background-before,
.vue-tabs-chrome .tabs-background-after {
  display: none;
}
</style>
