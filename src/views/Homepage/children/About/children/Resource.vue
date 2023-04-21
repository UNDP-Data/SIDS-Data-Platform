<template>
  <div class="mb-6 about-resource">
    <div class="resource-image">
      <v-img
      aspect-ratio="0.70430107526"
      :src="resource.image"
      ></v-img>
    </div>
    <div>
      <div class="resource-bottom">
        <div class="resource-title">{{$t('resources.'+resource.id+'.name')}}</div>
        <v-card-actions class="pt-4 pl-0">
          <v-hover v-slot="{ hover }">
            <v-btn
              plain
              class="red-arrow pl-0"
              depressed
              target="_blank"
              :style="{ 'background-color': hover ? '#FAFAFA' : '#FAFAFA', 'font-size':'16px' }"
              :href="resource.links[0].link"
            >
            OPEN
            </v-btn>
          </v-hover>
        </v-card-actions>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutResource',
  props: ['resource'],
  data() {
    return {
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.about-resource{
  /*background-image: url("../../assets/mediahome/resource-bg.png");*/
  background-repeat: no-repeat;
  background-position: left top;
  width: 336px;
}
.resource-title{
  font-weight: 400;
  font-size: 20px;
  line-height: 137.5%;
  color: #000000;
}
.resource-image{
  height: 405px;
  width: 336px;
  padding: 35px 48px 36px;
}
.resource-bottom{
  padding: 24px 24px 10px 24px;
  background-color: #f7f7f7;
}
.resource-bottom a {
  border-bottom:0;
}
</style>
