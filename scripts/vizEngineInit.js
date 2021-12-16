//runs this right away (it works, for some reason it doesn't draw the titles if executed on click )
initVizEngine(); 

///////////////////////////////////
/////Initialize Viz Engine
//////////////////////

function initVizEngine() {
    appendLinesMapAndRegions()//// this needs to be run before the svgMaps are added
  Promise.all([
    d3.json(
      "https://raw.githubusercontent.com/SIDS-Dashboard/SIDSDataPlatform/main/data/profileData.json"
    ),
    d3.xml(
      "https://raw.githubusercontent.com/SIDS-Dashboard/SIDSDataPlatform/main/maps/sidsSVG8.svg"
    ),
    d3.json(
      "https://raw.githubusercontent.com/SIDS-Dashboard/SIDSDataPlatform/main/data/exports/mapLocations.json"
    ),
  ])
    .then(function (files) {
    
    //globals
      countryJson = files[0];
      sidsXML = files[1];
      mapLocations = files[2];

      var svgMap =sidsXML.getElementsByTagName("g")[0]; /* set svgMap to root g */
      //console.log(svgMap)
      sidsMaps = d3
        .select("#choro_map_container")
        .selectAll("*")
        .node()
        .appendChild(svgMap); /* island of sidsMaps map */
    
 
    initCountrySvgs(sidsMaps)
    initVizEngineTooltips(); // requires maps to be loaded
        
     
      // //
      $("#sortbySelect").hide();
    })
    .catch(function (err) {
      console.log(err);
    });
}

///////////////////////
//////Append all Elements
//////////////////////////////////////
function appendAllElements(){
    appendCountryTitles()
    appendCountryTitles2();
    appendCountryTitles3();
    appendCountryRectangles();
    //appendIndexRectangles();
    appendCountryLabels();
    appendCountryCircles();
    appendRegionLegend();
    initYAxis();
 
}


///////////////////////
//////Choropleth legend
//////////////////////////////////////

function initChoroLegend(quantize) {
//   $("#indicatorExport").show();
  $("#regionLegend").hide();

  //console.log("init legend", quantize.range());

  var choroLegend = d3
    .select("#choro_legend_container")
    .selectAll("*")
    .selectAll("g.choroLegendEntry")
    .data(quantize.range())
    .enter()
    .append("g")
    .attr("class", "choroLegendEntry");

  choroLegend
    .append("rect")
    .attr("x", function (d, i) {
      return i * 70 + 70;
    })
    .attr("y", 35)
    .attr("width", 70)
    .attr("height", 10);
  // .on("click", function (d) {
  //     if (lastActiveCountry == "") {
  //         resetAll();
  //         d3.select(sidsMaps).selectAll("." + d).attr("class", "countryHighlight");		/* Highlight all counties in range selected */
  //     }
  // });

  choroLegend
    .append("text")
    .attr("class", "textNum")
    .attr("x", function (d, i) {
      return i * 70 + 90;
    }) //leave 5 pixel space after the <rect>
    .attr("y", 30);

  d3.select("#choro_legend_container").select("svg")
    .append("text")
    .attr("class", "choroLegendTitle")
    .attr("x", 400)
    .attr("y", 14)
    .attr("text-anchor", "middle")
    .transition()
    .duration(1200)
    .attr("fill-opacity", 1);
}

function hideChoroLegend(choroLegend) {
  choroLegend.selectAll("rect").transition().duration(1200).attr("opacity", 0);

  choroLegend
    .selectAll(".textNum")
    .transition()
    .duration(1200)
    .attr("fill-opacity", 0);

  // choroLegend
  //     .selectAll('.choroLegendTitle')
  //     .transition().duration(1200)
  //     .attr("fill-opacity", 0)
}

function showChoroLegend(choroLegend) {
  choroLegend.selectAll("rect").transition().duration(1200).attr("opacity", 1);

  choroLegend
    .selectAll(".textNum")
    .text(function (d, i) {
      var extent = quantize.invertExtent(d);
      //extent will be a two-element array, format it however you want:
      return nFormatter(extent[1], 2); //extent[0].toFixed(2) + " - " +
    })
    .transition()
    .duration(1200)
    .attr("fill-opacity", 1);

  // choroLegend
  // .selectAll('.choroLegendTitle')
  // .transition().duration(1200)
  // .attr("fill-opacity", 1)
}

function appendRegionLegend() {
  ///draw region legend
  //console.log("region legend drawn")
  $("#indicatorExport").hide();
}

//////////////////////////////
///X-Axis
///////////////////////////////

function appendLinesMapAndRegions() {
//    main_chart_svg = d3.select("#choro_map_container")//.select("svg");
  
    main_chart_svg
      .append("svg:image")
      .attr("x", -18)
      .attr("y", -415)
      .attr("width", 879)
      .attr("height", 1000)
      .attr("xlink:href", "graphics/SIDS_map_clean-01.png")
      .attr("opacity", 0)
      .attr("class", "choroMap")
      .attr("z-index", -10);
  
    main_chart_svg
      .append("line")
      .style("stroke", "gray")
      .style("stroke-width", 1)
      .attr("x1", 80)
      .attr("y1", 263)
      .attr("x2", 740)
      .attr("y2", 263)
      .classed("regionLine");
  
    main_chart_svg
      .append("line")
      .style("stroke", "gray")
      .style("stroke-width", 1)
      .attr("x1", 80)
      .attr("y1", 363)
      .attr("x2", 740)
      .attr("y2", 363)
      .classed("regionLine");
  
    main_chart_svg
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
    main_chart_svg
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
    main_chart_svg
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

function initXAxis() {
  //initialize the x-axis
  d3.select("#choro_legend_container").select("svg").append("g").attr("class", "barAxis").attr("visibility", "hidden");

}

function initYAxis() {
 // main_chart_svg = d3.select("#choro_map_container").select("svg");
  main_chart_svg
    .append("g")
    .attr("class", "multiYAxis")
    .attr("visibility", "hidden");

  main_chart_svg
    .append("text")
    .attr("class", "yAxisTitle")
    .attr("transform", "rotate(-90)")
    .text(function () {
      return ""; //wdiMeta[indicator2]["Indicator Name"]//["name"];//.toFixed(2))//extent[0].toFixed(2) + " - " +
    })
    .attr("text-anchor", "middle")
    .attr("x", -240)
    .attr("font-weight", "bold")
    .attr("fill-opacity", 0);
}

////////////////////////
////// Appending shapes and titles
//////////////////
function initCountrySvgs(sidsMaps){
   
    d3.select(sidsMaps)
    .selectAll("path")
    .on("mouseover", function (d) {
      if (d3.select(this).classed("countryActive"))
        return; /* no need to change class when county is already selected */
      d3.select(this).attr("class", "countryHover");
    })
    .on("mouseout", function (d) {
      if (d3.select(this).classed("countryActive")) return;
      d3.select(this).attr("class", function (da) {
        return (
          regionColors(
            countryJson[this.id].Region,
            countryJson[this.id]["Member State (Y/N)"]
          ) + " shadow countrySvg"
        );
      });
    })
    .on("click", function (d) {
      zoomed(d3.select(this), this.id); //, countryJson[this.id].Region);
      //d3.select(this).style("fill", "blue");
    });

  d3.select(sidsMaps)
    .selectAll("path")
    .each(function (d) {
       /* Let's add an id to each group that wraps a path */
      d3.select(this.parentNode).attr("id", this.id);
    });

  d3.select(sidsMaps)
    .selectAll("path") // Map countries to regional colors
    .attr("class", function (d) {
       return (
        regionColors(countryJson[this.id].Region,countryJson[this.id]["Member State (Y/N)"]
        ) + " shadow countrySvg"
      );
    });

}

function appendCountryCircles() {
  d3.select("#allSids")
    .selectAll("g") //.selectAll('circle')
    .append("circle")
    .style("fill", function () {
      return (
        "#" +
        regionColors(countryJson[this.parentNode.id].Region, "Y").substring(1)
      );
    }) //

    // .attr("cx", function (d) {
    //     //	console.log(d3.select(this.parentNode).select("path").attr("d"));
    //     //return 600;
    //     //d3.select(sidsMaps).select("path")
    //     //console.log(d3.select(this.parentNode).select("path"))
    //     return bboxDict[this.parentNode.id][4];
    // })
    // .attr("cy", function (d) {
    //     return bboxDict[this.parentNode.id][5];
    // })

    .attr("r", 0)
    .classed("choroCircle", true);
}

function appendCountryLabels() {
  d3.select("#allSids")
    .selectAll("g")
    .append("svg:text")
    .text("")
    .attr("x", function (d) {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
    })
    .attr("y", function (d) {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[5];
    })
    .attr("font-size", 10)
    .attr("fill-opacity", 0)
    .classed("countryLabel", true)
    .attr("visibility", "visible");
}

function appendCountryTitles() {
  d3.select("#allSids")
    .selectAll("g")
    .append("svg:text")
    .text(function (d) {
      try {
        text = countryJson[this.parentNode.id].Country;

        return text;
      } catch {
        console.log(this.parentNode.id);
        return this.parentNode.id;
      }
    })
    .attr("x", function (d) {
      //	console.log(d3.select(this.parentNode).select("path").attr("d"));
      //return 600;
      //d3.select(sidsMaps).select("path")
      //console.log(d3.select(this.parentNode).select("path"))
      return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
    })
    .attr("y", function (d) {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[2] - 11;
    })
    .attr("font-size", 10)
    .classed("choroText", true);
}

function appendCountryTitles2() {
  d3.select("#allSids")
    .selectAll("g")
    .append("svg:text")

    // .text(function (d) {
    //     try {
    //         text = countryJson[this.parentNode.id].Country;
    //         return text;
    //     }
    //     catch {
    //         return this.parentNode.id;
    //     }
    // })

    // .attr("font-size", 10)
    // .attr("fill-opacity",0)
    // .attr('transform', 'rotate(45)')

    // .attr('y', function () {
    //     try {
    //         text = countryJson[this.parentNode.id].Country;
    //         return -1 * 12.18 * mviCountryListLongitude.indexOf(text) + 265;
    //     }
    //     catch {
    //         return 0;
    //     }
    // })
    // .attr('x', function () {
    //     var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
    //     text = countryJson[this.parentNode.id].Country;
    //     index = mviCountryListLongitude.indexOf(text)
    //     if (index >= 0) {
    //         return 12.18 * index + 345;
    //     } else {
    //         return -1000;
    //     }
    // })

    .classed("choroText2", true);
}

function appendCountryTitles3() {
  d3.select("#allSids")
    .selectAll("g")
    .append("svg:text")

    .text(function (d) {
      try {
        text = countryJson[this.parentNode.id].Country;
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
        text = countryJson[this.parentNode.id].Country;
        return -1 * 9.65 * countryListLongitude.indexOf(text) + 265;
      } catch {
        return 0;
      }
    })
    .attr("x", function () {
      var bBox = getBoundingBox(d3.select(this.parentNode).select("path"));
      text = countryJson[this.parentNode.id].Country;
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

function appendCountryLines() {
  d3.select("#allSids")
    .selectAll("g")
    .append("line")
    .style("stroke-width", 1)
    .style("stroke", "green")
    .attr("x1", function (d) {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
    })
    .attr("x2", function (d) {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
    })
    .attr("y1", function (d) {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[2] - 11;
    })
    .attr("y2", function (d) {
      return getBoundingBox(d3.select(this.parentNode).select("path"))[2] - 11; //[5]
    })
    .classed("choroLine", true);
}

function appendCountryRectangles() {
  d3.select("#allSids")
    .selectAll("g")
    .append("rect")
    .style("fill", function () {
      return (
        "#" +
        regionColors(countryJson[this.parentNode.id].Region, "Y").substring(1)
      );
    }) //
    .attr("x", 160)
    .attr("y", 300)
    .attr("width", 0)
    .attr("height", 0)
    .classed("choroRect", true);
}

function appendIndexRectangles() {
  d3.select("#allSids")
    .selectAll("g")
    .append("rect")
    .style("fill", mviDimensionColors["Environmental"])
    .attr("x", 160)
    .attr("y", 300)
    .attr("width", 100)
    .attr("height", 30)
    .classed("choroRect1 choroRectMvi", true);

  d3.select("#allSids")
    .selectAll("g")
    .append("rect")
    .style("fill", mviDimensionColors["Geographic"])
    .attr("x", 160)
    .attr("y", 300)
    .attr("width", 20)
    .attr("height", 100)
    .classed("choroRect2 choroRectMvi", true);

  d3.select("#allSids")
    .selectAll("g")
    .append("rect")
    .style("fill", mviDimensionColors["Economic"])
    .attr("x", 160)
    .attr("y", 300)
    .attr("width", 10)
    .attr("height", 100)
    .classed("choroRect3 choroRectMvi", true);

  d3.select("#allSids")
    .selectAll("g")
    .append("rect")
    .style("fill", mviDimensionColors["Financial"])
    .attr("x", 160)
    .attr("y", 300)
    .attr("width", 20)
    .attr("height", 10)
    .classed("choroRect4 choroRectMvi", true);

  //  console.log("rect12")
}

////////////////////////////////
//Y-axis
///////////////////////////////

function initVizEngineTooltips() {
    const countryMaps = $("#allSids path, .regionTitle");
  
    countryMaps.each(function (index) {
      // try {
  
      if (countryMaps[index].id.includes("RegionTitle")) {
        region = countryMaps[index].id.replace("RegionTitle", "");
        regionTitles = { ais: "AIS", pacific: "Pacific", caribbean: "Caribbean" };
        tooltipTitle = regionTitles[region] + " Region";
        population = 0;
        for (countryIndex in regionCountries[region]) {
          //console.log(regionCountries[region][countryIndex])
          population +=
            countryJson[regionCountries[region][countryIndex]].Population;
        }
        regionColor = regionColor = regionColors(region, "Y").substring(1);
        content = "Population: " + nFormatter(population, 3);
      } else {
        tooltipTitle = countryJson[countryMaps[index].id].Country;
        secondLine = countryJson[countryMaps[index].id].Region + " region";
        thirdLine =
          "Population: " +
          countryJson[countryMaps[index].id].Population.toString();
        regionColor = regionColors(
          countryJson[countryMaps[index].id].Region,
          "Y"
        ).substring(1);
        content = secondLine.toString() + "</h6><h6>" + thirdLine.toString();
      }
  
      $("#choroTooltips").append(
        '<div class="choroTooltip tooltips" id="tooltipChoro' +
          index.toString() +
          '" role="tooltip"><h4 style="color:#' +
          regionColor +
          '">' +
          tooltipTitle +
          '</h4><h6 id="tooltipStat">' +
          content +
          "</h6></div>"
      );
  
      //<div class="arrow" data-popper-arrow></div>
  
      // console.log(index+": yo");
    });
  
    const choroTooltips = $(".choroTooltip");
  
    choroPopperInstance = new Array();
  
    for (i = 0; i < countryMaps.length; i++) {
      choroPopperInstance[i] = Popper.createPopper(
        countryMaps[i],
        choroTooltips[i],
        {
          placement: "top",
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ],
        }
      );
    }
  
    function hide() {
      //map to all
      for (j = 0; j < countryMaps.length; j++) {
        choroTooltips[j].removeAttribute("data-show");
      }
    }
    const showEvents = ["mouseenter", "focus"];
    const hideEvents = ["mouseleave", "blur"];
  
    showEvents.forEach((event) => {
      for (j = 0; j < countryMaps.length; j++) {
        // console.log(j,countryMaps[j])
        if (countryMaps[j].id.includes("RegionTitle")) {
          tooltippedDiv = countryMaps[j];
        } else {
          tooltippedDiv = countryMaps[j].parentNode;
        }
  
        tooltippedDiv.addEventListener(event, hovered.bind(null, j));
      }
    });
  
    function hovered(j) {
      // console.log("i",j)
      choroTooltips[j].setAttribute("data-show", "");
      choroPopperInstance[j].update();
      console.log('hovered')
    }
  
    hideEvents.forEach((event) => {
      //map to all?
      for (j = 0; j < countryMaps.length; j++) {
        //    console.log("i",j)
        if (countryMaps[j].id.includes("RegionTitle")) {
          tooltippedDiv = countryMaps[j];
        } else {
          tooltippedDiv = countryMaps[j].parentNode;
        }
  
        tooltippedDiv.addEventListener(event, hide);
      }
    });
  }