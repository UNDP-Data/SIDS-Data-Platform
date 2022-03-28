export default {
  namespaced: true,
  state: {
    loading: true,
  },
  mutations: {
    setLoading(state, loader) {
      state.loading = loader;
    },
  },
};
