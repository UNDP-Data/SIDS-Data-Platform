import service from '@/services'


export default {
  namespaced: true,
  state: {
    fundingCategories: null,
    projectData: null,
  },
  mutations: {
    setFundingCategories(state, data) {
      state.fundingCategories = data;
    },
    setProjectData(state, data) {
      state.projectData = data;
    },
  },
  actions: {
    async setFundingCategories({ state, commit }) {
      if(!state.fundingCategories){
        const fundingCategories = await service.loadFundingCategories();
        commit("setFundingCategories", fundingCategories);
      }
    },
    async setProjectData({ state, commit }) {
      if(!state.projectData){
        const projectData = await service.loadProjectData();
        commit("setProjectData", projectData);
      }
    }
  }
}
