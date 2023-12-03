<template>
  <div class="footer-root">
    <div class="footerEl">
      <div class="footer-container">
        <div
          style='margin: 0; display: flex; align-items: center; gap: 1rem;'
        >
          <a href='https://www.undp.org/' target='_blank' rel='noreferrer'>
            <img alt='undp logo' src="@/assets/media/logo.png" style='width: 60px;' />
          </a>
          <h5 class='undp-typography margin-bottom-00'>
            United Nations
            <br />
            Development Programme
          </h5>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: baseline;">
        <div>
          <p
            class='undp-typography margin-top-05 margin-bottom-00'
            style="padding: 0 0.75rem; font-size: 1rem;"
          >
            © 2023 United Nations Development Programme
          </p>
        </div>
        <a
          href='https://www.undp.org/copyright-terms-use'
          target='_blank'
          rel='noreferrer'
          style="text-decoration: none;"
        >
          <p class='undp-typography margin-top-05 terms-of-use'>
            Terms Of Use
          </p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rootFooter',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer-root {
  height: auto;
  width: 100%;
  font-family: var(--fontFamily);
  background-color: var(--blue-600);
  padding: 3.25rem 0.75rem 3rem 0.75rem;
  color: var(--white);
  z-index: 10;
  position: absolute;
}

.footerEl {
  margin: auto;
  width: 83.3333333333%;
}
.footer-container {
  display: flex;
  justify-content: space-between;
  margin: 0 auto var(--spacing-07) auto;
  padding: 0 0.75rem var(--spacing-09) 0.75rem;
  border-bottom: 1px solid var(--white);
}
.footer-root_text {
  margin-left: 46px;
  color: #FFFFFF;
  font-weight: 600;
  font-size: 14px;
}
@media (max-width:639px) {
  .footer-root_text {
    margin-left:0;
    padding: 24px 24px 0 24px;
    text-align: center;
  }
  .footer-root {
    display: block;
  }
  .l-selector {
    float:right;
    max-width: 260px;
  }
}

.terms-of-use{  
  padding: 0 0.75rem;
  color: var(--white);
  text-decoration: none;
  font-size: 1rem !important;
}

.terms-of-use:hover {
  opacity: 0.7;
}

</style>
