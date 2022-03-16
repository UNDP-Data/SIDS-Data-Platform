import * as d3 from 'd3';
import tippy from 'tippy.js';

import { indexColors } from './index-data'
import {regionColors, getBoundingBox, nFormatter} from './vizEngineHelperFunctions'
import {countryListLongitude, sidsDict, regionsDict, isoToIds} from './vizEngineGlobals'
//runs this right away (it works, for some reason it doesn't draw the titles if executed on click )
///////////////////////////////////

/////Initialize Viz Engine
//////////////////////

export function initVizEngine({sidsXML}) {
  appendLinesMapAndRegions.apply(this)
  var svgMap = sidsXML.getElementsByTagName("g")[0];
  this.sidsMaps = this.main_chart_svg
    .node()
    .appendChild(svgMap);

  appendMultiRectangles()
  this.initCountrySvgs();
  this.appendAllElements();
  this.initTimeSeries();
  this.initVizEngineTooltips()
}

///////////////////////
//////Append all Elements
//////////////////////////////////////
export function appendAllElements(){
    this.appendCountryTitles()
    this.appendCountryTitles2();
    this.appendCountryTitles3();
    this.appendCountryRectangles();
    appendCountryLabels();
    this.appendCountryCircles();
    this.initYAxis();

}
//

///////////////////////
//////Choropleth legend
//////////////////////////////////////
//
export function initChoroLegend(quantize) {

  d3.select("#regionLegend").style('display','none');

  this.choroLegend = d3
    .select(this.legendContainerSelector)
    .selectAll("*")
    .selectAll("g.choroLegendEntry")
    .data(quantize.range())
    .enter()
    .append("g")
    .attr("class", "choroLegendEntry");

  this.choroLegend
    .append("rect")
    .attr("x", function (d, i) {
      return i * 70 + 70;
    })
    .attr("y", 35)
    .attr("width", 70)
    .attr("height", 10);

  this.choroLegend
    .append("text")
    .attr("class", "textNum")
    .attr("x", function (d, i) {
      return i * 70 + 90;
    }) //leave 5 pixel space after the <rect>
    .attr("y", 30);
}

export function hideChoroLegend(choroLegend) {
  choroLegend.selectAll("rect").transition().duration(1200).attr("opacity", 0);

  choroLegend
    .selectAll(".textNum")
    .attr("fill-opacity", 0);
}

export function showChoroLegend(choroLegend, quantize) {
  choroLegend.selectAll("rect")
  .attr("opacity", 1);

  choroLegend
    .selectAll(".textNum")
    .text(function (d) {
      var extent = quantize.invertExtent(d);
      //extent will be a two-element array, format it however you want:
      return nFormatter(extent[1], 2);
    })
    .attr("fill-opacity", 1);
}

//////////////////////////////
///X-Axis
///////////////////////////////

function appendLinesMapAndRegions() {
  this.main_chart_svg
    .append("svg:image")
    .attr("x", -18)
    .attr("y", -415)
    .attr("width", 879)
    .attr("height", 1000)
    .attr("xlink:href", require("@/assets/media/SIDS_map_clean-01.png"))
    .attr("opacity", 0)
    .attr("class", "choroMap")
    .attr("z-index", -10);

  this.main_chart_svg
    .append("line")
    .style("stroke", "gray")
    .style("stroke-width", 1)
    .attr("x1", 80)
    .attr("y1", 263)
    .attr("x2", 740)
    .attr("y2", 263)
    .classed("regionLine");

  this.main_chart_svg
    .append("line")
    .style("stroke", "gray")
    .style("stroke-width", 1)
    .attr("x1", 80)
    .attr("y1", 363)
    .attr("x2", 740)
    .attr("y2", 363)
    .classed("regionLine");

  this.main_chart_svg
    .append("text")
    .attr("x", 775)
    .attr("y", 460)
    .text("Pacific")
    .style("fill", "#" + regionColors("Pacific", "Y").substring(1))
    .attr("fill-opacity", 1)
    .style("font-size", "18px")
    .style("font-weight", 1000)
    .attr("id", "pacificRegionTitle")
    .attr("class", "regionTitle");

  this.main_chart_svg
    .append("text")
    .attr("x", 760)
    .attr("y", 130)
    .text("Caribbean")
    .style("font-size", "18px")
    .style("font-weight", 1000)
    .style("fill", "#" + regionColors("Caribbean", "Y").substring(1))
    .attr("fill-opacity", 1)
    .attr("id", "caribbeanRegionTitle")
    .attr("class", "regionTitle");

  this.main_chart_svg
    .append("text")
    .attr("x", 785)
    .attr("y", 335)
    .text("AIS")
    .style("fill", "#" + regionColors("AIS", "Y").substring(1))
    .attr("fill-opacity", 1)
    .style("font-size", "18px")
    .style("font-weight", 1000)
    .attr("id", "aisRegionTitle")
    .attr("class", "regionTitle");
  }
//
export function initXAxis() {
  //initialize the x-axis
  d3.select("#choro_legend_container").select("svg").append("g").attr("class", "barAxis").attr("visibility", "hidden");

}

export function initYAxis() {
  this.main_chart_svg
    .append("g")
    .attr("class", "multiYAxis")
    .attr("visibility", "hidden");

  this.main_chart_svg
    .append("text")
    .attr("class", "yAxisTitle")
    .attr("transform", "rotate(-90)")
    .text(function () {
      return "";
    })
    .attr("text-anchor", "middle")
    .attr("x", -240)
    .attr("font-weight", "bold")
    .attr("fill-opacity", 0);
}
//
////////////////////////
////// Appending shapes and titles
// //////////////////
export function initCountrySvgs(){
  let rootThis = this;
    d3.select(this.sidsMaps)
    .selectAll("path")
    .on("click", function () {
      if(rootThis.vizWidth >=800) {
        rootThis.clickCallback(isoToIds[this.id])
      }
    });

  d3.select(this.sidsMaps)
    .selectAll("path")
    .each(function () {
       /* Let's add an id to each group that wraps a path */
      d3.select(this.parentNode).attr("id", this.id);
    });

  d3.select(this.sidsMaps)
    .selectAll("path") // Map countries to regional colors
    .attr("class", function () {
       return (
        regionColors(rootThis.profileData[this.id].Region,rootThis.profileData[this.id]["Member State (Y/N)"]
        ) + " shadow countrySvg"
      );
    });

}
//
export function appendCountryCircles() {
  let rootThis = this;
  d3.select("#allSids")
    .selectAll("g")
    .append("circle")
    .style("fill", function () {
      return (
        "#" +
        regionColors(rootThis.profileData[this.parentNode.id].Region, "Y").substring(1)
      );
    })
    .attr("r", 0)
    .classed("choroCircle", true);
}

function appendCountryLabels() {
  d3.select("#allSids")
    .selectAll("g")
    .append("svg:text")
    .text("")
    .attr("x", function () {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
    })
    .attr("y", function () {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[5];
    })
    .attr("font-size", 10)
    .attr("fill-opacity", 0)
    .classed("countryLabel", true)
    .attr("visibility", "visible");
}

export function appendCountryTitles() {
  let rootThis = this;
  d3.select("#allSids")
    .selectAll("g")
    .append("svg:text")
    .text(function () {
      try {
        let text = rootThis.profileData[this.parentNode.id].Country;
        return text;
      } catch {
        return this.parentNode.id;
      }
    })
    .attr("x", function () {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
    })
    .attr("y", function () {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[2] - 11;
    })
    .attr("font-size", 10)
    .classed("choroText", true);
}


export function appendCountryTitles2() {
  d3.select("#allSids")
    .selectAll("g")
    .append("svg:text")
    .classed("choroText2", true);
}

export function appendCountryTitles3() {
  let rootThis = this;
  d3.select("#allSids")
    .selectAll("g")
    .append("svg:text")

    .text(function () {
      try {
        let text = rootThis.profileData[this.parentNode.id].Country;
        return text;
      } catch {
        return this.parentNode.id;
      }
    })

    .attr("font-size", 10)
    .attr("fill-opacity", 0)
    .attr("transform", "rotate(45)")

    .attr("y", function () {
      try {
        let text = rootThis.profileData[this.parentNode.id].Country;
        return -1 * 9.65 * countryListLongitude.indexOf(text) + 265;
      } catch {
        return 0;
      }
    })
    .attr("x", function () {
      let text = rootThis.profileData[this.parentNode.id].Country,
      index = countryListLongitude.indexOf(text);
      if (index >= 0) {
        return 9.65 * index + 345;
      } else {
        //not the best way of making these hidden. should be improved
        return -1000;
      }
    })
    .classed("choroText3", true);
}
//
// function appendCountryLines() {
//   d3.select("#allSids")
//     .selectAll("g")
//     .append("line")
//     .style("stroke-width", 1)
//     .style("stroke", "green")
//     .attr("x1", function (d) {
//       return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
//     })
//     .attr("x2", function (d) {
//       return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
//     })
//     .attr("y1", function (d) {
//       return getBoundingBox(d3.select(this.parentNode).select("path"))[2] - 11;
//     })
//     .attr("y2", function (d) {
//       return getBoundingBox(d3.select(this.parentNode).select("path"))[2] - 11; //[5]
//     })
//     .classed("choroLine", true);
// }
//
export function appendCountryRectangles() {
  let rootThis = this;
  d3.select("#allSids")
    .selectAll("g")
    .append("rect")
    .style("fill", function () {
      return (
        "#" +
        regionColors(rootThis.profileData[this.parentNode.id].Region, "Y").substring(1)
      );
    }) //
    .attr("x", 160)
    .attr("y", 300)
    .attr("width", 0)
    .attr("height", 0)
    .classed("choroRect", true);
}
export function initVizEngineTooltips() {
  let rootThis = this;

  tippy('.countrySvg, .choroCircle, .choroRectMvi, .choroRect', {
    theme: 'light',
    delay: 300,
    onShow: function(instance) {

      let content = instance.popper.getElementsByClassName('tippyContent')[0];
      let countryCode = instance.reference.parentElement.id;
      let year = rootThis.indiSelections.year === 'recentValue' ? 'Most recent value' : rootThis.indiSelections.year;
      let value = 1;
      if(rootThis.vizMode === 'index' && rootThis.indexData) {
        value = rootThis.indexData.index.data[rootThis.indiSelections.year][countryCode];
      } else if (rootThis.indicatorData) {
        value = rootThis.indicatorData.data[rootThis.indiSelections.year][countryCode];
        year = rootThis.indiSelections.year === 'recentValue' ? `Most recent value (${rootThis.indicatorData.data.recentYear[countryCode]})` : year;
        year = rootThis.indicatorData.data[rootThis.indiSelections.year][countryCode] === 'No Data' ? rootThis.indicatorData.data.recentYear[countryCode] : year;
      }
      if(rootThis.indexData || rootThis.indicatorData) {
        value = typeof value === 'string' ? value : nFormatter(value,2);
        content.innerHTML = `Value: ${value} <br/> Year: ${year}`;
      }
    },
    content: function (reference) {
        let tooltipElement = document.createElement('div'),
        header = document.createElement('h3'),
        content = document.createElement('div');
        tooltipElement.id="choroCountryTooltip"
        content.classList.add('tippyContent');
        tooltipElement.appendChild(header);
        tooltipElement.appendChild(content);


        let countryCode = reference.parentElement.id;
        header.innerHTML = sidsDict[countryCode];

        return tooltipElement
    }
  });

  tippy('.regionTitle', {
    theme: 'light',
    delay: 300,
    onShow: function(instance) {
      let content = instance.popper.getElementsByClassName('tippyContent')[0];
      let regionCode = instance.reference.id.replace('RegionTitle', '');
      let value =  nFormatter(rootThis.regionAverages[regionCode],2);
      content.innerHTML = `Average: ${value}`;
    },
    content: function (reference) {
        let tooltipElement = document.createElement('div'),
        header = document.createElement('h3'),
        content = document.createElement('div');
        tooltipElement.id="choroRegionTooltip"
        content.classList.add('tippyContent');
        tooltipElement.appendChild(header);
        tooltipElement.appendChild(content);


        let regionCode = reference.id.replace('RegionTitle', '');
        header.innerHTML = regionsDict[regionCode];

        return tooltipElement
    }
  });

}
////////////////////////////////
//Y-axis
///////////////////////////////

export function appendMultiRectangles() {
  d3.select("#allSids")
  .selectAll("g")
  .append("rect")
  .style("fill", indexColors["mvi-index"]["Financial"])
  .attr("x", 160)
  .attr("y", 100)
  .attr("width", 0)
  .attr("height", 0)
  .classed("choroRect0 choroRectMvi", true);

d3.select("#allSids")
  .selectAll("g")
  .append("rect")
  .style("fill", indexColors["mvi-index"]["Economic"])
  .attr("x", 160)
  .attr("y", 200)
  .attr("width", 0)
  .attr("height", 0)
  .classed("choroRect1 choroRectMvi", true);

d3.select("#allSids")
  .selectAll("g")
  .append("rect")
  .style("fill", indexColors["mvi-index"]["Geographic"])
  .attr("x", 160)
  .attr("y", 300)
  .attr("width", 0)
  .attr("height", 0)
  .classed("choroRect2 choroRectMvi", true);

d3.select("#allSids")
  .selectAll("g")
  .append("rect")
  .style("fill", indexColors["mvi-index"]["Environmental"])
  .attr("x", 160)
  .attr("y", 400)
  .attr("width", 0)
  .attr("height", 0)
  .classed("choroRect3 choroRectMvi", true);
  }
