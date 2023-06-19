import service from '@/services'
import { indexCodes } from '@/choro/index-data';
import sidsList from '@/assets/sidsList';

export default {
  namespaced: true,
  state: {
    datasetsList: null,
    datasetsMeta: null,
    indicatorsCategories: null,
    indicatorsMeta: null,
    profileData: null,
    activeIndicatorData:null,
    MLTargetSize:null,
    MLPredictorSize:null
  },
  mutations: {
    setDatasetsList(state, data) {
      state.datasetsList = data;
    },
    setCategories(state, data) {
      state.indicatorsCategories = data;
    },
    setMeta(state, data) {
      state.indicatorsMeta = data;
    },
    setDatasetsMeta(state, data) {
      state.datasetsMeta = data;
    },
    setProfileData(state, data) {
      state.profileData = data;
    },
    setActiveIndicator(state, data) {
      state.activeIndicatorData = data;
    },
    setMLTargetSize(state, data) {
      state.MLTargetSize = data;
    },
    setMLPredictorSize(state, data) {
      state.MLPredictorSize = data;
    },
  },
  actions: {
    async getDatasetsList({ state, commit }) {
      if(!state.datasetsList){
        const datasetsData = await service.loadDatasetsList();
        let datasetsList = [];
        for(let datasetCode in datasetsData) {
          let dataset = datasetsData[datasetCode];
          dataset.code = datasetCode;
          datasetsList.push(datasetCode);
        }
        datasetsList.sort(function (a, b) {
          if (a.priority < b.priority) {
            return 1;
          }
          if (a.priority > b.priority) {
            return -1;
          }
          if (a.datasetName > b.datasetName) {
            return 1;
          }
          if (a.datasetName < b.datasetName) {
            return -1;
          }
          return 0;
        });
        commit("setDatasetsList", datasetsList);
        commit("setDatasetsMeta", datasetsData);
      }
    },
    async getProfileData({ state, commit }) {
      if(!state.profileData){
        let profileData = sidsList.reduce((list, country) => {
          list[country.iso] = country
          return list
        },{})
        commit("setProfileData", profileData);
      }
    },
    async getCategories({ state, commit }) {
      if(!state.indicatorsCategories){
        const categories = await service.loadIndicatorsCategories();
        commit("setCategories", categories);
      }
    },
    async getMeta({ state, commit }) {
      if(!state.indicatorsMeta){
        let meta = await service.loadIndicatorsMeta();
        meta = Object.keys(meta)
          .filter( indicatorCode => meta[indicatorCode].indicator)
          .reduce( (res, indicatorCode) => {
            res[indicatorCode] = meta[indicatorCode]
            res[indicatorCode].codesArray = [indicatorCode]
            return res
          }, {} );

        state.datasetsList.map((dataset) => {
          for(let category in state.indicatorsCategories[dataset]) {
            for(let subCategory in state.indicatorsCategories[dataset][category]) {
              for(let indicator in state.indicatorsCategories[dataset][category][subCategory]) {
                state.indicatorsCategories[dataset][category][subCategory][indicator].map(code => {
                  if(meta[code]) {
                    meta[code].codesArray = state.indicatorsCategories[dataset][category][subCategory][indicator]
                  }
                })
              }
            }
          }
        })

        commit("setMeta", meta);
      }
    },
    async getIndicatorData({ commit, dispatch}, indicatorCode) {
      let APIcode = indicatorCode,
      code = indicatorCode;
      if (indicatorCode == "region") {
        code = "hdr-hdi";///temp so has something to attach to data
      }
      if (Object.keys(indexCodes).includes(indicatorCode)) {
        APIcode="/indices/" + code.replace('-index','');
      } else {
        let codeSplit = code.split("-");
        APIcode=`/indicators/${codeSplit[0]}/${code}`
      }
      console.log('apiCode+++++++++++++', APIcode)
      /// read global values instead of only those of the sids countries, global values used for normalization
      if (APIcode === '/indices/mvi') APIcode = '/indices/mviGlobal'
      let indicatorData = await service.loadIndicatorData(APIcode);
      indicatorData = Object.keys(indexCodes).includes(indicatorCode) ? indicatorData : indicatorData[code];
      dispatch('ml/clearMlPredictionData',{}, {root:true})
      return commit('setActiveIndicator', indicatorData)
    },
    async getMLTargetSize({ state, commit }) {
      if(!state.MLTargetSize){
        const MLTargetSize = await service.loadMLTargetSize();
        commit("setMLTargetSize", MLTargetSize);
      }
    },
    async getMLPredictorSize({ state, commit }) {
      if(!state.MLPredictorSize){
        const MLPredictorSize = await service.loadMLPredictorSize();
        commit("setMLPredictorSize", MLPredictorSize);
      }
    },
  }
}
