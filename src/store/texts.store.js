import service from '@/services'

export default {
  namespaced: true,
  state: {
    resources: null
  },
  mutations: {
    setResources(state, resources) {
      state.resources = resources;
    }
  },
  actions: {
    async loadResourcesData({ state, commit }) {
      if(!state.resource){
        const resources = await service.loadResourcesData();
        commit("setResources", resources.additionalResources);
      }
    }
  }
};
