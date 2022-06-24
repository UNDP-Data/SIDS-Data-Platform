import service from '@/services'
import sidsList from '@/assets/sidsList'


export default {
  namespaced: true,
  state: {
    keyMetadata: null,
    allKeyData: null,
    fundingCategories: null,
    SIDSDataWithDonors: null,
    portfolioSources:null,
    countryList: null,
    portfolioData: null
  },
  mutations: {
    setMetaData(state, data) {
      state.keyMetadata = data;
    },
    setKeyData(state, data) {
      state.allKeyData = data;
    },
    setFundingCategories(state, data) {
      state.fundingCategories = data;
    },
    setSIDSData(state, data) {
      state.SIDSData = data;
    },
    setSIDSDataWithDonors(state, data) {
      state.SIDSDataWithDonors = data;
    },
    setCountryList(state, data) {
      state.countryList = data;
    },
    setPortfolioData(state, data) {
      state.portfolioData = data;
    },
    setPortfolioSources(state, data) {
      state.portfolioSources = data;
    }
  },
  actions: {
    async getMetaData({ state, commit }) {
      if(!state.keyMetadata){
        const metaData = await service.loadMetaData();
        commit("setMetaData", metaData);
      }
    },
    async getAllKeyData({ dispatch, state, commit }) {
      if(!state.allKeyData){
        const allKeyData = await service.loadAllKeyData();
        commit("setKeyData", allKeyData);
        dispatch('generateCountryList', allKeyData)
      }
    },
    async setFundingCategories({ state, commit, dispatch }) {
      if(!state.fundingCategories){
        const fundingCategories = await service.loadFundingCategories();
        const filteredData = fundingCategories.filter(category => {
          return state.SIDSData.some(source => {
            return source.donors && source.donors.includes(category.name)
          })
        })
        commit("setFundingCategories", filteredData);
        dispatch('setFullDonorsInfo');
      }
    },
    async setSIDSData({ state, commit }) {
      if(!state.SIDSData){
        const SIDSData = await service.loadSIDSData();
        commit("setSIDSData", SIDSData);
      }
    },
    generateCountryList({ commit }, data) {
      const countryList = [];
      for(let country in data) {
        let profile = data[country]['Profile'];
        profile.id = country;
        // profile.code = codes[country]
        countryList.push(profile);
      }
      console.log(countryList.map(c => c.Country))
      commit("setCountryList", countryList);
    },
    setFullDonorsInfo({ state, commit }) {
      let projectsWithDonorInfo = state.SIDSData.map(project => {
        let donorInfo
        if(project.donors) {
          donorInfo = project.donors.split(';').map(donorName => {
            let donor = state.fundingCategories.find((category) => {
              return category.name === donorName;
            });
            if(typeof donor === 'undefined') {
              return {
                name: donorName
              }
            }
            return donor
          });
        } else {
          donorInfo = []
        }
        project.donors = donorInfo;
        return project
      })
      commit('setSIDSDataWithDonors', projectsWithDonorInfo)
    },
    generatePortfolioData({ state, commit }, {year, region, category, source}) {
      let sourcesFilteringProjects = [];
      let filteredData = state.SIDSDataWithDonors.filter(project => {
        if(region !== 'All' && (project.region !== region && project.country !== region)) {
          return false
        }
        if(year !== 'all' && project.year !== year) {
          return false
        }
        if(category !== 'All') {
          let res = project.donors.some(donor => {
            return checkProjectsCategory(project, donor, category)
          })
          if(!res) {
            return false
          }
        }
        sourcesFilteringProjects.push(project)
        if(source !== 'All Funding Sources') {
          let res = !project.donors.some((donor) => {
            return donor.name === source
          })
          if(res) {
            return false
          }
        }
        return true
      })
      commit("setPortfolioData", filteredData);

      const projectsString = JSON.stringify(sourcesFilteringProjects);
      let sources = state.fundingCategories.filter(category => {
        return projectsString.includes(category.name)
      })
      if(category !== 'All') {
        sources = sources.filter((donor) => checkDonorsCategory(donor, category))
      }
      sources.unshift({
        name:'All Funding Sources',
        subCategory:'all'
      })
      commit("setPortfolioSources", sources);
      function checkProjectsCategory(project, donor, category) {
        if(category === 'Programme Countries') {
          if(donor.category === 'Government' && project.country) {
            let country = sidsList.find(country => {
              return project.country === country.iso
            })
            return country && country.name === donor.subCategory;
          }
        }
        else if(category === 'Donor Countries') {
          return project.country  != donor.subCategory;
        }
        else {
          return donor.category === category;
        }
      }
      function checkDonorsCategory(donor, category) {
        if(category === 'Programme Countries') {
          return donor.category === 'Government' && sidsList.some((country) =>  {
            return country.name === donor.subCategory
          });
        }
        else if(category === 'Donor Countries') {
          return donor.category === 'Government' && sidsList.every(country =>  country.name != donor.subCategory);
        }
        else {
          return donor.category === category;
        }
      }
    }
  }
}
