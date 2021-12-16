///////////////////////////////////
//Initializations
//////////////////////




///initializations

var hues = ["b", "b", "b",]
//var hue = "g";	/* b=blue, g=green, r=red colours - from ColorBrewer */
var rateById = d3.map();
var lastActiveCountry = "";
var sidsEngineInit = 0
var firstIndicatorInit = 0
var sidsMaps;
var data;
var defaultScale = 1;	/* default scale of map - fits nicely on standard screen */
var scale = 3;		/* maximum size to zoom county */
var quantize = d3.scale.quantize()
var countryJson = [];
var sidsXML;
var wdiFull;
var wdiMeta;
var mapLocations;
var indicatorGlobal="Region";
var bboxDict = {};
var textBBoxDict = {};
var bboxInit=0;

countryListLongitude = ["Belize", "Jamaica", "Cayman Islands", "Cuba", "The Bahamas", "Curaçao", "Aruba", "Haiti", "Dominican Republic",
    "St. Kitts and Nevis", "Sint Maarten","Antigua and Barbuda", "Montserrat", "Dominica", "St. Lucia"
    , "Barbados", "St. Vincent and the Grenadines", "Grenada", "Trinidad and Tobago", "Guyana", "Suriname", "", "",
    "Cabo Verde", "Guinea-Bissau",
    "São Tomé and Príncipe", "Comoros", "Bahrain", "Mauritius", "Seychelles", "Maldives", "Singapore", "", "",
    "Timor Leste", "Palau", "Papua New Guinea", "Solomon Islands",
    "Micronesia", "Marshall Islands", "Vanuatu", "Nauru", "Kiribati", "Fiji", "Tuvalu", "Tonga", "Niue", "Samoa", "Cook Islands"]

regionCountries = {
    "ais": ["CPV", "GNB", "STP", "COM", "BHR", "MUS", "SYC", "MDV", "SGP"], 
        "pacific": ["TLS", "PLW", "PNG", "SLB","TON",
            "FSM", "MHL", "VUT", "NRU", "KIR", "FJI", "TUV", "ABW", "NIU", "WSM", "TKL", "COK"],
    "caribbean": ["BLZ", "JAM", "CYM", "CUB", "BMU", "BHS", "ABW", "CUW", "TCA", "HTI", "DOM",
        "KNA", "VGB", "AIA", "SXM", "ATG", "MSR", "DMA", "LCA"
        , "BRB", "VCT", "GRD", "TTO", "GUY", "SUR"]
}

sidsDict= {"ATG":"Antigua and Barbuda", "ABW":"Aruba","BHS":"The Bahamas","BMU":"Bermuda",
"BHR":"Bahrain","BRB": "Barbados", "BLZ":"Belize","VGB": "British Virgin Islands","CPV":"Cabo Verde",
"CYM":"Cayman Islands", "COM":"Comoros","CUB": "Cuba","CUW":"Curaçao","DMA":"Dominica","DOM": "Dominican Republic",
"FJI":"Fiji","GRD":"Grenada","GNB": "Guinea-Bissau","GUY": "Guyana", "HTI":"Haiti","JAM":"Jamaica",
"KIR":"Kiribati","MDV": "Maldives","MHL": "Marshall Islands","MUS":"Mauritius","FSM": "Micronesia, Fed. Sts.", 
"NRU":"Nauru","PLW": "Palau","PNG":"Papua New Guinea","WSM": "Samoa","STP": "São Tomé and Príncipe",
"SYC":"Seychelles","SGP":"Singapore","SXM":"Sint Maarten","SLB":"Solomon Islands",
"KNA":"St. Kitts and Nevis","VCT": "St. Vincent and the Grenadines","LCA":"St. Lucia",
"SUR":"Suriname","TLS": "Timor Leste","TTO":"Trinidad and Tobago", "TON": "Tonga", 
"TUV":"Tuvalu","TCA":"Turks and Caicos Islands","VUT": "Vanuatu","AIA":"Anguilla",
"COK":"Cook Islands","MSR":"Montserrat","TKL":"Tokelau","NIU": "Niue"}


function getIsoByName(countryName) {
    return Object.keys(sidsDict).find(key => sidsDict[key] === countryName);
  }

// sidsSvgToIso= {"antiguaAndBarbuda":"ATG", "aruba":"ABW","bahamas":"BHS","bermuda":"BMU",
// "bahrain":"BHR", "barbados":"BRB", "belize":"BLZ", "britishVirginIslands":"VGB","caboVerde":"CPV","caymanIslands":"CYM", "comoros":"COM",
// "cuba":"CUB","curacao":"CUW","dominica":"DMA", "dominicanRepublic":"DOM",
// "fiji":"FJI" ,"grenada":"GRD", "guineaBissau":"GNB", "guyana":"GUY", "haiti":"HTI", 
// "jamaica":"JAM", "kiribati":"KIR", "maldives":"MDV", "marshallIslands":"MHL",
// "mauritius":"MUS", "micronesia":"FSM", "nauru":"NRU", "palau":"PLW", 
// "papuaNewGuinea":"PNG", "samoa":"WSM", "saoTomeAndPrincipe":"STP", "seychelles":"SYC",
// "singapore":"SGP","sintMaarten":"SXM","solomonIslands":"SLB", "kittsAndNevis":"KNA", "stVincent":"VCT",
// "saintLucia":"LCA", "suriname":"SUR", "timorLeste":"TLS","trinidadAndTobago":"TTO",  "tonga":"TON", 
//            "tuvalu":"TUV","turksAndCaicos":"TCA", "vanuatu":"VUT","anguilla":"AIA","cookIslands":"COK",
//            "montserrat":"MSR","tokelau":"TKL", "niue":"NIU"}

///////////////////////
//////Draw template
//////////////////////////////////////


const mw = '800';
const mh = '580';
var main_chart_svg = d3.select("#choro_map_container").append("svg")
    .attr('width', mw)
    .attr('height', mh)//'800'//'auto'
var choro_legend_svg = d3.select("#choro_legend_container").append("svg")
    .attr("width", mw)
    .attr("height", 60)

    //certainly a better way to do this right?
d3.select(self.frameElement).style("height", "650px");



function updateVizSliders(){
x = $(".selectedViz")
$('.vizShader').stop().animate({
    'width': x.width() + 32,
    'left': x.position().left,
}, 400);

 x = $(".selectedMviPreset")
        $(".mviPresetShader").stop().animate({
            'width': x.width() + 32,
            'left': x.position().left
        }, 400);

x = $('.selectedSortby')

        $('.sortbyShader').stop().animate({
            'width': x.width() + 32,
            'left': x.position().left
        }, 400);
    
        

}


function updateCountrySvgColors(indicatorData, indicatorCode, hueNum,indiSelections) {

    indicatorDataYear=indicatorData["data"][indiSelections["year"]]

    ///draw choropleth scale
    if (indiSelections["page"] == "countryDataTab") {

        /* break the data values into 9 ranges of €100 each   */

        max = Math.max(...Object.values(indicatorDataYear).filter(function (el) {
            return !isNaN(parseFloat(el)) && isFinite(el);
        }))
        min = 0// Math.min(...Object.values(indicatorData).filter(function (el) { return !isNaN(parseFloat(el)) && isFinite(el);  }))
        // max=

        quantize = d3.scale.quantize()
            .domain([min, max])
            .range(d3.range(9).map(function (i) { return hues[hueNum] + i + "-9"; }));



        d3.select(sidsMaps).selectAll("path")	/* Map  counties to  data */
            .attr("class", function (d) {
            
                try {
            value=indicatorDataYear[this.id]      
                    if (value == "No Data" || typeof value != "number") {
                        //hide country name
                        if (indicatorCode == "Region") {
                            //console.log("region",this.id)
                            return (regionColors(countryJson[this.id].Region, countryJson[this.id]["Member State (Y/N)"]) + " shadow countrySvg"); 
                        } 
                        else {
                            //console.log("nodata",this.id)
                            return "nodata countrySvg"
                        }
                        
                    }

                    else {

                        //show country name

                        if (indiSelections["viz"] == "Multi-indicator" || indiSelections["viz"] == "Bar Chart" || indiSelections["viz"] == "Spider" || indiSelections["viz"] == "Global View" || indicatorCode == "Region") {
                            return (regionColors(countryJson[this.id].Region, "Y") + " shadow countrySvg")
                        }
                        else {
                           // console.log(value)
                            return (quantize(value) + " shadow countrySvg");
                        }
                    }
                    
                } catch (error) {
                    console.log("broken?",this.id)
                    return "nodata"
                }

            }).on("mouseout", function (d) {
                if (d3.select(this).classed("countryActive")) return;
                d3.select(this).attr("class", function (da) { 			/* reset county color to quantize range */
                    stat = indicatorDataYear[this.id]

                    if (indicatorCode == "Region") { return (regionColors(countryJson[this.id].Region, "Y") + " shadow countrySvg") } else {

                        if (typeof stat == "undefined" || stat == "No Data") {
                            //hide country name
                            return "nodata countrySvg"
                        }
                        else {
                            //show country name
                            return (quantize(stat) + " shadow countrySvg");
                        }
                    }
                });
            })

    }
    else{
        d3.select("#choro_map_container").selectAll("path")		/* Map  counties to  data */
        .attr("class", function (d) {
    try{
            return (regionColors(countryJson[this.id].Region, "Y") + " shadow countrySvg")
    }catch(error){}

        });
    }


}

function updateCountryPositions(elementsJson){
  //update country svg positions
  d3.select(sidsMaps)
    .selectAll(".countrySvg")
    .transition()
    .duration(1200) //make transition time relative to to/from viz
    .attr("transform", function (d) {
      VTz = elementsJson[this.id]["VT"];
      try {
        return ("scale(" +  VTz["scale"] + "," +  VTz["scale"] +  ")translate(" + VTz["x"] +   "," +   VTz["y"] +    ")" );
      } catch (error) {
        return "";
      }
    });
}


function updateCountryTitles(elementsJson,indicatorCode,indiSelections,noData){//indicatorCode,indiSelections["page"], indiSelections["viz"], indiSelections["sortby"],indiSelections["year"], indicatorData,elementsJson,noData) {
   
        d3.select(sidsMaps).selectAll(".choroText")
            .transition()
            .duration(1200) //make transition time relative to to/from viz
            .attr("transform", function (d) {
                var country = getIsoByName(this.innerHTML);

                // var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
                // textBBox = this.getBBox()
                // TT = textTransform(country, bBox, textBBox, indiSelections["viz"], indicatorData);//, indicatorData2);
                //console.log(country)
                try{
                return elementsJson[country]["TT"];
                }
                catch(error){console.log("broken",this.innerHTML)}
            })

        d3.select(sidsMaps).selectAll(".choroText2").style("pointer-events", "none")
        d3.select(sidsMaps).selectAll(".choroText3").style("pointer-events", "none")
        d3.select(sidsMaps).selectAll(".countryLabel").style("pointer-events", "none")

    
        if (indiSelections["viz"] == "Global View") {
            $(".choroText").each(function (d) {           $(this).css("fill-opacity", 0)           })
            $(".choroText2").each(function (d) {           $(this).css("fill-opacity", 0)            })
            $(".choroText3").each(function (d) {             $(this).css("fill-opacity", 1)         })
        }
        else{//huh?
            $(".choroText2").each(function (d) {             $(this).css("fill-opacity", 0)          })
            $(".choroText3").each(function (d) {             $(this).css("fill-opacity", 0)          })
        }


        
        // if (indiSelections["page"] == "mviTab"){

        //     $(".choroText").each(function (d) {
        //         //which is this only mviCountryListSpider? it doesn't check which tab is selected
        //         ///console.log(indicator, indiSelections["page"], indiSelections["viz"])
        //         if(noData.includes(country)) {
        //             $(this).css("fill-opacity", 0)
        //         }
        //         else {
        //             $(this).css("fill-opacity", 1)
        //         }
        //     })

        //     $(".choroText2").each(function (d) {
        //         $(this).css("fill-opacity", 0)
        //     })
        //     $(".choroText3").each(function (d) {

        //         $(this).css("fill-opacity", 0)
        //     })


        // }

        if (indiSelections["page"] == "countryDataTab") {
            if(indiSelections["viz"]=="Time Series"){
                $(".choroText").each(function (d) {           $(this).css("fill-opacity", 0)           })
            }else{


        $(".choroText").each(function (d) {
            var country = getIsoByName(this.innerHTML);
            //   console.log(this.innerHTML)
            if (indicatorCode == "Region" && indiSelections["viz"] == "Choropleth") {
                $(this).css("fill-opacity", 1)

            } else {

                if (noData.includes(country) || indiSelections["viz"] == "Global View") {

                    $(this).css("fill-opacity", 0)
                    if (indiSelections["viz"] == "Bar Chart") { scale = 1 }//.05
                    else if (indiSelections["viz"] == "Choropleth") { scale = 1 }
                    d3.select(this).transition().duration(1200).attr("transform", "scale(" + scale + "," + scale + ")")
                }
                else {

                    $(this).css("fill-opacity", 1)

                }
            }
        })
    }
}
    // else if (indiSelections["page"] == "mviTab"&&indiSelections["viz"]=="Bar Chart") {
    //     chosenCountryListMVI=getChosenCountryListMVI()
    // //    console.log(chosenCountryListMVI)
    //     d3.select(sidsMaps).selectAll(".choroText")
    //     .transition()
    //     .duration(1200) //make transition time relative to to/from viz
    //     .attr("transform", function (d) {
    //         //    console.log(this.innerHTML)
    //         var country = this.innerHTML;

    //         var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
    //         textX = bBox[4]
    //         textY = bBox[2] - 11;
    //         textBBox = this.getBBox()
    //         if (chosenCountryListMVI.includes(country)) {
              
    //             //console.log(textBBox)

    //             MBC = mviBarChart(country, indiSelections["viz"], getMVIData(), getChosenCountryListMVI(), 1)["y"]
    //             // console.log(bBox,textBBox,TT,country)
    //             totalVals = 40
    //             totalHeight = 500
    //             rank = MBC / 12.45  //almost totalHeight/totalVals
    //             //console.log(rank)
    //             return "scale(1,1) translate(" + (-textX + 140 - textBBox.width / 2) + "," + (-textY + totalHeight / totalVals * (rank + .5)) + ")"
    //         } else {
    //             return "scale(1,1) translate(" + (-textX + 140 - textBBox.width / 2) + "," + (-textY)+")"
    //         }

    //     })
    // }

    //     if (indiSelections["page"] == "mviTab"){
    //     if (indiSelections["viz"] == "Global View") {
    //         $(".choroText2").each(function (d) {
    //             $(this).css("fill-opacity", 1)
    //         })
    //         $(".choroText3").each(function (d) {
    //             $(this).css("fill-opacity", 0)
    //         })
    //     }
    //     else {
    //         $(".choroText2").each(function (d) {
    //             $(this).css("fill-opacity", 0)
    //         })
    //         $(".choroText3").each(function (d) {
    //             $(this).css("fill-opacity", 0)
    //         })
    //     }
    // }


    if (indiSelections["viz"] == "Multi-indicator") { d3.select(".yAxisTitle").transition().duration(1000).attr("fill-opacity", 1) }
    else { d3.select(".yAxisTitle").transition().duration(1000).attr("fill-opacity", 0) }


}

function updateLabels(elementsJson,noData){//indiSelections["page"], indiSelections["viz"], indiSelections["year"],indiSelections["sortby"],indicatorData, noData) {
    if (indiSelections["page"] == "countryDataTab") {
        // labelTransformData = {}
        // $(".countryLabel").each(function () {
        //     var country = this.parentNode.id
        //     bBox=bboxDict[country]
        //     dat = labelTransform(country, bBox, indiSelections["viz"], indiSelections["year"],indiSelections["sortby"],indicatorData,indiSelections["page"])//, indicatorData2)
        //     labelTransformData[country] = dat

        // });

        d3.select(sidsMaps).selectAll(".countryLabel")
            .transition()
            .duration(1200)
            .attr("x", function () { return elementsJson[this.parentNode.id]["LT"]["x"] + 170 })
            .attr("y", function () { return elementsJson[this.parentNode.id]["LT"]["y"] })
            .attr("fill-opacity", function () {
                if (noData.includes(this.parentNode.id) || indiSelections["viz"] != "Bar Chart") {
                    return 0 ;}
                else { 
                    return 1; }
            })
            .text(function () {
                var country = this.parentNode.id
                return nFormatter(indicatorData["data"][indiSelections["year"]][country], 3)
            })

    }
}

function updateRectangles(elementsJson) {
    // rectTransformData = {}

    // $(".choroRect").each(function () {
    //     var country = this.parentNode.id
    //     var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
    //     rectTransformData[country] = rectTransform(country, bBox, indiSelections["viz"], indicatorData)//, indicatorData2)
    // });

    d3.select(sidsMaps).selectAll(".choroRect")
        .transition()
        .duration(1200)
        .attr("x", function () { return elementsJson[this.parentNode.id]["RT"]["x"] })
        .attr("y", function () { return elementsJson[this.parentNode.id]["RT"]["y"] })
        .attr("width", function () { return elementsJson[this.parentNode.id]["RT"]["width"] })
        .attr("height", function () { return elementsJson[this.parentNode.id]["RT"]["height"] })


}

function updateCircles(elementsJson) {
    // circleTransformData = {}

    // $(".choroCircle").each(function () {
    //     var country = countryJson[this.parentNode.id].Country
    //     var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
    //     CT = circleTransform(country, bBox, indiSelections["viz"], indicatorData,indiSelections["page"])//, indicatorData2)
    //     circleTransformData[country] = CT
    // });
    // // console.log(circleTransformData)

    d3.select(sidsMaps).selectAll(".choroCircle")
        .transition()
        .duration(1200)
        .attr("cx", function () { return elementsJson[this.parentNode.id]["CT"]["x"] })
        .attr("cy", function () { return elementsJson[this.parentNode.id]["CT"]["y"] })
        .attr("r", function () { return elementsJson[this.parentNode.id]["CT"]["r"] })

}


///////////////////////
//////Choropleth legend
//////////////////////////////////////


function initChoroLegend() {
    $("#indicatorExport").show()
    $("#regionLegend").hide()

    console.log("init legend",quantize.range())

    var choroLegend = d3.select("#choro_legend_container").selectAll('*').selectAll('g.choroLegendEntry')
        .data(quantize.range())
        .enter()
        .append('g').attr('class', 'choroLegendEntry')


    choroLegend
        .append('rect')
        .attr("x", function (d, i) {
            return i * 70 + 70;
        })
        .attr("y", 35)
        .attr("width", 70)
        .attr("height", 10)
        // .on("click", function (d) {
        //     if (lastActiveCountry == "") {
        //         resetAll();
        //         d3.select(sidsMaps).selectAll("." + d).attr("class", "countryHighlight");		/* Highlight all counties in range selected */
        //     }
        // });

    choroLegend
        .append('text').attr("class", "textNum")
        .attr("x", function (d, i) {
            return i * 70 + 90;
        }) //leave 5 pixel space after the <rect>
        .attr("y", 30)


        d3.select("#choro_legend_container").selectAll('*').select('g.choroLegendEntry')
        .append('text').attr("class", "choroLegendTitle")
        .attr("x", 400)
        .attr("y", 14).attr("text-anchor", "middle")
        .transition().duration(1200)
        .attr("fill-opacity", 1)

}


function updateChoroLegend(indicatorCode,indiSelections) {
    //console.log("updating legend")

    // hueNum=2

    //     quantize = d3.scale.quantize()
    //     .domain([min,max])
    //     .range(d3.range(9).map(function (i) { return hues[hueNum] + i + "-9"; }));

    var choroLegend = d3.select("#choro_legend_container").selectAll('g.choroLegendEntry')
    
    choroLegend.data(quantize.range())

        //var choroLegend = d3.select("#choro_legend_container").selectAll('g.choroLegendEntry')

    choroLegend.select(".choroLegendTitle").text(
        function () {
            //extent will be a two-element array, format it however you want:
            //return format(extent[0]) + " - " + format(+extent[1])
                // if (indiSelections["page"] == "mviTab") {
                //     return "Multidimensional Vulnerability Index"
                // }
                // else {
                    console.log(indicatorCode)
                    return indicatorMeta[indicatorCode]["Indicator"]//["name"];//.toFixed(2))//extent[0].toFixed(2) + " - " + 

                
            // }
        })

    choroLegend
        .selectAll('rect')
        .attr("class", function (d) {
            return d;
        });


    // console.log("info?", indiSelections["viz"])
    if (indiSelections["viz"] == "Choropleth") {
        showChoroLegend(choroLegend);
    }
    else if (indiSelections["viz"] == "Bar Chart" || indiSelections["viz"] == "Multi-indicator" || indiSelections["viz"] == "Info" ||indiSelections["viz"] == "Time Series" || indiSelections["viz"] == "Spider" || indiSelections["viz"] == "Global View") {
        hideChoroLegend(choroLegend);
    }
    if(indiSelections["viz"]=="Info"||indiSelections["viz"]=="Global View"){
    choroLegend
        .selectAll('.choroLegendTitle')
        .transition().duration(1200)
        .attr("fill-opacity", 0)
    }
    else{
    choroLegend
        .selectAll('.choroLegendTitle')
        .transition().duration(1200)
        .attr("fill-opacity", 1)
    }


}

function hideChoroLegend(choroLegend) {

    choroLegend
        .selectAll('rect')
        .transition().duration(1200)
        .attr("opacity", 0)

    choroLegend
        .selectAll('.textNum')
        .transition().duration(1200)
        .attr("fill-opacity", 0)

    // choroLegend
    //     .selectAll('.choroLegendTitle')
    //     .transition().duration(1200)
    //     .attr("fill-opacity", 0)
}

function showChoroLegend(choroLegend) {

    choroLegend
        .selectAll('rect')
        .transition().duration(1200)
        .attr("opacity", 1)

    choroLegend
        .selectAll('.textNum')
        .text(function (d, i) {
            var extent = quantize.invertExtent(d);
            //extent will be a two-element array, format it however you want:
            return (nFormatter(extent[1], 2))//extent[0].toFixed(2) + " - " + 
        })
        .transition().duration(1200)
        .attr("fill-opacity", 1)

        // choroLegend
        // .selectAll('.choroLegendTitle')
        // .transition().duration(1200)
        // .attr("fill-opacity", 1)
}

function convertChoroToBar() {
    console.log("done")
}

function drawRegionLegend() {
    ///draw region legend
    //console.log("region legend drawn")
    $("#indicatorExport").hide()
}


//////////////////////////////
///X-Axis
///////////////////////////////

function initBarAxis() {
    choro_legend_svg.append("g").attr("class", "barAxis").attr("visibility", "hidden");
}

function updateLinesAndMap(indiSelections){
    

  if (indiSelections["viz"] == "Choropleth") {
    main_chart_svg
      .selectAll("line")
      .transition()
      .duration(1000)
      .style("opacity", 1);
  } else {
    main_chart_svg
      .selectAll("line")
      .transition()
      .duration(1000)
      .style("opacity", 0);
  }

  d3.selectAll(".choroMap")
    .transition()
    .duration(1200) //make transition time relative to to/from viz
    .attr("opacity", function (d) {
      if (indiSelections["viz"] == "Global View") {
        return 0.7;
      } else {
        return 0;
      }
    });
}

function updateBarAxis(indicatorData,indiSelections) {
 
indicatorDataYear=indicatorData["data"][indiSelections["year"]]

    barAxis = d3.select(".barAxis")
    const x = d3.scaleLinear();
    var margin = { left: 160, right: 5 };
    var xAxis = d3.axisTop(x);
    var width = 440
    var height = 90

    max = Math.max(...Object.values(indicatorDataYear).filter(function (el) {
        return !isNaN(parseFloat(el)) && isFinite(el);
    }))
    min = 0

    if (indiSelections["viz"] == "Multi-indicator") {
        margin.left = 60;
        width = 440
        min = Math.min(...Object.values(indicatorDataYear).filter(function (el) { return !isNaN(parseFloat(el)) && isFinite(el); }))
    }


    xAxis.tickFormat(d3.format(".2s"));
    x
        .domain([min, max])
        .range([0, width]);

    if (indiSelections["viz"] == "Choropleth" || indiSelections["viz"] == "Global View" || indiSelections["viz"] == "Spider" || indiSelections["viz"] == "Info" || indiSelections["viz"] == "Time Series") {
        x.range([0, 0]);
        setTimeout(function () { barAxis.attr("visibility", "hidden") }, 1100)
    }
    else if (indiSelections["viz"] == "Bar Chart") { barAxis.attr("visibility", "visible")

}
    else if (indiSelections["viz"] = "Multi-indicator") { barAxis.attr("visibility", "visible") }

    barAxis
        .transition().duration(1200)
        .attr("transform", `translate(${margin.left}, ${height / 2})`)
        .call(xAxis);
}

// function updateMviBarAxis(pillarData,indiSelections) {

//     values = []
//     for (key in pillarData[0]["axes"]) {
//         values.push(pillarData[0]["axes"][key].value)
//     }
    

//     barAxis = d3.select(".barAxis")
//     const x = d3.scaleLinear();
//     var margin = { left: 160, right: 5 };
//     var xAxis = d3.axisTop(x);
//     var width = 440
//     var height = 90

//     max = Math.max(...values)
//     min = 0

//     if (indiSelections["viz"] == "Multi-indicator") {
//         margin.left = 90;
//         width = 700
//         min = Math.min(...values)
//     }

//     // console.log(max, min)

//     xAxis.tickFormat(d3.format(".2s"));
//     x
//         .domain([min, max])
//         .range([0, width]);

//     if (indiSelections["viz"] == "Choropleth" || indiSelections["viz"] == "Global View" || indiSelections["viz"] == "Spider"||indiSelections["viz"]=="Time Series") {
//         x.range([0, 0]);
//         setTimeout(function () { barAxis.attr("visibility", "hidden") }, 1100)

//     }
//     else if (indiSelections["viz"] == "Bar Chart") { barAxis.attr("visibility", "visible") }
//     else if (indiSelections["viz"] = "Multi-indicator") { barAxis.attr("visibility", "visible") }

//     barAxis
//         .transition().duration(1200)
//         .attr("transform", `translate(${margin.left}, ${height / 2})`)
//         .call(xAxis);
// }

////////////////////////////////
//Y-axis
///////////////////////////////




function initYAxis() {
    main_chart_svg.append("g").attr("class", "multiYAxis").attr("visibility", "hidden");


    main_chart_svg.append("text").attr("class", "yAxisTitle")
        .attr("transform", "rotate(-90)")
        .text(function () {
            return ""//wdiMeta[indicator2]["Indicator Name"]//["name"];//.toFixed(2))//extent[0].toFixed(2) + " - " + 
        })
        .attr("text-anchor", "middle")
        .attr("x", -240)
        .attr("font-weight", "bold")
        .attr("fill-opacity", 0)

}


function updateYAxis(indicatorData,indiSelections) {

indicatorDataYear=indicatorData["data"][indiSelections["year"]]

    yAxisContainer = d3.select(".multiYAxis")
    const yScale = d3.scaleLinear();
    var yAxis = d3.axisLeft(yScale)
    yAxis.tickFormat(d3.format(".2s"));


    var margin = { left: 45, right: 5, top: 245 };



    if (indiSelections["viz"] == "Choropleth" || indiSelections["viz"] == "Bar Chart" || indiSelections["viz"] == "Spider"||indiSelections["viz"]=="Time Series") {
        yScale
            .range([0, 0]);
        //setTimeout(function(){
            yAxisContainer.attr("visibility", "hidden")
        //},900)
    }
    else if (indiSelections["viz"] == "Global View") {
        var height = 180
        var margin = { left: 45, right: 5, top: 245 };

        // indicatorData2 = wdiFull[indicator2]["data"]//[indiSelections["year"]]

        max = Math.max(...Object.values(indicatorDataYear).filter(function (el) {
          return !isNaN(parseFloat(el)) && isFinite(el);
        }))
        // min = Math.min(...Object.values(indicatorData2).filter(function (el) { return !isNaN(parseFloat(el)) && isFinite(el); }))
        min = 0

        yScale
            .domain([min, max])
            .range([height, 0]);

            yAxisContainer.attr("visibility", "visible")
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
        .transition().duration(1200)
        .call(yAxis)
        .attr("transform", `translate(${margin.left}, ${margin.top})`)


    // main_chart_svg.selectAll(".yAxisTitle")
    //     .text(function (d, i) {
    //         return wdiMeta[indicator2]["Indicator Name"]//["name"];//.toFixed(2))//extent[0].toFixed(2) + " - " + 
    //     })

}



////////////////////////
////// Appending shapes and titles
//////////////////
function appendLinesMapAndRegions(){
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

}
function appendCountryCircles() {

    d3.select('#allSids').selectAll("g")//.selectAll('circle')
        .append("circle")
        .style("fill", function () {

            return "#" + regionColors(countryJson[this.parentNode.id].Region, "Y").substring(1)
        })//

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
    d3.select('#allSids').selectAll("g")
        .append("svg:text")
        .text("")
        .attr("x", function (d) {
            return getBoundingBox(d3.select(this.parentNode).select("path"))[4];
        })
        .attr("y", function (d) {
            return (getBoundingBox(d3.select(this.parentNode).select("path"))[5]);
        })
        .attr("font-size", 10)
        .attr("fill-opacity", 0)
        .classed("countryLabel", true)
        .attr("visibility", "visible")
}

function appendCountryTitles() {
    
    d3.select('#allSids').selectAll("g")
        .append("svg:text")
        .text(function (d) {
            try {
                text = countryJson[this.parentNode.id].Country;
              
                return text;
            }
            catch {
                console.log(this.parentNode.id)
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
            return (getBoundingBox(d3.select(this.parentNode).select("path"))[2] - 11);
        })
        .attr("font-size", 10)
        .classed("choroText", true)





}

function appendCountryTitles2() {

    d3.select('#allSids').selectAll("g")
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

    d3.select('#allSids').selectAll("g")
        .append("svg:text")

        .text(function (d) {
            try {
                text = countryJson[this.parentNode.id].Country;
                return text;
            }
            catch {
                return this.parentNode.id;
            }
        })

        .attr("font-size", 10)
        .attr("fill-opacity",0)
        .attr('transform', 'rotate(45)')

        .attr('y', function () {
            try {
                text = countryJson[this.parentNode.id].Country;
                return -1 * 9.65 * countryListLongitude.indexOf(text) + 265;
            }
            catch {
                return 0;
            }
        }).attr('x', function () {
            var bBox = getBoundingBox(d3.select(this.parentNode).select("path"))
            text = countryJson[this.parentNode.id].Country;
            index = countryListLongitude.indexOf(text)
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


    d3.select('#allSids').selectAll("g")
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
            return getBoundingBox(d3.select(this.parentNode).select("path"))[2] - 11;//[5]
        })
        .classed("choroLine", true);

}

function appendCountryRectangles() {

    d3.select('#allSids').selectAll("g")
        .append("rect")
        .style("fill", function () {

            return "#" + regionColors(countryJson[this.parentNode.id].Region, "Y").substring(1)
        })//
        .attr("x", 160)
        .attr("y", 300)
        .attr("width", 0)
        .attr("height", 0)
        .classed("choroRect", true);

}

function appendMultiRectangles(country, selectedViz) {
    d3.select("#allSids")
      .selectAll("g")
      .append("rect")
      .style("fill", mviDimensionColors["Environmental"])
      .attr("x", 160)
      .attr("y", 300)
      .attr("width", 0)
      .attr("height", 0)
      .classed("choroRect1 choroRectMvi", true);
  
    d3.select("#allSids")
      .selectAll("g")
      .append("rect")
      .style("fill", mviDimensionColors["Geographic"])
      .attr("x", 160)
      .attr("y", 300)
      .attr("width", 0)
      .attr("height", 0)
      .classed("choroRect2 choroRectMvi", true);
  
    d3.select("#allSids")
      .selectAll("g")
      .append("rect")
      .style("fill", mviDimensionColors["Economic"])
      .attr("x", 160)
      .attr("y", 300)
      .attr("width", 0)
      .attr("height", 0)
      .classed("choroRect3 choroRectMvi", true);
  
    d3.select("#allSids")
      .selectAll("g")
      .append("rect")
      .style("fill", mviDimensionColors["Financial"])
      .attr("x", 160)
      .attr("y", 300)
      .attr("width", 0)
      .attr("height", 0)
      .classed("choroRect4 choroRectMvi", true);
  
    //  console.log("rect12")
  }



/////////////////////////
////Transform functions
////////////////////////////////

function circleTransform(country, bBox,indicatorData, indiSelections) {
    val = indicatorData[country]
    //val2 = indicatorData2[country]

    VT = vizTransform(country, bBox, indicatorData,indiSelections);


    if (indiSelections["viz"] == "Choropleth") {
        return { "x": bBox[4], "y": bBox[5], "r": 0 }
    }
    else if (indiSelections["viz"] == "Global View") {
        //  console.log(VT,bBox,country)
        if (mapLocations[country]["countryWidth"] == "no") { r = 2 } else { r = 0 }
        return { "x": (VT["x"] + bBox[4]) * VT["scale"], "y": (VT["y"] + bBox[5]) * VT["scale"], "r": r }

    }
    else if (indiSelections["viz"] == "Bar Chart") {
        return { "x": 0, "y":0, "r": 0 }
    }
    else if (indiSelections["viz"] == "Multi-indicator") {
        //the 2.7 must come from the scale factor on the choropleth?
        return { "x": (VT["x"] + bBox[4]) / 2.7, "y": (VT["y"] + bBox[5]) / 2.7, "r": 0 }
    }
    else if (indiSelections["viz"] == "Spider") {
        //the 2.7 must come from the scale factor on the choropleth?
        return { "x": (VT["x"] + bBox[4]) / 1.85, "y": (VT["y"] + bBox[5]) / 1.85, "r": 0 }
    }
    else if (indiSelections["viz"]=="Time Series"){
        return { "x": bBox[4], "y": bBox[5], "r": 0 }
    }
    //&& typeof val == "number"){

}


function rectTransform(country, bBox, indicatorData,indiSelections) {
    // console.log(indicatorData)
    indicatorDataYear=indicatorData["data"][indiSelections["year"]]
    val = indicatorDataYear[country]
    totalHeight = 500
    totalWidth = 440
    cx = bBox[4]
    cy = bBox[5]


    if (indiSelections["viz"] == "Bar Chart") {
        //if on mvi page, width should be zero but other vars can be same as bar chart

        // if (indiSelections["page"] == "mviTab") {
        //     // return { "x": 160, "y": totalHeight / totalVals * (rank) + topMargin, "width": 0, "height": totalHeight / totalVals - margin }//,"color":color};
        //     output= mviBarChart(country, "Bar Chart", getMVIData(), getChosenCountryListMVI(), 1)

        // }

        // else {
            
            if (isNumeric(val)) {


            try {
                var filtered = Object.fromEntries(Object.entries(indicatorDataYear).filter(([k, v]) => isNumeric(v)))// == "number"))

                sortedData = sort_object(filtered);
                indicatorValues = Object.values(filtered)
     //           console.log(sortedData)

                if (indiSelections["sortby"] == "Rank") {
                    //this filter removes any empty elements
                    rank = sortedData[country]
                    totalVals = indicatorValues.length
                }
                else if (indiSelections["sortby"] == "Region") {
                    countryOrder = Object.keys(sortedData)
                    pacificListSort = countryOrder.filter(item => regionCountries["pacific"].includes(item));
                    aisListSort = countryOrder.filter(item => regionCountries["ais"].includes(item));
                    caribbeanListSort = countryOrder.filter(item => regionCountries["caribbean"].includes(item));
                    chosenCountryList = caribbeanListSort.concat(["", ""], aisListSort, ["", ""], pacificListSort)
                    rank = chosenCountryList.indexOf(country)
                   //console.log(rank)
                    if (rank == -1) {
                        console.log(country,val)
                    }
                    totalVals = indicatorValues.length + 4
                }


                topMargin = 0
                margin = 4

                maxx = Math.max(...indicatorValues)
                minn = 0//Math.min(...indicatorValues)
                normValue = (val - minn) / (maxx - minn)

                //console.log(country,normValue,rank,minn)
//console.log(totalHeight,totalVals,rank)

output={ "x": 160, "y": totalHeight / totalVals * (rank) + topMargin, "width": normValue * totalWidth, "height": totalHeight / totalVals - margin }//,"color":color};
      // console.log(country,output)         

        }
            catch (error) {
                console.log(error)
                //console.log(country,"no1");
                output= { "x": 160, "y": 300, "width": 0, "height": 10 }
            }
        }
        else {
//console.log(val)
output= { x: 160, "y": 300, "width": 0, "height": 0 }
        }

    // }

       

    } else if (indiSelections["viz"] == "Global View") {

        topMargin = 0
        leftMargin = 60

        margin = 2


        var filtered = Object.fromEntries(Object.entries(indicatorDataYear).filter(([k, v]) => typeof v == "number"))

        countryOrder = countryListLongitude


        rank = countryOrder.indexOf(sidsDict[country])

        //        sortedData = sort_object(filtered);

        indicatorValues = Object.values(filtered)

        totalVals = countryOrder.length

        columnBase = { "y": totalHeight * 0.85, "x": 650 / totalVals * (rank) + leftMargin, "width": totalWidth / totalVals - margin, "height": 0 }

        if (typeof val != "number" || rank == -1) {
            output= columnBase;
        }

        else {

            try {

                //console.log(totalVals)



                maxx = Math.max(...indicatorValues)
                minn = 0//Math.min(...indicatorValues)
                normValue = (val - minn) / (maxx - minn)

                //console.log(country,normValue,rank,minn)
                if (indiSelections["page"] == "countryDataTab") {
                    //console.log(val, typeof val)

                    output= { "y": totalHeight * 0.85 - normValue * totalHeight / 2.5, "x": 650 / totalVals * (rank) + leftMargin, "width": totalWidth / totalVals - margin, "height": normValue * totalHeight / 2.5 }//,"color":color};
                    if(output['y']> totalHeight * 0.85){output['y']= totalHeight * 0.85}//so that they don't emerge from the bottom on next animation
                }
                // else if (indiSelections["page"] == "mviTab") {
                //     output= columnBase
                // }
            }
            catch (error) {
                //console.log(error)
                //console.log(country,"no1");
                output= columnBase
            }
        }

    }
    else if (indiSelections["viz"] == "Choropleth") {
        output= { "x": cx, "y": cy, "width": 0, "height": 5 }
    }
    else if (indiSelections["viz"] == "Multi-indicator" || indiSelections["viz"] == "Spider") {
        VTr = vizTransform(country, bBox, indicatorData,indiSelections)
        output= {
            "x": totalWidth * (cx + VTr["x"]) * VTr["scale"] / 620,
            "y": totalHeight * (cy + VTr["y"]) * VTr["scale"] / 500, "width": 0, "height": 5
        }
    }
    else if (indiSelections["viz"]=="Time Series"){
        output= { x: 160, "y": 300, "width": 0, "height": 0 }
    }
    if(output['width']<0){output['width']=0}
    if(output['height']<0){output['height']=0}

    return output

}

function isNumeric(el) {
    return !isNaN(parseFloat(el)) && isFinite(el);
   // return n === +n && n !== (n|0);
}

function textTransform(country, bBox, textBBox,indicatorData, indiSelections) {
    textX = bBox[4]
    textY = bBox[2] - 11;
    totalHeight = 500

    indicatorDataYear=indicatorData["data"][indiSelections["year"]]
    totalVals=0
    for(cou in indicatorDataYear){
        if (typeof(indicatorDataYear[cou])=="number"){
            totalVals+=1
        }
    }

    if (indiSelections["viz"] == "Choropleth") {

        return "scale(1,1) translate(0,0)";
    }

    else if (indiSelections["viz"]=="Bar Chart"){
        RTo =  rectTransform(country, bBox, indicatorData,indiSelections)
       // console.log(RTo,totalVals,textY)
        output= "scale(1,1) translate("+(-textX + 140 - textBBox.width / 2)+ "," + (-textY + RTo["y"] + totalHeight / totalVals / 2) + ")"
   
        return output
    }

    else if (indiSelections["viz"] == "Global View") {
        //console.log(country)
        try {
            //VT = vizTransform(country, bBox, indicatorData,indiSelections);
            return "scale(1,1) translate(" + (-textX + mapLocations[country]["titleX"]) + "," + (-textY + mapLocations[country]["titleY"] - 110) + ")";
        }
        catch (error) {
            //shouldn't have any of these happening?
            //return "translate(" + (-textX) + "," + (-textY) + ")";
            console.log(country)
            return ""//scale(0.001,0.001)"
            
        }

    }

    else if (indiSelections["viz"] == "Spider") {

        // mviRank = chosenCountryListMVI.indexOf(country)
        // if (mviRank == -1) {
        //     scale = 1//0.001;
        // } else {
        //     scale = 1;
        // }
        // x = 300 * Math.sin(mviRank / 34 * 2 * 3.14) - textX + 370
        // y = -280 * Math.cos(mviRank / 34 * 2 * 3.14) - textY + 250


        scale=1
        x=0
        y=0

        return "scale(" + scale + "," + scale + ") translate(" + x + "," + y + ")";

    }

    else if (indiSelections["viz"]=="Time Series"){
        return ""//scale(1,1) translate(0,0)";
    }
    // else if (indiSelections["viz"] == "Multi-indicator") {
    //     val = indicatorData[country]
    //     val2 = indicatorData2[country]
    //     if (typeof val == "number" && typeof val2 == "number") {
    //         max = 1
    //         min = 0
    //         scale = .37;

    //         //remove values with no data
    //         indicatorValues = Object.values(indicatorData).filter(function (el) {
    //             return !isNaN(parseFloat(el)) && isFinite(el);
    //         });
    //         maxx = Math.max(...indicatorValues)
    //         minn = Math.min(...indicatorValues)
    //         normValue = (val - minn) / (maxx - minn)

    //         //remove values with no data
    //         indicatorValues2 = Object.values(indicatorData2).filter(function (el) {
    //             return !isNaN(parseFloat(el)) && isFinite(el);
    //         });
    //         maxx2 = Math.max(...indicatorValues2)
    //         minn2 = Math.min(...indicatorValues2)
    //         normValue2 = (val2 - minn2) / (maxx2 - minn2)

    //         //scale(" + scale + "," + scale + ")
    //         x = -textX + (normValue * 1970 + 213) * scale
    //         y = 1200 * scale - textY - (normValue2 * 1240) * scale

    //         return "scale(1,1) translate(" + x + "," + y + ")";

    //     } else {
    //         return "scale(0.001,0.001)"//translate(" + (-textX) + "," + (-textY) + ")";
    //     }
    // }

}

function labelTransform(country, bBox, indicatorData,indiSelections) {
    RTl = rectTransform(country, bBox, indicatorData,indiSelections)
    txt = indicatorData[country]
    return ({ x: RTl.width, y: RTl.y + RTl.height / 2 + 4 })

}


function vizTransform(country, bBox, indicatorData,indiSelections) {
    //console.log(country, bBox, indiSelections["viz"], indicatorData, indicatorData2)
    cx = bBox[4]
    cy = bBox[5]

    if (indiSelections["viz"] == "Choropleth") {
        scale = 1
        x = 0
        y = 0
    }

    else if (indiSelections["viz"] == "Bar Chart") {

        rect = rectTransform(country, bBox, indicatorData,indiSelections)
        scale = 0.01
        x = (rect.width / 2 + 160) / scale - cx
        y = (rect.y + 2) / scale - cy

        //return "scale(" + scale + ")translate(" + (-cx) + "," + (-cy + normValue * 1200) + ")";
    }

    else if (indiSelections["viz"] == "Global View") {
        try {
            valX = mapLocations[country]["countryX"] * 2;
            valY = mapLocations[country]["countryY"] * 2;
            if (mapLocations[country]["countryWidth"] == "no") {
                scale = 0.1;
            }
            else {
                scale = mapLocations[country]["countryWidth"] / bBox[1] * 2
            }
        }
        catch (error) {
            // console.log(error)
            valX = 0;
            valY = 0;
            scale = 0.3
        }

        //idk why 1.41

        x = -cx + valX / scale / 1.41
        y = -cy + valY / scale / 1.41 - 154 / scale
        scale = scale / 1.41
    }


    else if (indiSelections["viz"] == "Spider") {

        // mviRank = chosenCountryListMVI.indexOf(country)

        // if (mviRank == -1) {
        //     scale = 0
        // }
        // else {
        //     scale = .54;
        // }
        // x = 460 * Math.sin(mviRank / 34 * 2 * 3.14) - cx + 690
        // y = -460 * Math.cos(mviRank / 34 * 2 * 3.14) - cy + 450


        //temp
        x=0
        y=0
        scale=.8

    }
    else if (indiSelections["viz"]=="Time Series"){
        
        scale=.01  
        x=(1-scale)*cx/scale
        y=(1-scale)*cy/scale
  }
    // else if (indiSelections["viz"] == "Multi-indicator") {

    //     val = indicatorData[country]
    //     val2 = indicatorData2[country]

    //     if (typeof val == "number" && typeof val2 == "number") {
    //         max = 1
    //         min = 0
    //         scale = .37;

    //         //remove values with no data
    //         indicatorValues = Object.values(indicatorData).filter(function (el) {
    //             return !isNaN(parseFloat(el)) && isFinite(el);
    //         });
    //         maxx = Math.max(...indicatorValues)
    //         minn = Math.min(...indicatorValues)
    //         normValue = (val - minn) / (maxx - minn)

    //         //remove values with no data
    //         indicatorValues2 = Object.values(indicatorData2).filter(function (el) {
    //             return !isNaN(parseFloat(el)) && isFinite(el);
    //         });
    //         maxx2 = Math.max(...indicatorValues2)
    //         minn2 = Math.min(...indicatorValues2)
    //         normValue2 = (val2 - minn2) / (maxx2 - minn2)


    //         x = -cx + normValue * 1970 + 78 / scale
    //         y = 1200 - cy - normValue2 * 1240 + 65
    //     }

    //     else {
    //         scale = 0
    //         x = -cx
    //         y = -cy
    //     }

    // }

    return { "x": x, "y": y, "scale": scale }
}

// function lineTransform(country, bBox, textBBox, indiSelections["viz"], indicatorData) {

//     // cx = bBox.x + bBox.width / 2;
//     // cy = bBox.y + bBox.height / 2;

//     if (indiSelections["viz"] == "Choropleth") {
//         x1 = bBox[4];
//         x2 = bBox[4];
//         y1 = bBox[2] - 11;
//         y2 = bBox[2] - 11;//[5]
//     }

//     else if (indiSelections["viz"] == "Global View") {
//         try {
//             line = mapLocations[country]["line"]
//             x1 = mapLocations[country]["countryX"] * 1.4;
//             y1 = mapLocations[country]["countryY"] * 1.4;
//             if (line == "no") { }
//             else if (line == "left") {
//                 x1 += - textBBox.width / 2;
//                 y1 += - 4;
//             }
//             else if (line == "b-left") {
//                 x1 += - textBBox.width / 3;
//             }
//             else if (line == "right") {
//                 x1 += textBBox.width / 2;
//                 y1 += - 4;
//             }
//             else if (line == "b-right") {
//                 x1 += + textBBox.width / 3;
//             }
//             else if (line == "t-right") {
//                 x1 += textBBox.width / 3;
//                 y1 += - 8;
//             }
//             else if (line == "t-left") {
//                 x1 += - textBBox.width / 3;
//                 y1 += - 8;
//             }
//             else if (line == "top") {
//                 x1 += 0;
//                 y1 += - 8;
//             }
//             else {
//                 x1 += 400;
//             }

//             x2 = mapLocations[country]["countryX"] * 1.4;
//             y2 = mapLocations[country]["countryY"] * 1.4;
//             //idk why this is 1.3
//         }
//         catch (error) {
//             x1 = 0;
//             y1 = 0;
//             x2 = 0;
//             y2 = 0;
//         }
//     }

//     else if (indiSelections["viz"] == "Bar Chart") {
//         try {
//             val = indicatorData[country]

//             max = 1
//             min = 0
//             scale = .5;

//             //remove values with no data
//             indicatorValues = Object.values(indicatorData).filter(function (el) {
//                 return !isNaN(parseFloat(el)) && isFinite(el);
//             });

//             maxx = Math.max(...indicatorValues)
//             minn = 0//Math.min(...indicatorValues)
//             normValue = (val - minn) / (maxx - minn)

//             x2 = 0;
//             y2 = normValue * 600;
//             y1 = normValue * 600;
//             x1 = 30;
//         } catch (error) {
//             x2 = 0;
//             y2 = 0;
//             x1 = 10;
//             y1 = 10;
//         }
//     }
//     else {
//         x1 = 0;
//         x2 = 0;
//         y1 = 0;
//         y2 = 0;
//     }

//     return { "x1": x1, "x2": x2, "y1": y1, "y2": y2 };
// }



////////////////////////////////////
/////  Helper functions
////////////////////////////////////

function sort_object(obj) {
    // console.log(obj)
    items = Object.keys(obj).map(function (key) {
        return [key, obj[key]];
    });
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    sorted_obj = {}
    $.each(items, function (k, v) {
        use_key = v[0]
        use_value = k;//v[1]
        sorted_obj[use_key] = use_value
    })
    return (sorted_obj)

}

function getBoundingBox(selection) {
    /* get x,y co-ordinates of top-left of bounding box and width and height */
    var element = selection.node(),
        bbox = element.getBBox();
    cx = bbox.x + bbox.width / 2;
    cy = bbox.y + bbox.height / 2;
    return [bbox.x, bbox.width, bbox.y, bbox.height, cx, cy];
}

function countryClicked(d, country) {
    $(".mdl-tabs__tab").removeClass("selectedPage")
    $("#countryViewTab").addClass("selectedPage")
    $("#countryViewTab h5").click()
}

function regionColors(region, member) {
    region = region.toLowerCase()
    if (member == "N") { return "black" }

    else if (region == "caribbean") { return "c008080"; }
    else if (region == "pacific") { return "cF0A500"; }
    else if (region == "ais") { return "c97002B"; }
    else { return "black" }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

///////////////////////
//Tooltips
////////////////////////

function initChoroTooltips() {
    const countryMaps = $("#allSids path, .regionTitle")

    countryMaps.each(function (index) {
        //console.log(countryJson[countryMaps[index].id].Country)
        // try {

        

        if (countryMaps[index].id.includes("RegionTitle")) {

            region = countryMaps[index].id.replace("RegionTitle", "")
            regionTitles = { "ais": "AIS", "pacific": "Pacific", "caribbean": "Caribbean" }
            tooltipTitle = regionTitles[region] + " Region"
            population = 0
            for (countryIndex in regionCountries[region]) {
                //console.log(regionCountries[region][countryIndex])
                population += countryJson[regionCountries[region][countryIndex]].Population
            }
            regionColor = regionColor = regionColors(region, "Y").substring(1)
            content = "Population: " + nFormatter(population, 3)
        }
        else {
            tooltipTitle = countryJson[countryMaps[index].id].Country;
            secondLine = countryJson[countryMaps[index].id].Region + " region";
            thirdLine = "Population: " + countryJson[countryMaps[index].id].Population.toString();
            regionColor = regionColors(countryJson[countryMaps[index].id].Region, "Y").substring(1)
            content = secondLine.toString() + '</h6><h6>' + thirdLine.toString()
        }

        $('#choroTooltips').append('<div class="choroTooltip tooltips" id="tooltipChoro' + (index).toString() +
            '" role="tooltip"><h4 style="color:#' + regionColor + '">' + tooltipTitle + '</h4><h6 id="tooltipStat">'
            + content + '</h6></div>')

        //<div class="arrow" data-popper-arrow></div>

        // console.log(index+": yo");
    });

    const choroTooltips = $(".choroTooltip")

    choroPopperInstance = new Array();

    for (i = 0; i < countryMaps.length; i++) {
        choroPopperInstance[i] = Popper.createPopper(countryMaps[i], choroTooltips[i],
            {
                placement: 'top',
                modifiers: [
                    {
                        name: 'offset',
                        options: {
                            offset: [0, 8],
                        },
                    },],
            });
    }

    function hide() {
        //map to all
        for (j = 0; j < countryMaps.length; j++) {
            choroTooltips[j].removeAttribute('data-show');
        }
    }
    const showEvents = ['mouseenter', 'focus'];
    const hideEvents = ['mouseleave', 'blur'];



    showEvents.forEach(event => {
        for (j = 0; j < countryMaps.length; j++) {
            // console.log(j,countryMaps[j])
            if (countryMaps[j].id.includes("RegionTitle")) {
                tooltippedDiv = countryMaps[j]
            } else {
                tooltippedDiv = countryMaps[j].parentNode
            }

            tooltippedDiv.addEventListener(event, hovered.bind(null, j));


        }
    });

    function hovered(j) {
        // console.log("i",j)
        choroTooltips[j].setAttribute('data-show', '');
        choroPopperInstance[j].update();
    }

    hideEvents.forEach(event => {
        //map to all?
        for (j = 0; j < countryMaps.length; j++) {
            //    console.log("i",j)
            if (countryMaps[j].id.includes("RegionTitle")) {
                tooltippedDiv = countryMaps[j]
            } else {
                tooltippedDiv = countryMaps[j].parentNode
            }

            tooltippedDiv.addEventListener(event, hide);
        }

    });

}

function filterObject(obj, arr) {
    newObj = {}
    Object.keys(obj).forEach((key) => {
        if (arr.includes(key)) {
            newObj[key] = obj[key];
        };
    });
    return newObj;
}


function updateChoroTooltips(indicatorData,indiSelections) {

    const countryMaps = $("#allSids path, .regionTitle")
    regionAverages = {}
    regionRank = {}
indicatorDataYear=indicatorData["data"][indiSelections["year"]]

    if (indiSelections["page"] == "countryDataTab") {

        indiMax = Math.max(...Object.values(indicatorDataYear).filter(val => typeof (val) == 'number'))
        countryMaps.each(function (index) {
            if (countryMaps[index].id.includes("RegionTitle")) {
                region = countryMaps[index].id.replace("RegionTitle", "")
                regionTitles = { "ais": "AIS", "pacific": "Pacific", "caribbean": "Caribbean" }
                regionLists = { "ais": regionCountries["ais"], "pacific": regionCountries["pacific"], "caribbean": regionCountries["caribbean"] }
                tooltipTitle = regionTitles[region] + " Region"
                total = 0

                for (countryIndex in regionLists[region]) {

                    val = indicatorDataYear[regionLists[region][countryIndex]]
                    if (typeof val == 'number') {
                        total += val
                    }
                }
                regionColor = regionColor = regionColors(region, "Y").substring(1)

                regionValuesLength = (Object.values(filterObject(indicatorDataYear, regionLists[region])).filter(val => typeof (val) == 'number').length)
                if (regionValuesLength == 0) { regionValuesLength = 1 }
                regionVal = total / regionValuesLength
                regionRank[region] = 1
                allVals = Object.values(indicatorDataYear).filter(val => typeof (val) == 'number')
                for (val in allVals) {
                    //console.log(allVals[val],regionVal)
                    if (allVals[val] > regionVal) {
                        regionRank[region]++
                    }
                }
                // console.log(regionValuesLength)
                content = "Average: " + nFormatter(regionVal, 3)
                regionAverages[region] = regionVal
            }
            else {
                iso=countryMaps[index].id
                country=sidsDict[iso]
                    tooltipTitle = country
                try {
                    secondLine = "Value: " + indicatorDataYear[iso].toFixed(2)
                }
                catch (error) { secondLine = "No Data" }
                if(indiSelections["year"]="recentValue"){
                    year=indicatorData["data"]["recentYear"][iso]
                }
                else{year=indiSelections["year"]}
                thirdLine = "Year: " + year
                content = secondLine + "</h6><h6>" + thirdLine
                regionColor = regionColors(countryJson[iso].Region, "Y").substring(1)
            }
            $('#tooltipChoro' + (index).toString()).html('<h4 style="color:#' + regionColor + '">' + tooltipTitle + '</h4><h6>' + content + '</h6></div>')//<div class="arrow" data-popper-arrow></div>
            // console.log(index+": yo");

        });

    }
    // else if (indiSelections["page"] = "mviTab") {

    //     indiMax = 1
    //     regionTitles = { "ais": "AIS", "pacific": "Pacific", "caribbean": "Caribbean" }
    //     countryMaps.each(function (index) {
    //         if (countryMaps[index].id.includes("RegionTitle")) {
    //             region = countryMaps[index].id.replace("RegionTitle", "")

    //             tooltipTitle = regionTitles[region] + " Region"
    //             population = 0
    //             for (countryIndex in regionCountries[region]) {
    //               //  console.log(region, countryIndex)
    //                 population += countryJson[regionCountries[region][countryIndex]].Population
    //             }
    //             regionColor = regionColor = regionColors(region, "Y").substring(1)
    //             content = "Population: " + nFormatter(population, 3)
    //             regionAverages[region] = population
    //         }
    //         else {
    //             try {
    //                 tooltipTitle = countryJson[countryMaps[index].id].Country
    //             }
    //             catch { tooltipTitle = countryMaps[index].id }
    //             // console.log(tooltipTitle)
    //             // console.log(wdiFull[indicator]["year"])
    //          //   console.log("yaaaaaah")
    //             try {
    //                 MBC = getMviValue(tooltipTitle,indiSelections)
    //                 secondLine = "MVI Value: " +nFormatter(MBC["value"],2)
                   
    //               //  console.log(mviData)//+ getMVIData//-----get MVI value//wdiFull[indicator]["data"][tooltipTitle].toFixed(2)
    //             }
    //             catch (error) { secondLine = "No Data" }
    //             thirdLine = "Year: " + 2018 /// <-- replace with year variable when refactored
    //             regionColor = regionColors(countryJson[countryMaps[index].id].Region, "Y").substring(1)

    //             $('#tooltipChoro' + (index).toString()).html('<h4 style="color:#' + regionColor + '">' + tooltipTitle + '</h4><h6>' + secondLine + '</h6><h6>' + thirdLine + '</h6></div>')//<div class="arrow" data-popper-arrow></div>
    //             // console.log(index+": yo");
    //         }
    //     });

    // }
  

    //console.log(regionAverages, indiMax, regionRank, allVals.length)

    if (indiSelections["viz"] == "Choropleth"||indiSelections["viz"] == "Time Series") {
        regionTitleVals = { "opacity": 1, "pacificX": 775, "pacificY": 460, "caribbeanX": 760, "caribbeanY": 130, "aisX": 785, "aisY": 335 }
    } else if (indiSelections["viz"] == "Bar Chart" || indiSelections["viz"] == "Multi-indicator") {
        if (indiSelections["sortby"] == "Rank") {
            regionTitleVals = { "opacity": 1, "pacificX": 775, "pacificY": 330, "caribbeanX": 760, "caribbeanY": 170, "aisX": 785, "aisY": 250 }
            regionTitleHeight = 400
            // if(indiSelections["page"]=="mviTab"){
            //     countryListLength=34
            //     regionTitleVals = { "opacity": 1, "pacificX": 775, "pacificY": 330, "caribbeanX": 760, "caribbeanY": 170, "aisX": 785, "aisY": 250 }
            // }
            // else if(indiSelections["page"]=="countryDataTab"){
                countryListLength=allVals.length
                if(countryListLength>0){
                regionTitleVals = { "opacity": 1, "pacificX": 715, "pacificY": regionTitleHeight * (regionRank["pacific"] / countryListLength) + 60, "caribbeanX": 700, "caribbeanY": regionTitleHeight * (regionRank["caribbean"] / countryListLength) + 60, "aisX": 725, "aisY": regionTitleHeight * (regionRank["ais"] / countryListLength) + 60 }
            }else{
                regionTitleVals = { "opacity": 1, "pacificX": 715, "pacificY": 450, "caribbeanX": 700, "caribbeanY": 110, "aisX": 725, "aisY": 300 }
            }
            // }
  
        } else if (indiSelections["sortby"] == "Region") {
            regionTitleVals = { "opacity": 1, "pacificX": 715, "pacificY": 450, "caribbeanX": 700, "caribbeanY": 110, "aisX": 725, "aisY": 300 }
        }

    } else if (indiSelections["viz"] == "Global View") {
        regionTitleVals = { "opacity": 1, "pacificX": 675, "pacificY": 70, "caribbeanX": 30, "caribbeanY": 115, "aisX": 370, "aisY": 85 }
    } else if (indiSelections["viz"] == "Spider") {

        if (indiSelections["sortby"] == "Rank") {
            regionTitleVals = { "opacity": 1, "pacificX": 775, "pacificY": 330, "caribbeanX": 760, "caribbeanY": 170, "aisX": 785, "aisY": 250 }
        }
        else {
            regionTitleVals = { "opacity": 1, "pacificX": 20, "pacificY": 100, "caribbeanX": 670, "caribbeanY": 90, "aisX": 530, "aisY": 530 }
        }
    }

// console.log( regionTitleHeight, regionRank["pacific"], countryListLength) 
    d3.select("#pacificRegionTitle").transition().duration(1000).attr("x", regionTitleVals["pacificX"]).attr("y", regionTitleVals["pacificY"]).attr("fill-opacity",regionTitleVals["opacity"]);
    d3.select("#caribbeanRegionTitle").transition().duration(1000).attr("x", regionTitleVals["caribbeanX"]).attr("y", regionTitleVals["caribbeanY"]).attr("fill-opacity",regionTitleVals["opacity"]);
    d3.select("#aisRegionTitle").transition().duration(1000).attr("x", regionTitleVals["aisX"]).attr("y", regionTitleVals["aisY"]).attr("fill-opacity",regionTitleVals["opacity"]);



}

// function customSelectChange() {
//     ///I'm sure there is a better way to do this than having this function
//     $("#customLi").trigger("click")
// }









  


function zoomed(dat, country) {
    //console.log("zooming")

    /* Thanks to http://complextosimple.blogspot.ie/2012/10/zoom-and-center-with-d3.html 	*/
    /* for a simple explanation of transform scale and translation  			*/
    /* This function centers the county's bounding box in the map container		*/
    /* The scale is set to the minimum value that enables the county to fit in the	*/
    /* container, horizontally or vertically, up to a maximum value of 3.			*/
    /* If the full width of container is not required, the county is horizontally centred */
    /* Likewise, if the full height of the container is not required, the county is	*/
    /* vertically centred.								*/

    // var xy = getBoundingBox(d);	/* get top left co-ordinates and width and height 	*/




    // // if (d.classed("countryActive")) {	/* if county is active reset map scale and county colour */

    // ///open country profile page to that country

    // main_chart_svg.selectAll("#viewport")
    //   .transition().duration(750).attr("transform", "scale(" + defaultScale + ")");
    // lastActive = "";

    // // console.log(country)

    // d.attr("class", function (d) {
    //   return quantize(rateById.get(this.id))
    // });

    setSelectedId(document.getElementById('countryCategory'), "all")
    setSelectedId(document.getElementById('countrySelect'), country)
    $("#countryViewTab").click()

    $(".mdl-tabs__tab").removeClass("selectedPage")
    $("#countryViewTab").addClass("selectedPage")


    console.log("clicked on country ")





    // } else {			/* zoom into new county      */
    //   // console.log("huh")
    //   // resetAll();			/* reset county colors	     */

    //   /* scale is the max number of times bounding box will fit into container, capped at 3 times */
    //   scale = Math.min(mw / xy[1], mh / xy[3], 3);

    //   /* tx and ty are the translations of the x and y co-ordinates */
    //   /* the translation centers the bounding box in the container  */
    //   var tx = -xy[0] + (mw - xy[1] * scale) / (2 * scale);
    //   var ty = -xy[2] + (mh - xy[3] * scale) / (2 * scale);

    //   main_chart_svg.selectAll("#viewport")
    //     .transition().duration(750).attr("transform", "scale(" + scale + ")translate(" + tx + "," + ty + ")");
    //     d.node().classList.add("countryActive");
    //   console.log(d)
    //   lastActiveCountry = d.attr("id");
    // }
}





