<template>
  <div class="loader-root">
    <div class="lds-ellipsis undp-loader"></div>
  </div>
</template>

<script>
export default {
  name: 'RootLoader'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.loader-root {
  width: 100%;
  top: 0;
  bottom: 0;
  position: absolute;
  background: rgba(0,0,0,0.2);
  z-index: 99999;
}
.lds-ellipsis {
  display: inline-block;
  position: absolute;
  top: 25vh;
  left: 50%;
  width: 80px;
  height: 80px;
  transform: translate(-50%);
}
.lds-ellipsis div {
  position: absolute;
  top: 33px;
}
@keyframes loader-animation-undp {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.undp-loader {
  animation: loader-animation-undp 2s linear infinite;
  border-radius: 50%;
  border: 8px solid var(--blue-600);
  border-top: 8px solid var(--gray-300);
  height: 40px;
  width: 40px;
}

@media (min-width: 48em) {
  .undp-loader {
    border: 14px solid var(--blue-600);
    border-top: 14px solid var(--gray-300);
    height: 96px;
    width: 96px;
  }
}
</style>
