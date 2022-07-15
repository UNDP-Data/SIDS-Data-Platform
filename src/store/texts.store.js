import service from '@/services'

export default {
  namespaced: true,
  state: {
    textContent: null,
    resources: null
  },
  mutations: {
    setTextContent(state, textContent) {
      state.textContent = textContent;
    },
    setResources(state, resources) {
      state.resources = resources;
    }
  },
  actions: {
    async getTextContent({ state, commit }) {
      if(!state.textContent){
        const textContent = await service.loadTextContent();
        commit("setTextContent", textContent);
      }
    },
    async loadResourcesData({ state, commit }) {
      if(!state.resource){
        const resources = await service.loadResourcesData();
        commit("setResources", resources);
      }
    }
  }
};
