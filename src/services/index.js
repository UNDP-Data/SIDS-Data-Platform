import axios from 'axios';
import * as d3 from 'd3';
const API_URl = process.env.VUE_APP_API_PATH + '/data';
const ML_API_URL = 'https://ml-aks-ingress.eastus.cloudapp.azure.com';

export default {
  loadMLestimate,
  loadMLindicatorData,
  loadFundingCategories,
  loadProjectData,
  loadIndicatorsCategories,
  loadGISDatasets,
  loadIndicatorsMeta,
  loadSidsSVG,
  loadMapLocations,
  loadIndicatorData,
  loadCountryProfile,
  loadProfileIndicarotsMetadata,
  loadDatasetsList,
  loadTextContent,
  loadML,
  loadMLTargetSize,
  loadMLPredictorSize,
  loadGISLayer,
  loadLang,
  loadResourcesData,
  loadShareText
}

async function loadCountryProfile(isoCode) {
  const resp = await axios.get(`${API_URl}/profiles/${isoCode}.json`)
  return resp.data;
}
async function loadProfileIndicarotsMetadata() {
  const resp = await axios.get(`${API_URl}/profiles/countryProfileMetadata.json`)
  return resp.data;
}

async function loadDatasetsList(){
  const resp = await axios.get(`${API_URl}/indicators/datasetMeta.json`);
  return resp.data;
}
async function loadFundingCategories () {
  const resp = await axios.get(`${API_URl}/portfolio/fundingCategories.json`);
  return resp.data
}
async function loadProjectData () {
  const resp = await axios.get(`${API_URl}/portfolio/sidsPortfolio.json`)
  return resp.data
}
async function loadIndicatorsCategories () {
  const resp = await axios.get(`${API_URl}/indicators/indicatorCategories.json`)
  return resp.data
}
async function loadIndicatorsMeta () {
  const resp = await axios.get(`${API_URl}/indicators/indicatorMeta.json`)
  return resp.data
}
async function loadSidsSVG () {
  const resp = await d3.xml(require(`@/assets/sidsSVG8.svg`))
  return resp
}
async function loadMapLocations () {
  const resp = await axios.get(`${API_URl}/indicators/mapLocations.json`)
  return resp.data
}

async function loadIndicatorData (apiCode) {
  const resp = await axios.get(`${API_URl}${apiCode}.json`)
  return resp.data
}

async function loadResourcesData () {
  const resp = await axios.get(`${API_URl}/cms/resources.json`)
  return resp.data
}

async function loadTextContent () {
  const resp = await axios.get(`${API_URl}/cms/app/en.json`)
  return resp.data
}


async function loadML (data,source) {
  const resp = await axios.post(`${ML_API_URL}/twolvlImp/predict`, data, {
    cancelToken: source.token,
    headers: {
      'Access-Control-Allow-Origin': "*"
    }
  })
  return resp.data
}

async function loadGISDatasets () {
  const resp = await axios.get(`${API_URl}/gis/gisDatasetMeta.json`)
  return resp.data;
}

async function loadGISLayer (id) {
  const resp = await axios.get(`${API_URl}/gis/layers/${id}.json`)
  return resp.data;
}

async function loadMLindicatorData ({model, indicator, dataset}) {
  try {
    const resp = await axios.get(`${API_URl}/ml/model${model}/${dataset}/${indicator}.json`)
    return resp.data
  } catch {
    return null
  }
}


async function loadMLestimate (data) {
  const resp = await axios.post(`${ML_API_URL}/twolvlImp/estimate`, data, {
    headers: {
      'Access-Control-Allow-Origin': "*"
    }
  })
  return resp.data
}


async function loadMLTargetSize () {
  // const resp = await axios.get(`${ML_API_URL}/imputation/target_sample_size`)
  return 25
}

async function loadMLPredictorSize () {
  // const resp = await axios.get(`${ML_API_URL}/imputation/predictor_sample_size`)
  return 25
}

async function loadLang(lang) {
  let resp = await axios.get(`${API_URl}/cms/app/${lang}.json`);
  return resp.data
}

async function loadShareText() {
  let resp = await axios.get(`${API_URl}/cms/shareText.json`);
  return resp.data
}
