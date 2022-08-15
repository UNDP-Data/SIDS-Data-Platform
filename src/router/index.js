import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import vuetify from '@/plugins/vuetify';

Vue.use(VueRouter)

const routes = [
  {
    path: '/portfolio/:goalsType?',
    link: '/portfolio',
    name: 'UNDP SIDS Portfolio',
    props: (to) => ({
      region: to.query.region || 'allSids',
      year: to.query.year || 'all',
      fundingCategory: decodeURIComponent(to.query.fundingCategory || 'All') ,
      fundingSource: decodeURIComponent(to.query.fundingSource || 'All Funding Sources'),
      goalsType: to.params.goalsType || 'sdgs'
    }),
    meta:{
      header:'portfolio.header',
      infoContent:'aboutThis-portfolio',
      linkText:'portfolio',
      icon:'portfolio'
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Portfolio/Portfolio.vue'),
    beforeEnter: async (to, from, next) => {
      store.commit('loader/setLoading', true);
      await store.dispatch('sids/getAllKeyData');
      await store.dispatch('sids/setSIDSData');
      await store.dispatch('sids/setFundingCategories');
      await store.dispatch('sids/generatePortfolioData', {
        region: to.query.region || 'allSids',
        year: to.query.year || 'all',
        category: decodeURIComponent(to.query.fundingCategory || 'All') ,
        source: decodeURIComponent(to.query.fundingSource || 'All Funding Sources'),
      });
      setTimeout(() => {
        store.commit('loader/setLoading', false);
      }, 500)
      next()
    }
  },
  {
    path: '/development-indicators/:indicator?/:year?/:chartType?',
    link: '/development-indicators',
    name: 'Development Indicators',
    component: () => import(/* webpackChunkName: "about" */ '../views/DevelopmentIndicators/DevelopmentIndicators.vue'),
    beforeEnter: async (to, from, next) => {
      store.commit('loader/setLoading', true);
      let chartType = to.params.chartType || 'choro',
      indicator = to.params.indicator || 'region',
      year = to.params.year || 'recentValue';
      if(document.body.clientWidth - 40 < 800 && indicator === 'region') {
        indicator = 'hdr-137506'
      }
      if((vuetify.framework.breakpoint.xs || vuetify.framework.breakpoint.sm)
        && chartType !== 'series'
      ) {
        chartType = 'bars'
      }
      await store.dispatch('indicators/getDatasetsList');
      await store.dispatch('indicators/getCategories');
      await store.dispatch('indicators/getMeta');
      await store.dispatch('indicators/getProfileData');
      await store.dispatch('indicators/getMLTargetSize');
      await store.dispatch('indicators/getMLPredictorSize');
      if(
        indicator === to.params.indicator &&
        year === to.params.year &&
        chartType === to.params.chartType
      ) {
        setTimeout(() => {
          store.commit('loader/setLoading', false);
        }, 500)
        next()
      } else {
        setTimeout(() => {
          store.commit('loader/setLoading', false);
        }, 500)
        next({ path: `/development-indicators/${indicator}/${year}/${chartType}`})
      }
    },
    meta:{
      header:'indicators.headerIndicators',
      infoContent:'aboutThis-indicators',
      icon:'indicators',
      linkText:'indicators'
    },
    props: (to) => (
      {
        chartType: to.params.chartType,
        indicator: to.params.indicator,
        year: to.params.year,
        page: 'devIdictors'
      }
    ),
  },
  {
    path: '/vulnerability/:indicator?/:chartType?',
    link: '/vulnerability',
    name: 'Vulnerability',
    component: () => import(/* webpackChunkName: "about" */ '../views/DevelopmentIndicators/DevelopmentIndicators.vue'),
    beforeEnter: async (to, from, next) => {
      store.commit('loader/setLoading', true);
      let chartType = to.params.chartType || 'spider'
      if((vuetify.framework.breakpoint.xs || vuetify.framework.breakpoint.sm)
        && chartType !== 'series'
      ) {
        chartType = 'bars'
      }
      await store.dispatch('indicators/getDatasetsList');
      await store.dispatch('indicators/getCategories');
      await store.dispatch('indicators/getMeta');
      await store.dispatch('indicators/getProfileData');
      if(chartType === to.params.chartType) {
        setTimeout(() => {
          store.commit('loader/setLoading', false);
        }, 500)
        next()
      } else {
        setTimeout(() => {
          store.commit('loader/setLoading', false);
        }, 500)
        next({ path: `/vulnerability/mvi-index/${chartType}`})
      }
    },
    meta:{
      header:'indicators.headerMVI',
      infoContent:'aboutThis-mvi',
      icon:'MVI',
      linkText:'mvi'
    },
    props: (to) => (
      {
        chartType: to.params.chartType,
        indicator: 'mvi-index',
        page: 'mvi',
        year: 'recentValue',
      }
    ),
  },
  {
    path: '/country-profiles/:country?',
    link: '/country-profiles',
    name: 'Country Profiles',
    component: () => import(/* webpackChunkName: "about" */ '../views/CountryProfiles/CountryProfiles.vue'),
    beforeEnter: async (to, from, next) => {
      store.commit('loader/setLoading', true);
      await store.dispatch('profiles/getIndicatorsMetadata');
      if(!to.params.country) {
        setTimeout(() => {
          store.commit('loader/setLoading', false);
        }, 500)
        next({ path: `/country-profiles/caboVerde`})
      }
      setTimeout(() => {
        store.commit('loader/setLoading', false);
      }, 500)
      next();
    },
    meta:{
      header:'countryProfile.header',
      infoContent:'aboutThis-profiles',
      icon:'profiles',
      linkText:'profiles'
    },
    props: (route) => ({
      activeCountryId: route.params.country || '',
      compareIdsList: route.query.compare && route.query.compare.split(',') || []
    }),
  },
  {
    path: '/geospatial-data',
    link: '/geospatial-data',
    name: 'Geospatial Data',
    meta:{
      header:'gis.header',
      icon:'GIS',
      linkText:'gis'
    },
    beforeEnter: async (to, from, next) => {
      await store.dispatch('gis/loadDatasets');
      setTimeout(() => {
        store.commit('loader/setLoading', false);
      }, 500)
      next();
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/GeospatialData/GeospatialData.vue')
  },
  {
    path: '/about',
    link: '/about',
    name: 'About',
    meta:{
      header:'about.header',
      icon:'about',
      linkText:'about'
    },
    beforeEnter: async (to, from, next) => {
      store.commit('loader/setLoading', true);
      await store.dispatch('texts/loadResourcesData');
      setTimeout(() => {
        store.commit('loader/setLoading', false);
      }, 500)
      next();
    },
    component: () => import(/* webpackChunkName: "about" */ '../views//About/About.vue')
  },
  {
    path: '*',
    redirect: function() {
      return window.innerWidth < 960 ? '/country-profiles' : '/portfolio'
    }
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (toRoute, fromRoute, next) => {
  let pagetitle = toRoute && toRoute.name ? toRoute.name : 'Home';
  window.document.title = `${pagetitle} - UNDP SIDS Data Platform`
  next();
})
export { router, routes }
