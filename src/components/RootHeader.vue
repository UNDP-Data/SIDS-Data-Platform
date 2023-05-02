<template>
  <header class="header">
  <video class="header_video d-block" poster="@/assets/media/videos/video-placeholder.jpeg" autoplay muted loop playsinline>
    <source v-if="!isTesting" src="@/assets/media/videos/header-xl.webm" type="video/webm">
    <source v-if="!isTesting" src="@/assets/media/videos/header-xl.mp4" type="video/mp4">
  </video>
    <div class="d-none d-md-block d-lg-block d-xl-block header-bar">
      <a href="/" target="_blank">
        <img
          class="header-bar_logo"
          src="@/assets/media/logo.png"
          alt="UNDP Data Futures Platform Logo">
      </a>
    </div>
    <main role="main" class="header-text">
        <h1 class="header-text_header header-text_header-big mt-16">{{ $t("root.header.header[0]") }}</h1>
        <h2 class="header-text_header header-text_header-small">{{$t("root.header.header[1]")}}</h2>
        <h1 class="header-text_header header-text_header-big">{{$t("root.header.header[2]")}} </h1>
        <p class="d-none d-md-block d-lg-block d-xl-block header-text_description mt-3 px-12">{{$t("root.header.description")}}</p>
    </main>
    <a class="header_button-down d-none d-md-block" href="#content">
      <img alt="Arrow Down Icon" src="@/assets/media/icons/arrow-down.png">
    </a>
    <img
      class="d-block d-md-none header-bar_logo-mobile"
      src="@/assets/media/RFSIDS.png"
      alt="Rising Up For Small Islands Developing States Logo"/>
  </header>
</template>

<script>
export default {
  name: 'RootHeader',
  computed:{
    isTesting(){
      return process.env.NODE_ENV === 'testing'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 2em;
}
.header-bar {
  width: 100%;
  padding: 15px 10px;
  position: relative;
  margin-top: 0;
  margin-bottom: 0;
}
.header-bar_logo {
  width: 190px;
}
.header_video {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.header-text {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  margin-bottom: auto;
  margin-top: auto;
}
.header-text h1, .header-text h2{
  text-transform: uppercase;
}
.header-text h2{
  font-size: 16px;
}
.header-text_header {
  font-weight: 650;
  margin-top: -6px;
}
.header-text_header-big {
  font-size: 58px;
  -webkit-animation: fadein 2s;
  -moz-animation: fadein 2s;
  -ms-animation: fadein 2s;
  -o-animation: fadein 2s;
  animation: fadein 2s;
}

.header-text_header-small {
  font-size: 36px;
  -webkit-animation: fadein 3s;
  -moz-animation: fadein 3s;
  -ms-animation: fadein 3s;
  -o-animation: fadein 3s;
  animation: fadein 3s;
}

.header-text_description {
  font-weight: 400;
  font-size: 25px;
  line-height: 137.5%;
  -webkit-animation: fadein 3s;
  -moz-animation: fadein 3s;
  -ms-animation: fadein 3s;
  -o-animation: fadein 3s;
  animation: fadein 3s;
  max-width: 1000px;
  margin: 0 auto;
}
.header_button-down {
  margin: auto;
  position: relative;
  z-index: 3;
  margin-top: 0px;
  margin-bottom: 50px;
}
@media all and (max-width:600px) {
  .header-text_header-big {
    font-size: 36px;
    margin-bottom: .6em;
  }
  .header-text_header-small {
    font-size: 24px;
    margin-bottom: .6em;
  }
}
@media all and (max-width:959px) {

  .header {
    min-height: calc(100vh - 100px);
  }
}
.header-bar_logo-mobile {
  position: relative;
  z-index: 5;
  width: 200px;
  max-width: 70%;
  margin: 0.5em auto 1em;
}
</style>
