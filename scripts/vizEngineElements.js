
initVizEngine() //runs this right away (it works, for some reason it doesn't draw the titles if executed on click )


///////////////////////////////////
/////Initialize Viz Engine Elements
//////////////////////



function initVizEngine(){


Promise.all([
  d3.json("https://raw.githubusercontent.com/SIDS-Dashboard/SIDSDataPlatform/main/data/profileData.json"),
  d3.xml("https://raw.githubusercontent.com/SIDS-Dashboard/SIDSDataPlatform/main/maps/sidsSVG8.svg"),
  d3.json("https://raw.githubusercontent.com/SIDS-Dashboard/SIDSDataPlatform/main/data/exports/mapLocations.json")
]).then(
  function (files) {
      //console.log("done")
      //updateIndicatorOptions("Environment");
      countryJson = files[0]
      sidsXML = files[1]
      mapLocations = files[2]


      drawRegionLegend();

    main_chart_svg.append("svg:image")
        .attr('x', -18)
        .attr('y', -415)
        .attr('width', 879)
        .attr('height', 1000)
        .attr("xlink:href", "graphics/SIDS_map_clean-01.png")
        .attr("opacity", 0)
        .attr("class", "choroMap")
        .attr("z-index",-10);
  
  
    main_chart_svg.append('line')
        .style("stroke", "gray").style("stroke-width", 1).attr("x1", 80).attr("y1", 263).attr("x2", 740).attr("y2", 263).classed("regionLine");
  
    main_chart_svg.append('line')
        .style("stroke", "gray").style("stroke-width", 1).attr("x1", 80).attr("y1", 363).attr("x2", 740).attr("y2", 363).classed("regionLine");
  
    main_chart_svg
        .append('text').attr("x", 775).attr("y", 460).text("Pacific").style("fill", "#" + regionColors("Pacific", "Y").substring(1)).attr("fill-opacity", 1).style("font-size", "18px").style("font-weight", 1000).attr("id", "pacificRegionTitle").attr("class", "regionTitle");
    main_chart_svg
        .append('text').attr("x", 760).attr("y", 130).text("Caribbean").style("font-size", "18px").style("font-weight", 1000).style("fill", "#" + regionColors("Caribbean", "Y").substring(1)).attr("fill-opacity", 1).attr("id", "caribbeanRegionTitle").attr("class", "regionTitle");
    main_chart_svg
        .append('text').attr("x", 785).attr("y", 335).text("AIS").style("fill", "#" + regionColors("AIS", "Y").substring(1)).attr("fill-opacity", 1).style("font-size", "18px").style("font-weight", 1000).attr("id", "aisRegionTitle").attr("class", "regionTitle");
  
  
  
    var svgMap = sidsXML.getElementsByTagName("g")[0];			/* set svgMap to root g */
    //console.log(svgMap)
    sidsMaps = d3.select("#choro_map_container").selectAll("*").node().appendChild(svgMap);		/* island of sidsMaps map */
  
  
    d3.select(sidsMaps).selectAll("path")
        .on("mouseover", function (d) {
            if (d3.select(this).classed("countryActive")) return;		/* no need to change class when county is already selected */
            d3.select(this).attr("class", "countryHover");
        })
        .on("mouseout", function (d) {
            if (d3.select(this).classed("countryActive")) return;
            d3.select(this).attr("class", function (da) {
  
                return (regionColors(countryJson[this.id].Region, countryJson[this.id]["Member State (Y/N)"]) + " shadow countrySvg");
            });
        })
        .on("click", function (d) {
            zoomed(d3.select(this), this.id);//, countryJson[this.id].Region);
            //d3.select(this).style("fill", "blue");
        });
  
  
  
    d3.select(sidsMaps).selectAll("path")
        .each(function (d) {
  ///grab each bounding box and store in global bboxdict variable
  
    /* Let's add an id to each group that wraps a path */
            d3.select(this.parentNode).attr("id", this.id);
        });
    //   resolve()
    // })}
  
  
  
    d3.select(sidsMaps).selectAll("path")		// Map countries to regional colors
        .attr("class", function (d) {
            //console.log(this.id)
  
            return (regionColors(countryJson[this.id].Region, countryJson[this.id]["Member State (Y/N)"]) + " shadow countrySvg");
  
        });
  
  
        initChoroTooltips();
  
  
  // // 
         $("#sortbySelect").hide()


      }).catch(function (err) {
        console.log(err)
  
   
      })    
}

indexCodes=["mvi"]//,egov,etc.]

///////////////////////
//////Main update function
//////////////////////////////////////

function updateVizEngine(code) {

  //package selectios
  indiSelections = {};
  indiSelections["viz"] = $(".selectedViz")[0].children[0].innerHTML;
  indiSelections["page"] = $(".selectedPage").attr("id");
  indiSelections["sortby"] = $(".selectedSortby")[0].children[0].innerHTML;
  indiSelections["year"] = "recentValue"; /// temp until year selector is in place
  indiSelections["mviPreset"] = $(".selectedMviPreset")[0].id;
  ///also selectedRegion, selected statType

    //process code
  if (code == "global") {
    indicatorCode = indicatorGlobal;
  }
  else{
    indicatorCode=code
  }
  indicatorGlobal = indicatorCode;

//choose index or indicator mode
  if (code in indexCodes) {
    //activate index mode
    codeType = "index";
    $("#infoLi").show();
    $("#choroLiLi").text("Spider");
  } else {
    codeType = "indicator";
    $("#infoLi").hide();
    $("#choroLiLi").text("Choropleth");
  }

///hide vizselect slider if in"Region" mode (need a way to reactivate this mode in key indicators) 
  if (indicatorCode == "Region") {
    document.getElementById("vizSelect").style.visibility = "hidden";
  } else {
    document.getElementById("vizSelect").style.visibility = "visible";
  }

  ///hide or show Sortby Select depending on viz 
  if(indiSelections["viz"]=="Bar Chart"||indiSelections["viz"]=="Spider"){
    $("#sortbySelect").show()
    }
    else{
      $("#sortbySelect").hide()
    }

///update all sliders
updateVizSliders()

  ////problem code, doesn't work in init so moved here instead.
  if (bboxInit == 0) {
    d3.select(sidsMaps)
      .selectAll("path")
      .each(function (d) {
        bbox = getBoundingBox(d3.select(this));
        bboxDict[this.id] = bbox;
      });

    $(".choroText").each(function (i) {
      textBBox = this.getBBox();
      textBBoxDict[this.parentNode.id] = textBBox;
    });
    bboxInit = 1;
  }
  ////////////////////

  // console.timeLog()
  hueNum = getRandomInt(0, 3);

  /////get indicator data

  //this region thing is just for the starting state or when reset, so there are some values to attach
  if (indicatorCode == "Region") {
    codeSplit = ["hdr137506", "compositeIndices"];
  } else {
    codeSplit = indicatorCode.split("-");
  }

  console.log(
    "https://sids-dashboard.github.io/api/data/indicatorData-" +
      codeSplit[codeSplit.length - 1] +
      ".json"
  );
  //proceed only once indicator data has been pulled
  // $.getJSON('https://sids-dashboard.github.io/api/data/indicatorData-'+codeSplit[codeSplit.length-1]+'.json', function(dat) {

  d3.json(
    "https://sids-dashboard.github.io/api/data/indicatorData-" +
      codeSplit[codeSplit.length - 1] +
      ".json"
  ).then((dat) => {
    console.log("loaded");
    indicatorData = dat[codeSplit.join("-")];
    console.log(indicatorData);

    /// make list of counties with no data (this should probably be refactored to create a list of countries with data)? Or just simplify this
    noData = [];
    d3.select(sidsMaps)
      .selectAll("path") /* Map  counties to  data */
      .each(function (d) {
        try {
          // console.log(this.id)
          iso = this.id;
          ////need to update this to indiSelections["year"] variable
          indiSelections["year"] = "recentValue";
          value = indicatorData["data"][indiSelections["year"]][iso];
          //console.log(value)
          if (value == "No Data" || typeof value != "number") {
            noData.push(iso);
          }
        } catch (error) {} //console.log(error)}//console.log(error) }
      });
    ////

    elementsJson = processVizElementAttributes(indicatorData, indiSelections);
    updateVizEngineElements(
      elementsJson,
      hueNum,
      indicatorCode,
      indicatorData,
      indiSelections,
      noData
    );

    if (indiSelections["viz"] == "Time Series") {
      //   //color
      //   const countryColor = [
      //     ...new Set(
      //       Object.values(parsed)
      //         .map((d) => d.data)
      //         .flat()
      //         .map((d, i) => ({
      //           country: d.country,
      //           color: colorTheme[i % colorTheme.length],
      //         }))
      //     ),
      //   ];

      // timeColor = d3
      //     .scaleOrdinal()
      //     .domain(countryColor.map((d) => d.country))
      //     .range(countryColor.map((d) => d.color));

      console.log("time!");
      console.log(dat);
      dataset = parse(dat);
      optionSelected = {
        countryGroupOption: tempTimeChartSelection,
        datasetOption: indicatorCode,
      };
      console.log({ dataset, optionSelected });
      timeChart({ dataset, optionSelected });
    }

    if (codeType == "index") {
    } else if (codeType == "indicator") {
    }

    // make sure all shaders are aligned
  });

  if (indiSelections["viz"] == "Spider") {
    $("#customSpider").css("display", "block");
  } else {
    $("#customSpider").css("display", "none");
  }

  if (indiSelections["viz"] == "Time Series") {
    $("#timeSeriesContainer").css("display", "block");
  } else {
    $("#timeSeriesContainer").css("display", "none");
  }

  if (indiSelections["page"] == "countryDataTab") {
    if (indiSelections["viz"] == "Multi-indicator") {
      //     $("#indicatorSelectBox2").css("display", "block");
      $("#choroInfoBox").css("display", "none");
    } else {
      //      $("#indicatorSelectBox2").css("display", "none");
      $("#choroInfoBox").css("display", "block");
    }
  } else {
    //    $("#indicatorSelectBox2").css("display", "none");////need to figure out to hide the new menu
    $("#choroInfoBox").css("display", "none");
  }
  if (
    indiSelections["viz"] == "Info" ||
    indiSelections["viz"] == "Time Series"
  ) {
    $("#choro_map_container").css("display", "none"); //"opacity", "0");
  } else {
    //opacity so it doesn't mess with the titles
    $("#choro_map_container").css("display", "block"); //("opacity", "1");

    // $("#timeSeriesContainerPage").css("display", "none")
  }
  if (indiSelections["viz"] == "Info") {
    $("#mviInfoPage").show();
  } else {
    $("#mviInfoPage").hide();
  }

  // if (indiSelections["page"] == "mviTab" || indiSelections["page"] == "countryDataTab") {
  //     updateChoroTooltips();
  // }
}


/////////////////////////////
/////////////////////////////



function selectedFirstIndicator(){
  initChoroLegend();
  initBarAxis();
  initYAxis();
}


///////////////////////
//////Data Processing function
//////////////////////////////////////

function processVizElementAttributes(indicatorData,indiSelections) {
  vizElementAttributes = {};

//   $(".choroText").each(function(i){
//     textBBox = this.getBBox()
//     textBBoxDict[this.parentNode.id]=textBBox
// })

//console.log(textBBoxDict)//,bboxDict)

//console.log(textBBoxDict)
  for (country in bboxDict) {
    //rename to iso since the svg uses the old codes
    bBox = bboxDict[country];
    textBBox = textBBoxDict[country];
    
    RTa = rectTransform(country, bBox, indicatorData,indiSelections);
    // MRTa = multiRectTransform(country, bBox, indicatorData,indiSelections);
    VTa = vizTransform(country, bBox, indicatorData,indiSelections);
    LTa = labelTransform(country, bBox ,indicatorData,indiSelections);
    CTa = circleTransform(country, bBox, indicatorData,indiSelections);
    TTa = textTransform(country, bBox, textBBox, indicatorData,indiSelections);

    vizElementAttributes[country]={"VT":VTa,"RT":RTa,"LT":LTa,"CT":CTa,"TT":TTa}
  }

  return vizElementAttributes;

}

///////////////////////
//////Data Update function
//////////////////////////////////////
//

function updateVizEngineElements(elementsJson, hueNum, indicatorCode,indicatorData,indiSelections,noData) {
// 

    // max = Math.max(...Object.values(indicatorData).filter(function (el) {
    //     return !isNaN(parseFloat(el)) && isFinite(el);
    // }))
    // min = 0// Math.min(...Object.values(indicatorData).filter(function (el) { return !isNaN(parseFloat(el)) && isFinite(el);  }))
//console.log(elementsJson)

console.log("updating colors")
updateCountrySvgColors(indicatorData, indicatorCode, hueNum,indiSelections)
updateLabels(elementsJson,noData)//selectedPage, selectedViz, selectedYear,selectedSortby, indicatorData, noData)
updateRectangles(elementsJson)

// updateMultiRectangles(elementsJson)
//should support up to 10? rectangles

// updateSpider(indicatorData,indiSelections)

updateCountryPositions(elementsJson)
updateCountryTitles(elementsJson,indicatorCode,indiSelections,noData)//indicatorCode,selectedPage, selectedViz, selectedSortby,selectedYear, indicatorData,elementsJson,noData)

updateCircles(elementsJson)
updateLinesAndMap(indiSelections)
updateChoroTooltips(indicatorData,indiSelections) 
if(firstIndicatorInit==0){
    selectedFirstIndicator()
    firstIndicatorInit=1
        }
updateChoroLegend(indicatorCode,indiSelections)
updateBarAxis(indicatorData,indiSelections) 
updateYAxis(indicatorData,indiSelections) 
}



