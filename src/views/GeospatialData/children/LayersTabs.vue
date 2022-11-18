<template>
  <div
    class="tab-system-box"
  >
    <vue-tabs-chrome
      class="vue-tabs-component"
      :class="{'d-none' : tabs.length < 2}"
      theme="default"
      ref="tab"
      :minHiddenWidth="120"
      v-model="tab"
      @click="onTabChange"
      :tabs="tabs"
      :gap="2"
      @remove="onTabChange"
    >
    </vue-tabs-chrome>
    <button
      class="tab-add"
      :class="{'tab-add-fixed' : tabs.length < 2}"
      @click="addEmptyTab"
      >+</button>
  </div>
</template>

<script>
import VueTabsChrome from "vue-tabs-chrome";
export default {
  name: 'LayersTabs',
  data() {
    return {
      tab: "starting-tab",
      tabs: [],
    }
  },
  components:{
    VueTabsChrome
  },
  props:[
    'dataset',
    'firstLayer',
    'secondDataset',
    'secondLayer',
    'dualModeEnabled',
    'bivariateModeEnabled',
    'pillar',
    'goal',
    'goalType'
  ],
  computed:{
    activeTab() {
      return this.tabs.find(tab => tab.key === this.tab)
    }
  },
  methods: {
    onTabChange() {
      if(this.activeTab) {
        this.$emit('tabUpdate', this.activeTab)
      }
    },
    addEmptyTab() {
      let key = Date.now();
      let newTab = {
        label: this.createTabLabel(),
        key: key,
        layers: {
          dataset: this.dataset,
          firstLayer: this.firstLayer,
          secondDataset: this.secondDataset,
          secondLayer: this.secondLayer
        },
        filters: {
          pillar: this.pillar,
          goal: this.goal,
          goalType: this.goalType,
        },
        modes:{
          dualModeEnabled: this.dualModeEnabled,
          bivariateModeEnabled: this.bivariateModeEnabled
        }
      };
      this.$refs.tab.addTab(newTab);
      this.tab = key;
    },
    createTabLabel() {
      let labelString = "New Tab";
      if (this.dataset && this.dataset.type === "single") {
        labelString = this.dataset.name;
      } else if (this.dataset && this.dataset.type === "temporal") {
        labelString = `${this.firstLayer.Temporal}:${this.dataset.name}`;
      } else if (this.dataset && this.dataset.type === "layers" && this.firstLayer) {
        labelString = this.firstLayer.Description;
      }
      return labelString;
    }
  },
  mounted() {
    this.addEmptyTab();
  },
  watch:{
    dataset(){
      this.activeTab.layers.dataset = this.dataset
    },
    firstLayer(){
      this.$set(this.activeTab, 'label', this.createTabLabel())
      this.activeTab.layers.firstLayer = this.firstLayer
    },
    secondDataset(){
      this.activeTab.layers.secondDataset = this.secondDataset
    },
    secondLayer(){
      this.activeTab.layers.secondLayer = this.secondLayer
    },
    dualModeEnabled(){
      this.activeTab.modes.dualModeEnabled = this.dualModeEnabled
    },
    bivariateModeEnabled(){
      this.activeTab.modes.bivariateModeEnabled = this.bivariateModeEnabled
    },
    pillar(){
      this.activeTab.filters.pillar = this.pillar
    },
    goal(){
      this.activeTab.filters.goal = this.goal
    },
    goalType(){
      this.activeTab.filters.goalType = this.goalType
    },
  }
}
</script>

<style>
.tab-system-box {
  /* should force the chrome-tabs and tab-add towards extreme ends of container */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  z-index: 9;
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
.vue-tabs-component.vue-tabs-chrome .tabs-content,
.tab-add {
  height: 22px;
}

.vue-tabs-component.vue-tabs-chrome {
  font-size: smaller;
  padding-top: 0;
  background-color: transparent;
  position: relative;
}
.vue-tabs-component.vue-tabs-chrome .tabs-background {
  width: 0;
  height: 0;
}
.vue-tabs-component.vue-tabs-chrome .tabs-main {
  background-color: #babcc1;
  border-radius: 0;
  margin: 0 7px 0 0;
}
.vue-tabs-component.vue-tabs-chrome .tabs-label {
  text-overflow: ellipsis;
}
.vue-tabs-component.vue-tabs-chrome .tabs-main,
.tab-add {
  background-color: #babcc1;
}
.vue-tabs-component.vue-tabs-chrome .active .tabs-main {
  background-color: #e4e1e1;
}
.chrome-tabs-slot-button {
  height: 20px;
  line-height: 20px;
  padding: 0 10px;
}
.vue-tabs-component.vue-tabs-chrome .tabs-footer,
.vue-tabs-component.vue-tabs-chrome .tabs-divider,
.vue-tabs-component.vue-tabs-chrome .tabs-background-before,
.vue-tabs-component.vue-tabs-chrome .tabs-background-after {
  display: none;
}
.tab-add {
  width:22px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 2px;
}
.tab-add-fixed {
  position: absolute;
  right: 20px;
  top: 0;
}
.tabs-close {
  cursor: pointer;
}
</style>
