import * as d3 from 'd3';

import {
  initVizEngine,
  initCountrySvgs,
  appendCountryTitles,
  appendAllElements,
  appendCountryTitles3,
  appendCountryTitles2,
  appendCountryRectangles,
  appendCountryCircles,
  initYAxis,
  initChoroLegend,
  initXAxis,
  hideChoroLegend,
  showChoroLegend} from './vizEngineInit'


  import { updateVizEngine,
  updateLinesAndMap ,
  updateCountrySvgColors,
  updateCountryPositions,
  countriesWithNoData,
  updateCountryTitles,
  updateRectangles,
  updateLabels,
  updateCircles,
  updateChoroLegend,
  updateIndexRectangles,
  updateBarAxis,
  updateYAxis
} from './vizEngineUpdate';

  import {
    processVizElementAttributes,
    vizTransform,
    rectTransform,
    labelTransform,
    circleTransform,
    textTransform
  } from './vizEngineElementAttributes'

    // <script src="scripts/vizEngineUpdate.js"></script>
    // <script src="scripts/vizEngineElementAttributes.js"></script>
    // <script src="scripts/vizEngineGlobals.js"></script>
    // <script src="scripts/vizEngineHandlers.js"></script>
    // <script src="scripts/vizEngineHelperFunctions.js"></script>
    // <script src="scripts/vizEngineInit.js"></script>
    // <script src="scripts/processIndexData.js"></script>
export default class Choro {
  constructor({viz, year, indicatorCode, page, indicatorMeta, legendContainerSelector, mapContainerSelector, profileData, vizContainerWidth, vizContainerHeight, sidsXML, mapLocations}) {
    this.initState({viz, year, indicatorCode, page, indicatorMeta,legendContainerSelector, mapLocations, mapContainerSelector, vizContainerWidth, vizContainerHeight, profileData})
    this.initVizEngine({sidsXML})
  }
  initState({
    viz,
    year,
    page,
    indicatorMeta,
    indicatorCode,
    mapLocations,
    mapContainerSelector,
    legendContainerSelector,
    vizContainerWidth,
    vizContainerHeight,
    profileData}){
    this.mapLocations = mapLocations;
    this.indiSelections = {
      viz,
      sortby: 'Rank',
      year,
      page,
      mviPreset:'mviLi'
      //   indiSelections["viz"] = $(".selectedViz")[0].children[0].innerHTML;
      //   indiSelections["page"] = $(".selectedPage").attr("id");
      //   indiSelections["sortby"] = $(".selectedSortby")[0].children[0].innerHTML;
      //   indiSelections["year"] = "recentValue"; /// temp until year selector is in place
      //   indiSelections["mviPreset"] = $(".selectedMviPreset")[0].id;
    };
    this.bboxInit = 0;
    this.bboxDict = {};
    this.indicatorMeta = indicatorMeta;
    this.textBBoxDict = {};
    this.legendContainerSelector = legendContainerSelector;
    this.profileData = profileData;
    this.main_chart_svg = d3.select(mapContainerSelector)
      .append("svg")
      .attr("width", vizContainerWidth)
      .attr("height", vizContainerHeight);
    this.choro_legend_svg = d3.select(legendContainerSelector)
      .append("svg")
      .attr("width", vizContainerWidth)
      .attr("height", vizContainerHeight);
    if(indicatorCode!=='region'){
      this.updateVizEngine(indicatorCode)
    }
  }
  updateVizType (vizType) {
    this.indiSelections.viz = vizType;
    this.updateVizEngine(this.indicatorCodeInitial)
  }
  updatePageType ({page, chartType}) {
    this.indiSelections.page = page;
    this.indiSelections.viz = chartType;
    this.updateVizEngine(this.indicatorCodeInitial)
  }
  updateSortingType (sorting) {
    this.indiSelections.sortby = sorting;
    this.updateVizEngine(this.indicatorCodeInitial)
  }
}
Choro.prototype.initVizEngine = initVizEngine;
Choro.prototype.initCountrySvgs = initCountrySvgs;
Choro.prototype.appendCountryTitles = appendCountryTitles;
Choro.prototype.appendAllElements = appendAllElements;
Choro.prototype.appendCountryTitles3 = appendCountryTitles3;
Choro.prototype.appendCountryTitles2 = appendCountryTitles2;
Choro.prototype.appendCountryRectangles = appendCountryRectangles;
Choro.prototype.appendCountryCircles = appendCountryCircles;
Choro.prototype.initYAxis = initYAxis;
Choro.prototype.updateVizEngine = updateVizEngine;
Choro.prototype.updateLinesAndMap = updateLinesAndMap;
Choro.prototype.initChoroLegend = initChoroLegend;
Choro.prototype.processVizElementAttributes = processVizElementAttributes;
Choro.prototype.updateCountrySvgColors = updateCountrySvgColors;
Choro.prototype.vizTransform = vizTransform;
Choro.prototype.rectTransform = rectTransform;
Choro.prototype.labelTransform = labelTransform;
Choro.prototype.circleTransform = circleTransform;
Choro.prototype.textTransform = textTransform;
Choro.prototype.updateCountryPositions = updateCountryPositions;
Choro.prototype.countriesWithNoData = countriesWithNoData;
Choro.prototype.updateCountryTitles = updateCountryTitles;
Choro.prototype.updateRectangles = updateRectangles;
Choro.prototype.updateLabels = updateLabels;
Choro.prototype.updateCircles = updateCircles;
Choro.prototype.updateChoroLegend = updateChoroLegend;
Choro.prototype.hideChoroLegend = hideChoroLegend;
Choro.prototype.showChoroLegend = showChoroLegend;
Choro.prototype.updateIndexRectangles = updateIndexRectangles
Choro.prototype.updateBarAxis = updateBarAxis;
Choro.prototype.initXAxis = initXAxis;
Choro.prototype.updateYAxis = updateYAxis;