<template>
  <div class="full-block resources-bg">
    <v-container class="resources-container">
      <v-row class="mt-auto">
        <v-col>
          <h2 class="resources-header text-center pt-5 pb-8">{{$t('resources.header')}}</h2>
        </v-col>
      </v-row>
      <v-row class="mb-auto">
        <v-col v-for ="resource in resources" cols="12" sm="4" :key="resource.id">
          <v-card class="resources-block d-flex flex-column" flat>
            <v-card-text class="resources-block_chip pl-6 pr-6 pb-6" color="#fff">{{$t(`resources.${resource.id}.badge`)}}</v-card-text>
            <v-img
              eager
              max-height="220"
              width="100%"
              :src="`${path}/resources/resource-images/${resource.id}.jpg`"
            ></v-img>
            <v-card-title class="resources-block_title pl-6 pr-6 pt-4 pb-4">
              {{$t(`resources.${resource.id}.header`)}}
            </v-card-title>
            <v-card-text class="resources-block_text pl-6 pr-6">
              {{$t(`resources.${resource.id}.description`)}}
            </v-card-text>
            <v-card-actions class="pl-4">
              <v-hover v-slot="{ hover }">
                <v-btn
                  variant="plain"
                  class="red-arrow"
                  depressed
                  :style="{ 'background-color': hover ? '#FFFFFF' : '#FFFFFF', 'font-size':'16px' }"
                  :href="`${path}/resources/${resource.link}`"
                >
                  {{$t('resources.open')}}
                </v-btn>
              </v-hover>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
  import axios from 'axios';
  export default {
    name: 'interfaces',
    data() {
      return {
        path: process.env.VUE_APP_API_PATH,
        resources: []
      }
    },
    async created() {
     let resp = await axios.get(process.env.VUE_APP_API_PATH+'/data/cms/resources.json');
     this.resources = resp.data.featuredResources;
    }
  }
</script>
<style>
.resources-block_title {
  font-weight: 400;
  font-size: 25px;
  line-height: 114.2%;
  word-break: keep-all;
}
.resources-text {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  line-height: 26px;
  text-align: center;
}
.resources-header{
  font-weight: 600;
  font-size: 35px;
  line-height: 114.2%;
  color: #fff;
}
.resources-block_chip {
  font-weight: 700;
  font-size: 12px;
  line-height: 112.5%;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #000 !important;
}
.resources-block_text{
  font-weight: 400;
  font-size: 16px;
  line-height: 137.5%;
  color:#000 !important;
}
.resources-block {
  padding-bottom: 20px;
}
.resources-bg {
  background-image: url("~@/assets/mediahome/resources-bg.jpg");
  background-size: cover;
}
.resources-container {
  min-height: 100vh;
}
@media (min-height:800px) {
    .resources-block {
      margin-top: 5vh
    }
  }
</style>
