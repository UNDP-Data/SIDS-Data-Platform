<template>
  <div class="about-resource mb-4">
    <a class="resource-link mb-2" target="_blank" :href="resource.links[0].link">
      <h4>{{resource.name}}</h4>
      <v-img
        aspect-ratio="0.70430107526"
        :src="resource.image"
      ></v-img>
    </a>
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
<style>
.about-resource .resource-link {
  text-decoration: none;
  color: inherit;
  text-align: center;
}
.about-resource .v-image {
  overflow: hidden;
}
.about-resource .v-image .v-image__image {
  transition: all 200ms;
  transform: scale(1.00);
}
.about-resource .v-image:hover  .v-image__image{
  transform: scale(1.05);
}
</style>
