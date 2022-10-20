<template>
  <div class="footer-root">
    <div class="footer-spacer mr-auto ml-4">
    </div>
    <p class="footer-root_text mr-auto ml-auto">{{$t('root.footer.poweredBy')}}</p>
    <language-selector class="ml-auto mr-4"/>
  </div>
</template>

<script>
import LanguageSelector from '@/components/LanguageSelector'
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  components: {
    LanguageSelector
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer-root {
  width: 100%;
  background: #e0e1e9;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0px 90px 28px -50px #5f5c8721;
}
.footer-root_text {
  margin: 0;
  color: #868686;
}
.footer-spacer {
  min-width: 260px;
}
</style>
