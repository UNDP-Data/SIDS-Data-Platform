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
      fundingCategory: decodeURIComponent(to.query.fundingCategory || 'all') ,
      fundingSource: decodeURIComponent(to.query.fundingSource || 'all'),
      goalsType: to.params.goalsType || 'sdgs'
    }),
    meta:{
      template: 'PlatformPages',
      header:'portfolio.header',
      description:'A digital tool for analyzing the UNDP SIDS Offer Portfolio across the SDGs, SAMOA Pathway priorities, and six UNDP Signature Solutions.',
      infoContent:'aboutThis-portfolio',
      linkText:'portfolio',
      icon:'portfolio'
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "portfolio" */ '../views/Portfolio/Portfolio.vue'),
    beforeEnter: async (to, from, next) => {
      store.commit('loader/setLoading', true);
      await store.dispatch('setFundingCategories');
      await store.dispatch('setProjectData');
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
    component: () => import(/* webpackChunkName: "indicators" */ '../views/DevelopmentIndicators/DevelopmentIndicators.vue'),
    beforeEnter: async (to, from, next) => {
      store.commit('loader/setLoading', true);
      let chartType = to.params.chartType || 'choro',
      indicator = to.params.indicator || 'region',
      year = to.params.year || 'recentValue';
      if(document.body.clientWidth - 40 < 800 && indicator === 'region') {
        indicator = 'hdr-hdi'
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
      template: 'PlatformPages',
      header:'indicators.headerIndicators',
      description:'A database of over 4000 development indicators for SIDS, compiled from 22 sources and featured alongside visualization and analytic tools.',
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
    component: () => import(/* webpackChunkName: "indicators" */ '../views/DevelopmentIndicators/DevelopmentIndicators.vue'),
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
      template: 'PlatformPages',
      header:'indicators.headerMVI',
      infoContent:'aboutThis-mvi',
      description:'A customizable Multidimensional Vulnerability Index (MVI) for SIDS to analyze environmental, geographic, economic, and financial vulnerability.',
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
    component: () => import(/* webpackChunkName: "profiles" */ '../views/CountryProfiles/CountryProfiles.vue'),
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
      template: 'PlatformPages',
      header:'countryProfile.header',
      description:'Country profiles for Small Island Developing States with data across the pillars of the UNDP’s SIDS Offer, financial statistics, and vulnerability index.',
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
      template: 'PlatformPages',
      header:'gis.header',
      description:'A SIDS GIS portal and database compiled from more than 80 datasets and research studies with coverage of Small Island Developing States.',
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
    component: () => import(/* webpackChunkName: "gis" */ '../views/GeospatialData/GeospatialData.vue')
  },
  {
    path: '/about',
    link: '/about',
    name: 'About',
    meta:{
      template: 'PlatformPages',
      header:'about.header',
      description:'A digital instrument for supporting SIDS in following up on the SAMOA Pathway and building data-driven policy and development frameworks.',
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
    component: () => import(/* webpackChunkName: "about" */ '../views/About/About.vue')
  },
  {
    path: '',
    link: '/home',
    name: 'Homepage',
    component: () => import(/* webpackChunkName: "indicators" */ '../views/Homepage/Homepage.vue'),
    meta:{
      template: 'Homepage',
      header:'',
      description:'A digital instrument for supporting SIDS in following up on the SAMOA Pathway and building data-driven policy and development frameworks.',
      icon:'',
      linkText:'home'
    },
    beforeEnter: async (to, from, next) => {
      store.commit('loader/setLoading', true);
      await store.dispatch('texts/loadResourcesData');
      setTimeout(() => {
        store.commit('loader/setLoading', false);
      }, 500)
      next();
    },
  },
  {
    path: '*',
    redirect: '',/*function() {
      return window.innerWidth < 960 ? '/country-profiles' : '/portfolio'
    }*/
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (toRoute, fromRoute, next) => {
  let pagetitle = toRoute && toRoute.name ? toRoute.name : 'Home';
  window.document.title = `${pagetitle} - UNDP SIDS Data Platform`;
  document.querySelector('[data-description]').innerHTML = toRoute.meta.description
  next();
})
export { router, routes }
