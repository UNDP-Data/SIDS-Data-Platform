<template>
  <v-row class="mb-3 d-none d-print-flex">
    <v-col cols="3">
      <img
        class="printout-logo"
        src="@/assets/media/RFSIDS-dark.png"
      >
    </v-col>
    <v-col cols="6">
      <v-row dense>
        <v-col>
          <h2 class="printout-header text-center"><b>{{name}}</b> Country profile</h2>
        </v-col>
      </v-row>
      <v-row dense>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
  export default {
    name: 'PrintoutHeader',
    props: ['name']
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
