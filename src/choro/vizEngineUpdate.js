import * as d3 from 'd3';

import {
  hues,
  totalIndexRectangles,
  regionCountries
} from './vizEngineGlobals';

import {
  regionColors,
  getRandomInt,
  nFormatter,
  filterObject
} from './vizEngineHelperFunctions';

import {
  indexCodes,
  indexWeightsDict
} from './index-data';
///////////////////////
//////Main update function
//////////////////////////////////////


export function updateVizEngine(indicatorCode) {

  this.indicatorCodeInitial = indicatorCode;
  this.indicatorCode = indicatorCode;

  if(this.page=="mvi"){
    this.indicatorCode = "mvi-index";
  }

  if (this.indicatorCode == "region") {
    this.indicatorCode = "hdr-hdi";///temp so has something to attach to data
  }
  if (Object.keys(indexCodes).includes(this.indicatorCode)) {
    this.vizMode = "index";
  } else {
    this.vizMode = "indicator";
  }
  this.updateVizBlocks();

  this.updateLinesAndMap();
  if(this.vizMode=="indicator"){
    this.indicatorData = this.data;
    this.indexData={};
    this.indexWeights={"subindices":{},"normalization":false};
  }
  if(this.vizMode=="index"){
    this.indexData = this.getIndexValues(this.data);
    this.indicatorData = this.indexData.index
    this.indexWeights = JSON.parse(JSON.stringify(indexWeightsDict[this.indicatorCode]));//deep copy
    this.countryOrder = this.getIndexCountryList()
    let spiderData = this.processSpiderData()
    this.spiderData=spiderData
    this.drawIndexSpider()
  }
  let quantize = quantizeData(this.indicatorData,this.indiSelections),
  vizElementAttributes = this.processVizElementAttributes(),
  noData = this.countriesWithNoData();
    if(!this.firstIndicatorInit){
      this.initChoroLegend(quantize);// require data to be loaded
      this.initXAxis()//messes chorolegend if it is too soon
      this.firstIndicatorInit=1;
    }

    this.updateCountrySvgColors(quantize);//currently color data is computed here (quantize)
    this.updateCountryPositions(vizElementAttributes);
    this.updateCountryTitles(vizElementAttributes, noData);
    this.updateRectangles(vizElementAttributes);
    this.updateIndexRectangles(vizElementAttributes);
    this.updateLabels(vizElementAttributes, noData); //selectedPage, selectedViz, selectedYear,selectedSortby, indicatorData, noData)
    this.updateCircles(vizElementAttributes);
// //    updateCountryLines(vizElementAttributes);
    this.updateRegionLables(noData);
    this.updateChoroLegend(quantize);
    this.updateBarAxis();
    this.updateYAxis();
    if (this.indiSelections["viz"] == "series") {
      let timeData={};
      timeData[this.indicatorCode] = JSON.parse(JSON.stringify(this.indicatorData));
      let dataset = this.parse(timeData);
      let optionSelected = {
        countryGroupOption: this.countryType,
        datasetOption: this.indicatorCode,
      };
      this.updateTimeChart({ dataset, optionSelected });
    }
    if(this.vizWidth < 800) {
      if(this.indiSelections["viz"] === "bars") {
        let vizContainerHeight = (Object.keys(vizElementAttributes).length - Object.keys(noData).length) * 30;
        if(this.indiSelections["sortby"] === 'region') {
          vizContainerHeight+= 30 * 6
        }
        this.main_chart_svg
          .attr("height", vizContainerHeight);
        this.choro_legend_svg
          .attr("height", vizContainerHeight);
      }
    }
    this.updateErrorLines(vizElementAttributes);
//
//       updateVizSliders()//again, just for fun
}

///////////////////////
//////Run all update functions
//////////////////////////////////////
//
//
function quantizeData(indicatorData,indiSelections){
    let indicatorDataYear = indicatorData["data"][indiSelections["year"]],
    hueNum = getRandomInt(0, 3);
    if(indicatorData.upperIntervals) {
      indicatorDataYear = {...indicatorData["data"][indiSelections["year"]], ...indicatorData.upperIntervals[indiSelections.year]}
    }
    let max = Math.max(
        ...Object.values(indicatorDataYear).filter(function (el) {
          return !isNaN(parseFloat(el)) && isFinite(el);
        })
      ),
    min = 0;

      // Math.min(...Object.values(indicatorData).filter(function (el) { return !isNaN(parseFloat(el)) && isFinite(el);  }))
    if(max === min) {
      max+= 1
    }
      //quantize is the scale used for the choropleth and the legend
    let quantize = d3
      .scaleQuantize()
      .domain([min, max])
      .range(
        d3.range(9).map(function (i) {
          return hues[hueNum] + i + "-9";
        })
      );

   return quantize
}
//
export function updateErrorLines(vizElementAttributes) {
  // let rootThis = this;
  let rootThis = this;
  if(this.indicatorData.lowerIntervals) {
    if(rootThis.indiSelections["viz"] == "bars") {
      this.sidsMapSelection
        .selectAll("g")
        .append("line")
        .classed("errorLine", true)
        .style("stroke", "black")
        .style("stroke-width", 3)
        .attr("x1", function() {
          if(rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] !== 'No Data' &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections["year"]] &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id]) {
            let quant = rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] / vizElementAttributes[this.parentNode.id].RT.width;
            return vizElementAttributes[this.parentNode.id].RT.x + rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id] / quant
          }
          return 0
        })
        .attr("y1", function() {
          return vizElementAttributes[this.parentNode.id].RT.y + vizElementAttributes[this.parentNode.id].RT.height/2
        })
        .attr("x2", function() {
          if(rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] !== 'No Data' &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections["year"]]  && rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][this.parentNode.id]) {
            let quant = rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] / vizElementAttributes[this.parentNode.id].RT.width;
            return vizElementAttributes[this.parentNode.id].RT.x + rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][this.parentNode.id] / quant
          }
          return 0
        })
        .attr("y2", function() {
          // console.log(this,a,b,c)
          return vizElementAttributes[this.parentNode.id].RT.y + vizElementAttributes[this.parentNode.id].RT.height/2
        })
        .select(function() { return this.parentNode; })
        .append("line")
        .classed("errorLine", true)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("x1", function() {
          let id = this.parentNode.id
          if(rootThis.indicatorData.data[rootThis.indiSelections.year][id] !== 'No Data' &&
            rootThis.indicatorData.lowerIntervals &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][id]) {
            let quant = rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] / vizElementAttributes[this.parentNode.id].RT.width;
            return vizElementAttributes[this.parentNode.id].RT.x + rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id] / quant
          }
          return 0
        })
        .attr("y1", function() {
          let id = this.parentNode.id
            if(rootThis.indicatorData.data[rootThis.indiSelections.year][id] !== 'No Data' &&
              rootThis.indicatorData.lowerIntervals &&
              rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
              rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][id]) {
              return vizElementAttributes[id].RT.y + vizElementAttributes[id].RT.height/2 - 4
            }
        })
        .attr("x2", function() {
          let id = this.parentNode.id
            if(rootThis.indicatorData.data[rootThis.indiSelections.year][id] !== 'No Data' &&
              rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
              rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][id]) {
              let quant = rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] / vizElementAttributes[this.parentNode.id].RT.width;
              return vizElementAttributes[this.parentNode.id].RT.x + rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id] / quant
            }
            return 0
        })
        .attr("y2", function() {
          let id = this.parentNode.id
            if(rootThis.indicatorData.data[rootThis.indiSelections.year][id] !== 'No Data' &&
              rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
              rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][id]) {
              return vizElementAttributes[id].RT.y + vizElementAttributes[id].RT.height/2 + 4
            }
        })
        .select(function() { return this.parentNode; })
        .append("line")
        .classed("errorLine", true)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("x1", function() {
          let id = this.parentNode.id
          if(rootThis.indicatorData.data[rootThis.indiSelections.year][id] !== 'No Data' &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
            rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][id]) {
              let quant = rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] / vizElementAttributes[this.parentNode.id].RT.width;
              return vizElementAttributes[this.parentNode.id].RT.x + rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][this.parentNode.id] / quant
          }
          return 0
        })
        .attr("y1", function() {
          let id = this.parentNode.id
            if(rootThis.indicatorData.data[rootThis.indiSelections.year][id] !== 'No Data' &&
              rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
              rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][id]) {
              return vizElementAttributes[id].RT.y + vizElementAttributes[id].RT.height/2 - 4
            }
        })
        .attr("x2", function() {
          let id = this.parentNode.id
            if(rootThis.indicatorData.data[rootThis.indiSelections.year][id] !== 'No Data' &&
              rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
              rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][id]) {
                let quant = rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] / vizElementAttributes[this.parentNode.id].RT.width;
                return vizElementAttributes[this.parentNode.id].RT.x + rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][this.parentNode.id] / quant
            }
            return 0
        })
        .attr("y2", function() {
          let id = this.parentNode.id
            if(rootThis.indicatorData.data[rootThis.indiSelections.year][id] !== 'No Data' &&
              rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
              rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][id]) {
              return vizElementAttributes[id].RT.y + vizElementAttributes[id].RT.height/2 + 4
            }
        })
    } else if (rootThis.indiSelections["viz"] == "global") {
      this.sidsMapSelection
        .selectAll("g")
        .append("line")
        .classed("errorLine", true)
        .style("stroke", "black")
        .style("stroke-width", 3)
        .attr("y1", function() {
          if(rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] !== 'No Data' &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id]) {
            let quant = rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] / vizElementAttributes[this.parentNode.id].RT.height;
            return vizElementAttributes[this.parentNode.id].RT.y + vizElementAttributes[this.parentNode.id].RT.height - rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id] / quant
          }
          return 0
        })
        .attr("x1", function() {
          return vizElementAttributes[this.parentNode.id].RT.x + vizElementAttributes[this.parentNode.id].RT.width/2
        })
        .attr("y2", function() {
          if(rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] !== 'No Data' &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id]) {
            let quant = rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] / vizElementAttributes[this.parentNode.id].RT.height;
            return vizElementAttributes[this.parentNode.id].RT.y + vizElementAttributes[this.parentNode.id].RT.height - rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][this.parentNode.id] / quant
          }
          return 0
        })
        .attr("x2", function() {
          // console.log(this,a,b,c)
          return vizElementAttributes[this.parentNode.id].RT.x + vizElementAttributes[this.parentNode.id].RT.width/2
        })
        .select(function() { return this.parentNode; })
        .append("line")
        .classed("errorLine", true)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("y1", function() {
          if(rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] !== 'No Data' &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id]) {
            let quant = rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] / vizElementAttributes[this.parentNode.id].RT.height;
            return vizElementAttributes[this.parentNode.id].RT.y + vizElementAttributes[this.parentNode.id].RT.height - rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id] / quant
          }
          return 0
        })
        .attr("x1", function() {
          let id = this.parentNode.id
            if(rootThis.indicatorData.data[rootThis.indiSelections.year][id] !== 'No Data' &&
              rootThis.indicatorData.lowerIntervals &&
              rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
              rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][id]) {
              return vizElementAttributes[id].RT.x + vizElementAttributes[id].RT.width/2 - 4
            }
        })
        .attr("y2", function() {
          if(rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] !== 'No Data' &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id]) {
            let quant = rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] / vizElementAttributes[this.parentNode.id].RT.height;
            return vizElementAttributes[this.parentNode.id].RT.y + vizElementAttributes[this.parentNode.id].RT.height - rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id] / quant
          }
          return 0
        })
        .attr("x2", function() {
          let id = this.parentNode.id
            if(rootThis.indicatorData.data[rootThis.indiSelections.year][id] !== 'No Data' &&
              rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
              rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][id]) {
              return vizElementAttributes[id].RT.x + vizElementAttributes[id].RT.width/2 + 4
            }
        })
        .select(function() { return this.parentNode; })
        .append("line")
        .classed("errorLine", true)
        .style("stroke", "black")
        .style("stroke-width", 2)
        .attr("y1", function() {
          if(rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] !== 'No Data' &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] && rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id]) {
            let quant = rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] / vizElementAttributes[this.parentNode.id].RT.height;
            return vizElementAttributes[this.parentNode.id].RT.y + vizElementAttributes[this.parentNode.id].RT.height - rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][this.parentNode.id] / quant
          }
          return 0
        })
        .attr("x1", function() {
          let id = this.parentNode.id
            if(rootThis.indicatorData.data[rootThis.indiSelections.year][id] !== 'No Data' &&
              rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
              rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][id]) {
              return vizElementAttributes[id].RT.x + vizElementAttributes[id].RT.width/2 - 4
            }
        })
        .attr("y2", function() {
          if(rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] !== 'No Data' &&
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] && rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id]) {
            let quant = rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] / vizElementAttributes[this.parentNode.id].RT.height;
            return vizElementAttributes[this.parentNode.id].RT.y + vizElementAttributes[this.parentNode.id].RT.height - rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][this.parentNode.id] / quant
          }
          return 0
        })
        .attr("x2", function() {
          let id = this.parentNode.id
            if(rootThis.indicatorData.data[rootThis.indiSelections.year][id] !== 'No Data' &&
              rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
              rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][id]) {
              return vizElementAttributes[id].RT.x + vizElementAttributes[id].RT.width/2 + 4
            }
        })
    } else {
      this.sidsMapSelection.selectAll(".errorLine")
        .remove()
    }
  } else {

      this.sidsMapSelection.selectAll(".errorLine")
        .remove()
  }
}

export function countriesWithNoData() {
  let rootThis = this,
    /// make list of counties with no data (this should probably be refactored to create a list of countries with data)? Or just simplify this
  noData = [];
  this.sidsMapSelection
    .selectAll("path") /* Map  counties to  data */
    .each(function () {
      try {
        let iso = this.id;
        ////need to update this to indiSelections["year"] variable
        let value = rootThis.indicatorData["data"][rootThis.indiSelections["year"]][iso];
        if (value == "No Data" || typeof value != "number") {
          noData.push(iso);
        }
      } catch (error) {console.log(error)} //console.log(error)}//console.log(error) }
    });
  return noData
}
//
// ///////////////////////
// //////Element update functions
// //////////////////////////////////////
// //
//
export function updateVizBlocks(){
  if (this.indiSelections["viz"] == "spider") {
    d3.selectAll(".indexSpider").style("display", "block");
  } else {
    d3.selectAll(".indexSpider").style("display", "none");
  }
  if (this.indiSelections["viz"] == "series") {
    d3.select(this.timeSeriesContainer).style("display", "block");
  } else {
    d3.select(this.timeSeriesContainer).style("display", "none");
  }
  if (this.indiSelections["page"] == "countryDataTab") {
    if (this.indiSelections["viz"] == "multi") {
      d3.select("#choroInfoBox").style("display", "none");
    } else {
      d3.select("#choroInfoBox").style("display", "block");
    }
  } else {
    d3.select("#choroInfoBox").style("display", "none");
  }
  if (
    this.indiSelections["viz"] == "info" ||
    this.indiSelections["viz"] == "series"
  ) {
    d3.select(this.legendContainerSelector).style("display", "none");
    d3.select(this.mapContainerSelector).style("display", "none"); //"opacity", "0");
  } else {
    d3.select(this.legendContainerSelector).style("display", "block");
    d3.select(this.mapContainerSelector).style("display", "block"); //("opacity", "1");
  }
}
//
// function updateVizSliders() {
//
//     if (vizMode=="index") {
//         $("#infoLi").show();
//         $("#choroLiLi").text("Spider");
//
//       } else {
//         $("#infoLi").hide();
//         $("#choroLiLi").text("Choropleth");
//       }
//
//     x = $(".selectedViz");
//   $(".vizShader")
//     .stop()
//     .animate(
//       {
//         width: x.width() + 32,
//         left: x.position().left,
//       },
//       400
//     );
//
//   x = $(".selectedMviPreset");
//   $(".mviPresetShader")
//     .stop()
//     .animate(
//       {
//         width: x.width() + 32,
//         left: x.position().left,
//       },
//       400
//     );
//
//   x = $(".selectedSortby");
//
//   $(".sortbyShader")
//     .stop()
//     .animate(
//       {
//         width: x.width() + 32,
//         left: x.position().left,
//       },
//       400
//     );
// }
//
export function updateCountrySvgColors(quantize) {
  let indicatorDataYear = this.indicatorData["data"][this.indiSelections["year"]],
  rootThis = this;
  ///draw choropleth scale
  if (this.page !== "mvi") {
    /* break the data values into 9 ranges of €100 each   */


    this.sidsMapSelection
      .selectAll("path") /* Map  counties to  data */
      .attr("class", function () {
        try {
          let value = indicatorDataYear[this.id];
          if (value == "No Data" || typeof value != "number") {
            //hide country name
            if (this.indicatorCode == "Region") {
              return (
                regionColors(
                  rootThis.profileData[this.id].region,
                  rootThis.profileData[this.id].unMeber
                ) + " shadow countrySvg"
              );
            } else {
              return "nodata countrySvg";
            }
          } else {
           if (
              rootThis.indiSelections["viz"] == "bars" ||
              rootThis.indiSelections["viz"] == "spider" ||
              rootThis.indiSelections["viz"] == "global" ||
              rootThis.indicatorCode == "Region"
            ) {
              return (
                regionColors(rootThis.profileData[this.id].region, "Y") +" shadow countrySvg"
              );
            } else {
              return quantize(value) + " shadow countrySvg";
            }
          }
        } catch (error) {
          console.log("broken?", this.id);
          return "nodata";
        }
      })
      .on("mouseout", function () {
        if (d3.select(this).classed("countryActive")) return;
        if (rootThis.indiSelections.viz!=='choro') return;
        d3.select(this).attr("class", function () {
          /* reset country color to quantize range */
          let  stat = indicatorDataYear[this.id];

          if (rootThis.indicatorCode == "Region") {
            return (
              regionColors(rootThis.profileData[this.id].region, "Y") +
              " shadow countrySvg"
            );
          } else {
            if (typeof stat == "undefined" || stat == "No Data") {
              //hide country name
              return "nodata countrySvg";
            } else {
              //show country name
              return quantize(stat) + " shadow countrySvg";
            }
          }
        });
      });
  } else {
    d3.select("#choro_map_container")
      .selectAll("path.countrySvg") /* Map  counties to  data */
      .attr("class", function () {
        try {
          return (
            regionColors(rootThis.profileData[this.id].region, "Y") +
            " shadow countrySvg"
          );
        } catch(e) {
          console.log(e, this.id);
        }
      });
  }
}
//
export function updateCountryPositions(vizElementAttributes) {
  //update country svg positions
  this.sidsMapSelection
    .selectAll(".countrySvg")
    .transition()
    .duration(1200) //make transition time relative to to/from viz
    .attr("transform", function () {
      let VTz = vizElementAttributes[this.id]["VT"];
      try {
        return (
          "scale(" +
          VTz["scale"] +
          "," +
          VTz["scale"] +
          ")translate(" +
          VTz["x"] +
          "," +
          VTz["y"] +
          ")"
        );
      } catch (error) {
        return "";
      }
    });
}

export function updateCountryTitles(
  vizElementAttributes,
  noData
) {
  let rootThis = this;
  this.sidsMapSelection
    .selectAll(".choroText")
    .transition()
    .duration(1200) //make transition time relative to to/from viz
    .attr("transform", function (a,b,c) {
      let country = c[b].id.replace('-text', '');
      try {
        return vizElementAttributes[country]["TT"];
      } catch (error) {
        console.log("broken", this.innerHTML, noData);
      }
    });

  this.sidsMapSelection.selectAll(".choroText2").style("pointer-events", "none");
  this.sidsMapSelection.selectAll(".choroText3").style("pointer-events", "none");
  this.sidsMapSelection
    .selectAll(".countryLabel")
    .style("pointer-events", "none");

  if (this.indiSelections["viz"] == "global") {
    this.sidsMapSelection.selectAll('.choroText').attr('fill-opacity', 0)
    this.sidsMapSelection.selectAll('.choroText2').attr('fill-opacity', 0)
    this.sidsMapSelection.selectAll('.choroText3').attr('fill-opacity', 1)
  } else {
    this.sidsMapSelection.selectAll('.choroText2').attr('fill-opacity', 0)
    this.sidsMapSelection.selectAll('.choroText3').attr('fill-opacity', 0)
  }

    if (this.indiSelections["viz"] == "series") {
      this.sidsMapSelection.selectAll('.choroText').attr('fill-opacity', 0)
    } else {
      this.sidsMapSelection.selectAll('.choroText').each(function (a,b,c) {
        let country = c[b].id.replace('-text', '');

        if (
          rootThis.indicatorCode == "Region" &&
          rootThis.indiSelections["viz"] === "choro"
        ) {
          d3.select(this).attr('fill-opacity', 1);
        } else {
          if (
            noData.includes(country) ||
            rootThis.indiSelections["viz"] == "global"
          ) {
            let scale
            d3.select(this).attr('fill-opacity', 0);
            if (rootThis.indiSelections["viz"] == "bars"
              || rootThis.indiSelections["viz"] == "choro"
              || rootThis.indiSelections["viz"] == "global"
              || rootThis.indiSelections["viz"] == "spider") {
              scale = 1;
            }
            d3.select(this)
              .transition()
              .duration(1200)
              .attr("transform", "scale(" + scale + "," + scale + ")");
          } else {
            d3.select(this).attr("fill-opacity", 1);
          }
        }
      });
    }

  if (this.indiSelections["viz"] == "Multi-indicator") {
    this.sidsMapSelection.select(".yAxisTitle")
      .transition()
      .duration(1000)
      .attr("fill-opacity", 1);
  } else {
    this.sidsMapSelection.select(".yAxisTitle")
      .transition()
      .duration(1000)
      .attr("fill-opacity", 0);
  }
}

export function updateLabels(vizElementAttributes, noData) {

    let rootThis = this;
    this.sidsMapSelection
      .selectAll(".countryLabel")
      .transition()
      .duration(1200)
      .attr("x", function () {
        let val = vizElementAttributes[this.parentNode.id]["LT"]["x"] + 10
        if(rootThis.vizWidth >= 800) {
          val +=160;
        }
        if(rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] !== 'No Data' &&
          rootThis.indicatorData.lowerIntervals && rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
          rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id]) {
          let quant = rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] / vizElementAttributes[this.parentNode.id].RT.width;
          return vizElementAttributes[this.parentNode.id].RT.x - 25 + rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][this.parentNode.id] / quant
        }
        return val;
      })
      .attr("y", function () {
        let value = vizElementAttributes[this.parentNode.id]["LT"]["y"];
        if(rootThis.vizWidth < 800 && this.vizMode === 'index') {
          value = value*2 + vizElementAttributes[this.parentNode.id]["MRT1"]["height"] - 12;
        }
        return value;
      })
      .attr("fill-opacity", function () {
        if (
          noData.includes(this.parentNode.id) ||
          rootThis.indiSelections["viz"] != "bars"
        ) {
          return 0;
        } else {
          return 1;
        }
      })
      .text(function () {
        let country = this.parentNode.id;
        if(rootThis.indicatorData.lowerIntervals &&
          rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
          rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][country]) {
          return nFormatter(
            rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year][country],
            3
          );
        }
        return nFormatter(
          rootThis.indicatorData["data"][rootThis.indiSelections["year"]][country],
          3
        );
      });
      if(this.indicatorData.lowerIntervals && rootThis.indiSelections["viz"] === "bars") {
        this.sidsMapSelection
          .selectAll(".errorLabel").remove()
        this.sidsMapSelection
          .selectAll("g")
          .append("text")
          .classed("errorLabel", true)
          .attr('font-size', 10)
          .attr("x", function () {
            let val = vizElementAttributes[this.parentNode.id]["LT"]["x"] + 10
            if(rootThis.vizWidth >= 800) {
              val +=160;
            }
            if(rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] !== 'No Data' &&
              rootThis.indicatorData.upperIntervals &&  rootThis.indicatorData.lowerIntervals[rootThis.indiSelections.year] &&
              rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][this.parentNode.id]) {
              let quant = rootThis.indicatorData.data[rootThis.indiSelections.year][this.parentNode.id] / vizElementAttributes[this.parentNode.id].RT.width;
              return vizElementAttributes[this.parentNode.id].RT.x + 5 + rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][this.parentNode.id] / quant
            }
            return val;
          })
          .attr("y", function () {
            let value = vizElementAttributes[this.parentNode.id]["LT"]["y"];
            if(rootThis.vizWidth < 800 && this.vizMode === 'index') {
              value = value*2 + vizElementAttributes[this.parentNode.id]["MRT1"]["height"] - 12;
            }
            return value;
          })
          .attr("fill-opacity", function () {
            if (
              noData.includes(this.parentNode.id) ||
              rootThis.indiSelections["viz"] != "bars" ||
              !(rootThis.indicatorData.upperIntervals &&
                rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year] &&
                rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][this.parentNode.id]
              )
            ) {
              return 0;
            } else {
              return 1;
            }
          })
          .text(function () {
            let country = this.parentNode.id;
            if(rootThis.indicatorData.upperIntervals &&
              rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year] &&
              rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][country]) {
              return nFormatter(
                rootThis.indicatorData.upperIntervals[rootThis.indiSelections.year][country],
                3
              );
            }
            return ''
          });
      } else {
        this.sidsMapSelection
          .selectAll(".errorLabel").remove()
      }
}

export function updateRectangles(vizElementAttributes) {
  let rootThis = this;
  this.sidsMapSelection
    .selectAll(".choroRect")
    .transition()
    .duration(1200)
    .attr("x", function () {
      return vizElementAttributes[this.parentNode.id]["RT"]["x"];
    })
    .attr("y", function () {
      return vizElementAttributes[this.parentNode.id]["RT"]["y"];
    })
    .attr("width", function () {
        if(rootThis.vizMode=="indicator"){
          return vizElementAttributes[this.parentNode.id]["RT"]["width"];
        }
        if(rootThis.vizMode=="index"){
            return 0;
        }
    })
    .style('opacity', function () {
      if(rootThis.indicatorData.lowerIntervals &&
          rootThis.indicatorData.lowerIntervals[rootThis.indiSelections["year"]] &&
          rootThis.indicatorData.lowerIntervals[rootThis.indiSelections["year"]][this.parentNode.id]
      ) {
        return  0.5
      }
      return 1
    })
    .attr("height", function () {
      return vizElementAttributes[this.parentNode.id]["RT"]["height"];
    });
}
//
export function updateIndexRectangles(vizElementAttributes) {
  let rootThis = this;
  let subindexList=Object.keys(this.indexWeights["subindices"])
  for(let i=0;i<subindexList.length;i++){
   this.sidsMapSelection
      .selectAll(".choroRect"+(i))
      .transition()
      .duration(1200)
      .attr("x", function () {
        return vizElementAttributes[this.parentNode.id]["MRT"+(i)]["x"];
      })
      .attr("y", function () {
        let value = vizElementAttributes[this.parentNode.id]["MRT"+(i)]["y"]
        if(rootThis.vizWidth < 800 && this.vizMode === 'index') {
          value = value*2 + vizElementAttributes[this.parentNode.id]["MRT"+(i)]["height"];
        }
        return value;
      })
      .attr("width", function () {
              return vizElementAttributes[this.parentNode.id]["MRT"+(i)]["width"];
      })
      .attr("height", function () {
        return vizElementAttributes[this.parentNode.id]["MRT"+(i)]["height"];
      });
  }
  for(let i=subindexList.length;i<totalIndexRectangles;i++){
    this.sidsMapSelection
       .selectAll(".choroRect"+(i))
       .transition()
       .duration(1200)
       .attr("x", function () {
         return vizElementAttributes[this.parentNode.id]["RT"]["x"];
       })
       .attr("y", function () {
         let value = vizElementAttributes[this.parentNode.id]["RT"]["y"]
         if(rootThis.vizWidth < 800 && this.vizMode === 'index') {
           value = value*2 + vizElementAttributes[this.parentNode.id]["MRT"+(i)]["height"];
         }
         return value;
       })
       .attr("width", function () {
               return vizElementAttributes[this.parentNode.id]["RT"]["width"];
       })
       .attr("height", function () {
         return 0;
       });
  }
}
export function updateCircles(vizElementAttributes) {
  this.sidsMapSelection
    .selectAll(".choroCircle")
    .transition()
    .duration(1200)
    .attr("cx", function () {
      return vizElementAttributes[this.parentNode.id]["CT"]["x"];
    })
    .attr("cy", function () {
      return vizElementAttributes[this.parentNode.id]["CT"]["y"];
    })
    .attr("r", function () {
      return vizElementAttributes[this.parentNode.id]["CT"]["r"];
    });
}

// function updateCountryLines(vizElementAttributes) {
//   d3.select(sidsMaps).selectAll(".countryLine");
//   // .transition()
//   // .duration(1200)
//   // .attr("cx", function () { return vizElementAttributes[this.parentNode.id]["CT"]["x"] })
//   // .attr("cy", function () { return vizElementAttributes[this.parentNode.id]["CT"]["y"] })
//   // .attr("r", function () { return vizElementAttributes[this.parentNode.id]["CT"]["r"] })
// }
//
export function updateLinesAndMap() {
  if (this.indiSelections["viz"] == "choro") {
    this.main_chart_svg
      .selectAll("line")
      .transition()
      .duration(1000)
      .style("opacity", 1);
  } else {
    this.main_chart_svg
      .selectAll("line")
      .transition()
      .duration(1000)
      .style("opacity", 0);
  }
  let rootThis = this;
  this.main_chart_svg.selectAll(".choroMap")
    .transition()
    .duration(1200) //make transition time relative to to/from viz
    .attr("opacity", function () {
      if (rootThis.indiSelections["viz"] == "global") {
        return 0.7;
      } else {
        return 0;
      }
    });
}
//
export function updateBarAxis() {
  let indicatorDataYear = this.indicatorData["data"][this.indiSelections["year"]],
  barAxis = d3.select(this.legendContainerSelector).select(".barAxis");
  const x = d3.scaleLinear();
  var margin = { left: this.vizWidth < 800 ? 0 : 160, right: 5 };
  var xAxis = d3.axisTop(x);
  var width = this.vizWidth < 800 ? this.vizWidth - 40 : 440;
  if(this.indicatorData.upperIntervals) {
    indicatorDataYear = {...this.indicatorData["data"][this.indiSelections["year"]], ...this.indicatorData.upperIntervals[this.indiSelections.year]}
  }
  let max = Math.max(
    ...Object.values(indicatorDataYear).filter(function (el) {
      return !isNaN(parseFloat(el)) && isFinite(el);
    })
  ),
  min = 0;
  if(max === min) {
    max+=1;
  }
  if (this.indiSelections["viz"] == "Multi-indicator") {
    margin.left = 60;
    width = 440;
    min = Math.min(
      ...Object.values(indicatorDataYear).filter(function (el) {
        return !isNaN(parseFloat(el)) && isFinite(el);
      })
    );
  }

  let absMax=Math.abs(max)
  if(absMax>1){
    xAxis.tickFormat(d3.format(".2s"));}
  else if (absMax<1&& absMax>0.01){
    xAxis.tickFormat(d3.format(".2n"));}
  else  if (absMax<0.01 && absMax>0){
    xAxis.tickFormat(d3.format(".1e"));}

  x.domain([min, max]).range([0, width]);

  if (
    this.indiSelections["viz"] == "choro" ||
    this.indiSelections["viz"] == "global" ||
    this.indiSelections["viz"] == "spider" ||
    this.indiSelections["viz"] == "Info" ||
    this.indiSelections["viz"] == "series"
  ) {
    x.range([0, 0]);
      barAxis.attr("visibility", "hidden");
  } else if (this.indiSelections["viz"] == "bars"||this.indiSelections["viz"] == "Multi-indicator") {
    barAxis.attr("visibility", "visible");
  }

  barAxis
    .attr("transform", `translate(${margin.left}, 25)`)
    .call(xAxis);
}

export function updateYAxis() {
  let indicatorDataYear = this.indicatorData["data"][this.indiSelections["year"]],

  yAxisContainer = d3.select(this.mapContainerSelector).select(".multiYAxis");
  const yScale = d3.scaleLinear();
  var yAxis = d3.axisLeft(yScale);
  yAxis.tickFormat(d3.format(".2s"));

  var margin = { left: 45, right: 5, top: 245 },
  height;

  if (
    this.indiSelections["viz"] == "choro" ||
    this.indiSelections["viz"] == "bars" ||
    this.indiSelections["viz"] == "spider" ||
    this.indiSelections["viz"] == "series"
  ) {
    yScale.range([0, 0]);
    //setTimeout(function(){
    yAxisContainer.attr("visibility", "hidden");
    //},900)
  } else if (this.indiSelections["viz"] == "global") {
    height = 180;
    margin = { left: 45, right: 5, top: 245 };

    // indicatorData2 = wdiFull[indicator2]["data"]//[indiSelections["year"]]

    let max = Math.max(
      ...Object.values(indicatorDataYear).filter(function (el) {
        return !isNaN(parseFloat(el)) && isFinite(el);
      })
    ),
    // min = Math.min(...Object.values(indicatorData2).filter(function (el) { return !isNaN(parseFloat(el)) && isFinite(el); }))
    min = 0;
    if(max === min) {
      max+=1;
    }
    yScale.domain([min, max]).range([height, 0]);

    yAxisContainer.attr("visibility", "visible");
    // }
    // else {
    //   yScale.range([0, 0]);
    //   //setTimeout(function(){
    //   yAxisContainer.attr("visibility", "hidden")
    // }
  }
  //else if (indiSelections["viz"] == "Multi-indicator") {
  //     var margin = { left: 45, right: 5, top: 10 };
  //     var height = 460
  //     try {
  //         indicator2 = $(".indiActive2")[0].id
  //     }
  //     catch (error) { indicator2 = "HumanDevelopmentIndex" }
  //     indicatorData2 = wdiFull[indicator2]["data"]//[indiSelections["year"]]

  //     max = Math.max(...Object.values(indicatorData2).filter(function (el) {
  //         return !isNaN(parseFloat(el)) && isFinite(el);
  //     }))
  //     min = Math.min(...Object.values(indicatorData2).filter(function (el) { return !isNaN(parseFloat(el)) && isFinite(el); }))

  //     yScale
  //         .domain([min, max])
  //         .range([height, 0]);

  //     yAxisContainer.attr("visibility", "visible")
  // }

  yAxisContainer
    .transition()
    .duration(1200)
    .call(yAxis)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // main_chart_svg.selectAll(".yAxisTitle")
  //     .text(function (d, i) {
  //         return wdiMeta[indicator2]["Indicator Name"]//["name"];//.toFixed(2))//extent[0].toFixed(2) + " - " +
  //     })
}
//
export function updateChoroLegend(quantize) {

    let choro_legend_container = d3
        .select(this.legendContainerSelector),
    choroLegend = choro_legend_container
      .selectAll("g.choroLegendEntry");

    choroLegend.data(quantize.range());

    choroLegend.selectAll("rect").attr("class", function (d) {
      return d;
    });

    if (this.indiSelections["viz"] == "choro" ) {
      this.showChoroLegend(choroLegend, quantize);
    } else if (
      this.indiSelections["viz"] == "bars" ||
      this.indiSelections["viz"] == "series" ||
      this.indiSelections["viz"] == "spider" ||
      this.indiSelections["viz"] == "global"
    ) {
      this.hideChoroLegend(choroLegend, quantize);//only hide rectangles and labels
    }
  }

export function updateRegionLables() {
    let countryMaps = this.main_chart_svg.selectAll(".regionTitle"),
    regionAverages = {},
    regionRank = {},
    regionTitleVals,
    allVals,
    countryListLength,
    indicatorDataYear = this.indicatorData["data"][this.indiSelections["year"]];
    countryMaps.each(function () {
      let region = this.classList[1].replace("RegionTitle", ""),
      regionLists = {
        ais: regionCountries["ais"],
        pacific: regionCountries["pacific"],
        caribbean: regionCountries["caribbean"],
      },
      total = 0;

      for (let countryIndex in regionLists[region]) {
        let val = indicatorDataYear[regionLists[region][countryIndex]];
        if (typeof val == "number") {
          total += val;
        }
      }

      let regionValuesLength = Object.values(
        filterObject(indicatorDataYear, regionLists[region])
      ).filter((val) => typeof val == "number").length;

      if (regionValuesLength == 0) {
        regionValuesLength = 1;
      }
      let regionVal = total / regionValuesLength;
      regionRank[region] = 1;
      allVals = Object.values(indicatorDataYear).filter(
        (val) => typeof val == "number"
      );
      for (let val in allVals) {
        if (allVals[val] > regionVal) {
          regionRank[region]++;
        }
      }
      regionAverages[region] = regionVal;
    });

    if (
      this.indiSelections["viz"] == "choro" ||
      this.indiSelections["viz"] == "series"
    ) {
      regionTitleVals = {
        opacity: 1,
        pacificX: 815,
        pacificY: 460,
        caribbeanX: 815,
        caribbeanY: 130,
        aisX: 815,
        aisY: 335,
      };
    } else if (
      this.indiSelections["viz"] == "bars"
    ) {
      if (this.indiSelections["sortby"] == "rank") {
        regionTitleVals = {
          opacity: 1,
          pacificX: 725,
          pacificY: 330,
          caribbeanX: 725,
          caribbeanY: 170,
          aisX: 725,
          aisY: 250,
        };

        countryListLength = allVals.length;
        let regionRanks = [regionRank["pacific"]+'p',regionRank["caribbean"]+'c',regionRank["ais"]+'a'].sort(function(a, b) {
          return parseInt(a) - parseInt(b);
        });
        if (countryListLength > 0) {
          regionTitleVals = {
            opacity: 1,
            pacificX: 725,
            pacificY:
              40 * (regionRanks.findIndex(v => v === regionRank["pacific"]+'p')) +
              60,
            caribbeanX: 725,
            caribbeanY:
              40 * (regionRanks.findIndex(v => v === regionRank["caribbean"]+'c')) +
              60,
            aisX: 725,
            aisY:
              40 * (regionRanks.findIndex(v => v === regionRank["ais"]+'a')) + 60,
          };
        } else {
          regionTitleVals = {
            opacity: 1,
            pacificX: 725,
            pacificY: 450,
            caribbeanX: 725,
            caribbeanY: 110,
            aisX: 725,
            aisY: 300,
          };
        }
        if(this.vizWidth < 800) {
          regionTitleVals.opacity = 0;
        }
        // }
      } else if (this.indiSelections["sortby"] == "region") {
        if(this.vizWidth < 800) {
          let aisOffset = regionCountries.caribbean.reduce((offset, iso) => {
            if(indicatorDataYear[iso] && indicatorDataYear[iso] !== "No Data") {
              offset+=30
            }
            return offset
          }, 30*2);
          let pacificOffset = regionCountries.ais.reduce((offset, iso) => {
            if(indicatorDataYear[iso] && indicatorDataYear[iso] !== "No Data") {
              offset+=30
            }
            return offset
          }, aisOffset + 30*2);
          regionTitleVals = {
            opacity: 1,
            pacificX: 0,
            pacificY: pacificOffset,
            caribbeanX: 0,
            caribbeanY: 0,
            aisX: 0,
            aisY: aisOffset,
          };
        } else {
          regionTitleVals = {
            opacity: 1,
            pacificX: 725,
            pacificY: 450,
            caribbeanX: 725,
            caribbeanY: 110,
            aisX: 725,
            aisY: 300,
          };
        }
      }
    } else if (this.indiSelections["viz"] == "global") {
      regionTitleVals = {
        opacity: 1,
        pacificX: 675,
        pacificY: 70,
        caribbeanX: 30,
        caribbeanY: 115,
        aisX: 370,
        aisY: 85,
      };
    } else if (this.indiSelections["viz"] == "spider") {
      if (this.indiSelections["sortby"] == "rank") {
        regionTitleVals = {
          opacity: 1,
          pacificX: 745,
          pacificY: 330,
          caribbeanX: 745,
          caribbeanY: 170,
          aisX: 745,
          aisY: 250,
        };
      } else {
        regionTitleVals = {
          opacity: 1,
          pacificX: 20,
          pacificY: 100,
          caribbeanX: 670,
          caribbeanY: 90,
          aisX: 530,
          aisY: 530,
        };
      }
    }

    this.regionAverages = regionAverages;
    this.main_chart_svg.select(".pacificRegionTitle")
      .transition()
      .duration(1000)
      .attr("x", regionTitleVals["pacificX"])
      .attr("y", regionTitleVals["pacificY"])
      .attr("fill-opacity", regionTitleVals["opacity"]);
    this.main_chart_svg.select(".caribbeanRegionTitle")
      .transition()
      .duration(1000)
      .attr("x", regionTitleVals["caribbeanX"])
      .attr("y", regionTitleVals["caribbeanY"])
      .attr("fill-opacity", regionTitleVals["opacity"]);
    this.main_chart_svg.select(".aisRegionTitle")
      .transition()
      .duration(1000)
      .attr("x", regionTitleVals["aisX"])
      .attr("y", regionTitleVals["aisY"])
      .attr("fill-opacity", regionTitleVals["opacity"]);
  }
