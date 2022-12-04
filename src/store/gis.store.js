import service from '@/services'

export default {
  namespaced: true,
  state: {
    datasets: null
  },
  mutations: {
    setDatasets(state, datasets) {
      state.datasets = datasets;
    }
  },
  actions: {
    async loadDatasets({ state, commit }) {
      if(!state.datasets){
        const datasets = await service.loadGISDatasets();
        console.log(datasets);
        commit("setDatasets", Object.values(datasets));
      }
    }
  }
};
