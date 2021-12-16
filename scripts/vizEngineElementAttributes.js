///////////////////////
//////Data Processing function
//////////////////////////////////////

function processVizElementAttributes(indicatorData, indiSelections) {
  vizElementAttributes = {};

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
  indicatorDataObj = indicatorData["data"][indiSelections["year"]];
  //console.log(textBBoxDict)
  for (country in bboxDict) {
    //rename to iso since the svg uses the old codes
    bBox = bboxDict[country];
    textBBox = textBBoxDict[country];

    RTa = rectTransform(country, bBox, indicatorDataObj, indiSelections);
    //MRTa = multiRectTransform(country, bBox, indicatorDataObj, indiSelections);
    VTa = vizTransform(country, bBox, indicatorDataObj, indiSelections);
    LTa = labelTransform(country, bBox, indicatorDataObj, indiSelections);
    CTa = circleTransform(country, bBox, indicatorDataObj, indiSelections);
    TTa = textTransform(
      country,
      bBox,
      textBBox,
      indicatorDataObj,
      indiSelections
    );

    vizElementAttributes[country] = {
      VT: VTa,
      RT: RTa,
      LT: LTa,
      CT: CTa,
            //MRT: MRTa,
      TT: TTa

    };
  }

  return vizElementAttributes;
}

/////////////////////////
////Transform functions
////////////////////////////////

function circleTransform(country, bBox, indicatorDataObj, indiSelections) {
  val = indicatorDataObj[country];
  //val2 = indicatorData2[country]

  VT = vizTransform(country, bBox, indicatorDataObj, indiSelections);

  if (indiSelections["viz"] == "Choropleth") {
    return { x: bBox[4], y: bBox[5], r: 0 };
  } else if (indiSelections["viz"] == "Global View") {
    //  console.log(VT,bBox,country)
    if (mapLocations[country]["countryWidth"] == "no") {
      r = 2;
    } else {
      r = 0;
    }
    return {
      x: (VT["x"] + bBox[4]) * VT["scale"],
      y: (VT["y"] + bBox[5]) * VT["scale"],
      r: r,
    };
  } else if (indiSelections["viz"] == "Bar Chart") {
    return { x: 0, y: 0, r: 0 };
  } else if (indiSelections["viz"] == "Multi-indicator") {
    //the 2.7 must come from the scale factor on the choropleth?
    return { x: (VT["x"] + bBox[4]) / 2.7, y: (VT["y"] + bBox[5]) / 2.7, r: 0 };
  } else if (indiSelections["viz"] == "Spider") {
    //the 2.7 must come from the scale factor on the choropleth?
    return {
      x: (VT["x"] + bBox[4]) / 1.85,
      y: (VT["y"] + bBox[5]) / 1.85,
      r: 0,
    };
  } else if (indiSelections["viz"] == "Time Series") {
    return { x: bBox[4], y: bBox[5], r: 0 };
  }
  //&& typeof val == "number"){
}

function rectTransform(country, bBox, indicatorDataObj, indiSelections) {
  // console.log(indicatorData)
  indicatorDataObj = indicatorData["data"][indiSelections["year"]];
  val = indicatorDataObj[country];
  totalHeight = 500;
  totalWidth = 440;
  cx = bBox[4];
  cy = bBox[5];

  if (indiSelections["viz"] == "Bar Chart") {
    //if on mvi page, width should be zero but other vars can be same as bar chart

    // if (indiSelections["page"] == "mviTab") {
    //     // return { "x": 160, "y": totalHeight / totalVals * (rank) + topMargin, "width": 0, "height": totalHeight / totalVals - margin }//,"color":color};
    //     output= mviBarChart(country, "Bar Chart", getMVIData(), getChosenCountryListMVI(), 1)

    // }

    // else {

    if (isNumeric(val)) {
      try {
        var filtered = Object.fromEntries(
          Object.entries(indicatorDataObj).filter(([k, v]) => isNumeric(v))
        ); // == "number"))

        sortedData = sort_object(filtered);
        indicatorValues = Object.values(filtered);
        //           console.log(sortedData)

        if (indiSelections["sortby"] == "Rank") {
          //this filter removes any empty elements
          rank = sortedData[country];
          totalVals = indicatorValues.length;
        } else if (indiSelections["sortby"] == "Region") {
          countryOrder = Object.keys(sortedData);
          pacificListSort = countryOrder.filter((item) =>
            regionCountries["pacific"].includes(item)
          );
          aisListSort = countryOrder.filter((item) =>
            regionCountries["ais"].includes(item)
          );
          caribbeanListSort = countryOrder.filter((item) =>
            regionCountries["caribbean"].includes(item)
          );
          chosenCountryList = caribbeanListSort.concat(
            ["", ""],
            aisListSort,
            ["", ""],
            pacificListSort
          );
          rank = chosenCountryList.indexOf(country);
          //console.log(rank)
          if (rank == -1) {
            console.log(country, val);
          }
          totalVals = indicatorValues.length + 4;
        }

        topMargin = 0;
        margin = 4;

        maxx = Math.max(...indicatorValues);
        minn = 0; //Math.min(...indicatorValues)
        normValue = (val - minn) / (maxx - minn);

        //console.log(country,normValue,rank,minn)
        //console.log(totalHeight,totalVals,rank)

        output = {
          x: 160,
          y: (totalHeight / totalVals) * rank + topMargin,
          width: normValue * totalWidth,
          height: totalHeight / totalVals - margin,
        }; //,"color":color};
        // console.log(country,output)
      } catch (error) {
        console.log(error);
        //console.log(country,"no1");
        output = { x: 160, y: 300, width: 0, height: 10 };
      }
    } else {
      //console.log(val)
      output = { x: 160, y: 300, width: 0, height: 0 };
    }

    // }
  } else if (indiSelections["viz"] == "Global View") {
    topMargin = 0;
    leftMargin = 60;

    margin = 2;

    var filtered = Object.fromEntries(
      Object.entries(indicatorDataObj).filter(([k, v]) => typeof v == "number")
    );

    countryOrder = countryListLongitude;

    rank = countryOrder.indexOf(sidsDict[country]);

    //        sortedData = sort_object(filtered);

    indicatorValues = Object.values(filtered);

    totalVals = countryOrder.length;

    columnBase = {
      y: totalHeight * 0.85,
      x: (650 / totalVals) * rank + leftMargin,
      width: totalWidth / totalVals - margin,
      height: 0,
    };

    if (typeof val != "number" || rank == -1) {
      output = columnBase;
    } else {
      try {
        //console.log(totalVals)

        maxx = Math.max(...indicatorValues);
        minn = 0; //Math.min(...indicatorValues)
        normValue = (val - minn) / (maxx - minn);

        //console.log(country,normValue,rank,minn)

          //console.log(val, typeof val)

          output = {
            y: totalHeight * 0.85 - (normValue * totalHeight) / 2.5,
            x: (650 / totalVals) * rank + leftMargin,
            width: totalWidth / totalVals - margin,
            height: (normValue * totalHeight) / 2.5,
          }; //,"color":color};
          if (output["y"] > totalHeight * 0.85) {
            output["y"] = totalHeight * 0.85;
          } //so that they don't emerge from the bottom on next animation
        
        // else if (indiSelections["page"] == "mviTab") {
        //     output= columnBase
        // }
      } catch (error) {
        //console.log(error)
        //console.log(country,"no1");
        output = columnBase;
      }
    }
  } else if (indiSelections["viz"] == "Choropleth") {
    output = { x: cx, y: cy, width: 0, height: 5 };
  } else if (
    indiSelections["viz"] == "Multi-indicator" ||
    indiSelections["viz"] == "Spider"
  ) {
    VTr = vizTransform(country, bBox, indicatorDataObj, indiSelections);
    output = {
      x: (totalWidth * (cx + VTr["x"]) * VTr["scale"]) / 620,
      y: (totalHeight * (cy + VTr["y"]) * VTr["scale"]) / 500,
      width: 0,
      height: 5,
    };
  } else if (indiSelections["viz"] == "Time Series") {
    output = { x: 160, y: 300, width: 0, height: 0 };
  }
  if (output["width"] < 0) {
    output["width"] = 0;
  }
  if (output["height"] < 0) {
    output["height"] = 0;
  }

  return output;
}

function textTransform(
  country,
  bBox,
  textBBox,
  indicatorDataObj,
  indiSelections
) {
  textX = bBox[4];
  textY = bBox[2] - 11;
  totalHeight = 500;
  totalVals = 0;
  for (cou in indicatorDataObj) {
    if (typeof indicatorDataObj[cou] == "number") {
      totalVals += 1;
    }
  }

  if (indiSelections["viz"] == "Choropleth") {
    return "scale(1,1) translate(0,0)";
  } else if (indiSelections["viz"] == "Bar Chart") {
    RTo = rectTransform(country, bBox, indicatorDataObj, indiSelections);
    // console.log(RTo,totalVals,textY)
    output =
      "scale(1,1) translate(" +
      (-textX + 140 - textBBox.width / 2) +
      "," +
      (-textY + RTo["y"] + totalHeight / totalVals / 2) +
      ")";

    return output;
  } else if (indiSelections["viz"] == "Global View") {
    //console.log(country)
    try {
      //VT = vizTransform(country, bBox, indicatorData,indiSelections);
      return (
        "scale(1,1) translate(" +
        (-textX + mapLocations[country]["titleX"]) +
        "," +
        (-textY + mapLocations[country]["titleY"] - 110) +
        ")"
      );
    } catch (error) {
      //shouldn't have any of these happening?
      //return "translate(" + (-textX) + "," + (-textY) + ")";
      console.log(country);
      return ""; //scale(0.001,0.001)"
    }
  } else if (indiSelections["viz"] == "Spider") {
    mviRank = indiSelections["countryOrder"].indexOf(country)
    if (mviRank == -1) {
        scale = 1//0.001;
    } else {
        scale = 1;
    }
    x = 300 * Math.sin(mviRank / 34 * 2 * 3.14) - textX + 370
    y = -280 * Math.cos(mviRank / 34 * 2 * 3.14) - textY + 250

    // scale = 1;
    // x = 0;
    // y = 0;

    return "scale(" + scale + "," + scale + ") translate(" + x + "," + y + ")";
  } else if (indiSelections["viz"] == "Time Series") {
    return ""; //scale(1,1) translate(0,0)";
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

function labelTransform(country, bBox, indicatorDataObj, indiSelections) {
  RTl = rectTransform(country, bBox, indicatorDataObj, indiSelections);
  //txt = indicatorData[country]
  return { x: RTl.width, y: RTl.y + RTl.height / 2 + 4 };
}

function vizTransform(country, bBox, indicatorDataObj, indiSelections) {
  //console.log(country, bBox, indiSelections["viz"], indicatorData, indicatorData2)
  cx = bBox[4];
  cy = bBox[5];

  if (indiSelections["viz"] == "Choropleth") {
    scale = 1;
    x = 0;
    y = 0;
  } else if (indiSelections["viz"] == "Bar Chart") {
    rect = rectTransform(country, bBox, indicatorDataObj, indiSelections);
    scale = 0.01;
    x = (rect.width / 2 + 160) / scale - cx;
    y = (rect.y + 2) / scale - cy;

    //return "scale(" + scale + ")translate(" + (-cx) + "," + (-cy + normValue * 1200) + ")";
  } else if (indiSelections["viz"] == "Global View") {
    try {
      valX = mapLocations[country]["countryX"] * 2;
      valY = mapLocations[country]["countryY"] * 2;
      if (mapLocations[country]["countryWidth"] == "no") {
        scale = 0.1;
      } else {
        scale = (mapLocations[country]["countryWidth"] / bBox[1]) * 2;
      }
    } catch (error) {
      // console.log(error)
      valX = 0;
      valY = 0;
      scale = 0.3;
    }

    //idk why 1.41

    x = -cx + valX / scale / 1.41;
    y = -cy + valY / scale / 1.41 - 154 / scale;
    scale = scale / 1.41;
  } else if (indiSelections["viz"] == "Spider") {
      orderedCountryList=indiSelections["countryOrder"]
    mviRank = orderedCountryList.indexOf(country)

    if (mviRank == -1) {
        scale = 0
    }
    else {
        scale = .54;
    }
    x = 460 * Math.sin(mviRank / 34 * 2 * 3.14) - cx + 690
    y = -460 * Math.cos(mviRank / 34 * 2 * 3.14) - cy + 450

    // //temp
    // x = 0;
    // y = 0;
    // scale = 0.8;
  } else if (indiSelections["viz"] == "Time Series") {
    scale = 0.01;
    x = ((1 - scale) * cx) / scale;
    y = ((1 - scale) * cy) / scale;
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

  return { x: x, y: y, scale: scale };
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

///////////////////////
//Tooltips
////////////////////////




