<template>
  <div class="footer-root">
    <p class="footer-root_text pt-3">{{$t('root.footer.poweredBy')}}</p>
    <language-selector class="l-selector ml-4 ml-sm-auto mr-4"/>
  </div>
</template>

<script>
import LanguageSelector from '@/components/LanguageSelector'
export default {
  name: 'rootFooter',
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
  background: #232E3D;
  height: 86px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.footer-root_text {
  margin-left: 46px;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 14px;
}
@media (max-width:639px) {
  .footer-root_text {
    padding: 24px;
    text-align: center;
  }
  .footer-root {
    display: block;
  }
  .l-selector {
    float: right;
    max-width: 260px;
  }
}
</style>
