<template>
  <v-row class="goals-selector">
    <v-col cols="5">
      <v-list dense>
        <v-list-item-group
          :value="activeGoalType"
          @change="emitTypeChange"
          mandatory
        >
          <v-list-item
            v-for="(item, i) in goalTypes"
            :value="item.value"
            :key="i"
            @change="resetGoalModel"
          >
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-col>
    <v-col cols="7">
      <v-slide-group
        class="goals-slider"
        :class="{ 'goals-slider-ss': activeGoalType === 'signature-solutions' }"
        @click:next="goalUpdateNext($event)"
        @click:prev="goalUpdatePrev($event)"
        show-arrows
        ref="slider"
      >
        <v-slide-item
          v-for="(n, index) in activeGoalTypes"
          :key="index"
          :value="index + 1"
        >
          <v-menu
            open-on-hover
            bottom
            :nudge-left="255"
            :nudge-bottom="80"
            content-class="goals-selector-sdg-menu"
          >
            <template v-slot:activator="{ on }">
              <img
                v-on="on"
                :src="getGoalImage(index)"
                width="120"
              />
            </template>
            <div class="goals-selector-tooltip-content">
              <img
                v-for="(n, index) in activeGoalTypes"
                :key="index"
                @click="selectGoal(index + 1)"
                :src="getGoalImage(index)"
                class="goals-selector-tooltip-image"
                :width="activeGoalType.value === 'signature-solutions' ? 240 : 80"

              />
            </div>
          </v-menu>
        </v-slide-item>
      </v-slide-group>
    </v-col>
  </v-row>
</template>

<script>
import {goalTypes, goals} from '@/assets/goalsList'
export default {
  name: "GoualsSelector",
  data() {
    return {
      goalTypes,
      goalsList: goals,
      activeGoal: 1,
    };
  },
  props: {
    activeGoalType: {
      type: String,
      default: "sdgs",
    },
  },
  computed: {
    activeGoalTypes() {
      return this.goalsList[this.activeGoalType];
    }
  },
  methods: {
    getGoalImage(index) {
      if (this.activeGoalType === "sdgs") {
        return require(`@/assets/media/goals-icons/sdgs/${index+1}.png`)
      } else if (this.activeGoalType === "samoa") {
        return require(`@/assets/media/goals-icons/samoa/${index+1}.png`)
      } else if (this.activeGoalType === "signature-solutions") {
        return require(`@/assets/media/goals-icons/signature-solutions/${index+1}.png`)
      }
    },
    goalUpdateNext() {
      this.activeGoal = this.activeGoal + 1;
      this.$store.commit("goals/setActiveGoal", this.activeGoal);
    },
    goalUpdatePrev() {
      this.activeGoal = this.activeGoal - 1;
      this.$store.commit("goals/setActiveGoal", this.activeGoal);
    },
    selectGoal(goalNumber) {
      this.activeGoal = goalNumber;
      this.$store.commit("goals/setActiveGoal", this.activeGoal);
      this.$refs.slider.scrollOffset = 120 * (goalNumber - 1);

    },
    emitTypeChange(type) {
      if(type !== this.activeGoalType) {
        this.$store.commit("goals/setActiveGoal", 1);
        this.$emit("changeType", { activeGoal: this.activeGoal, type: type });
      }
    },
    resetGoalModel() {
      this.$nextTick(() => {
        //Requred to reset slider when switching between samoa and sdgs
        this.$refs.slider && this.$refs.slider.items[0].toggle();
        this.$refs.slider && this.$refs.slider.scrollIntoView();
      });
    },
    getGoalsTooltipNudgeTop(index) {
      if (index < 6) {
        return 6;
      } else if (index < 12) {
        return 56;
      }
      return 112;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.goals-selector .goals-slider {
  padding: 8px 0;
  width: 170px;
  margin: auto;
}
.goals-selector .goals-slider .v-slide-group__next,
.goals-selector .goals-slider .v-slide-group__prev {
  min-width: 25px;
}
.goals-selector-tooltip-content {
  display: flex;
  max-width: 240px;
  flex-wrap: wrap;
  background: #fff;
}
.goals-selector-tooltip-image {
  transition: 200ms;
  cursor: pointer;
}
.goals-selector-pillars_icon {
  margin-right: 5px !important;
}
.goals-selector .pillar {
  padding: 0 8px;
}
.goals-selector-tooltip-image:hover {
  transform: scale(110%);
}
.goals-selector-sdg-menu {
  padding: 10px;
  background: #FFF;
  box-shadow: none !important;
  overflow: visible !important;
}
</style>
