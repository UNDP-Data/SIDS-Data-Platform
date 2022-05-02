import service from '@/services';
import axios from 'axios'
export default {
  namespaced: true,
  state: {
    mlLoading: false,
    mlModel:null,
    mlData:null,
    mlStartTime:null,
    source:null
  },
  mutations: {
    setLoading(state, loader) {
      state.mlLoading = loader;
    },
    setMLmodel(state, mlModel) {
      state.mlModel = mlModel;
    },
    setMLData(state, mlData) {
      state.mlData = mlData;
    },
    setMLStartTime(state, mlStartTime) {
      state.mlStartTime = mlStartTime;
    },
    setSource(state, source) {
      state.source = source;
    }
  },
  actions:{
    async loadModel({ commit }, req) {
      let source = axios.CancelToken.source();
      commit('setSource', source);
      commit('setLoading', true);
      commit('setMLmodel', req);
      commit('setMLStartTime', new Date().getTime());
      try {
        let res
        res = await service.loadML(req, source);
        commit('setMLData', res);
        commit('setLoading', false);
        return res;
      } catch (e) {
        commit('setLoading', false);
        commit('setMLmodel', null);
        throw(e)
      }
    },
    async clearModel({ commit }) {
      commit('setMLmodel', null);
    }
  }
};
