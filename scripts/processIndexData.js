function getIndexValues(indexData, indexCode, indiSelections) {
  indexWeights=preprocessIndexWeights(indexCode)
 
  indexYears=getIndexDataYears(indexData,indiSelections)
 console.log(indexYears)

  minMaxObj=getMinMaxObj(indexData, indexWeights,indexCode,indexYears)
 console.log(minMaxObj)
 
  allValues=computeSubindexValues(indexData,indexWeights,indexCode,indexYears,minMaxObj)
 console.log(allValues)
 
  allValues["index"] = { data: computeIndexValues(allValues,indexWeights,indexYears) };
  console.log(allValues)
  return allValues;
}

function preprocessIndexWeights(indexCode){
  console.log(indexWeightsDict)

  indexWeights = JSON.parse(JSON.stringify(indexWeightsDict[indexCode]));//deep copy

  if (indexCode == "mvi-index-index") {
    selectedIndis = getCustomIndicatorSelection();
    for (subindexCode in indexWeights["subindices"]) {
      subindexWeight=0
      for (subsubindexCode in indexWeights["subindices"][subindexCode]["subsubindices"]) {

        if (!selectedIndis.includes(subsubindexCode)) {
          delete  indexWeights["subindices"][subindexCode]["subsubindices"][subsubindexCode];
        } else {
         // indexWeights[subindexCode]["subindices"][subsubindexCode] = 1;
          subindexWeight=1
        }
      }
      indexWeights["subindices"][subindexCode]["weight"]=subindexWeight
    }
  }



weightTotalObj={}
indexWeightTotal=0
    for (subindexCode in indexWeights["subindices"]) {
      subindexWeightTotal=0
      for (subsubindexCode in indexWeights["subindices"][subindexCode]["subsubindices"]) {
        subindexWeightTotal+=indexWeights["subindices"][subindexCode]["subsubindices"][subsubindexCode]
      }
      indexWeightTotal+=indexWeights["subindices"][subindexCode]["weight"]
      weightTotalObj[subindexCode]=subindexWeightTotal
    }
    weightTotalObj["index"]=indexWeightTotal


console.log(indexWeights)

    for (subindexCode in indexWeights["subindices"]) {
      for (subsubindexCode in indexWeights["subindices"][subindexCode]["subsubindices"]) {
if(weightTotalObj[subindexCode]!=0){
        indexWeights["subindices"][subindexCode]["subsubindices"][subsubindexCode]=indexWeights["subindices"][subindexCode]["subsubindices"][subsubindexCode]/weightTotalObj[subindexCode]
        }
        else{indexWeights["subindices"][subindexCode]["subsubindices"][subsubindexCode]=0}
      }
      if(weightTotalObj["index"]!=0){
      indexWeights["subindices"][subindexCode]["weight"]=indexWeights["subindices"][subindexCode]["weight"]/weightTotalObj["index"]
      }else{ indexWeights["subindices"][subindexCode]["weight"]=0}
      
    }


  return indexWeights;
}

function getIndexDataYears(indexData,indiSelections){
  if (indiSelections["viz"] == "Time Series") {
    indexYears = Object.keys(indexData[Object.keys(indexData)[0]]["data"]);
  } else {
    indexYears = [indiSelections["year"]];
  }
  return indexYears;
}

function getMinMaxObj(indexData, indexWeights,indexCode,indexYears){
console.log(indexData)
console.log(indexCode)
  minMaxObj={}
  subsubindexList=[]
  for(subindexCode in indexWeights["subindices"]){
  
    for(subsubindexCode in indexWeights["subindices"][subindexCode]["subsubindices"]){
      minn=9999999
      maxx=-9999999

      indexYears=["recentValue"]//temp, so it always uses this for the minMaxObj, for convenience
      for(i in indexYears){      

year=indexYears[i]
        let arr = Object.values(indexData[subsubindexCode]["data"][year]).filter((item) => isNumeric(item));

        min = Math.min(...arr);
        max = Math.max(...arr);

        if(min<minn){
         
          minn=min}
        if(max>maxx){maxx=max}
      }
    
    minMax={"maxx":maxx,"minn":minn}
    minMaxObj[subsubindexCode]=minMax
    }
  }
  return minMaxObj
}

function computeSubindexValues(indexData,indexWeights,indexCode,indexYears,minMaxObj){
  //filter and transform
  //normalize

  allValues = {};
  for (subindexCode in indexWeights["subindices"]) {
    subindexValues = {};
    subindexWeight=indexWeights["subindices"][subindexCode]["weight"]
    for (i in indexYears) {
      yearValues = {};
      year = indexYears[i];
      noData = [];

      for (country in sidsDict) {
        subindexValue = 0;
        for (subsubindexCode in indexWeights["subindices"][subindexCode]["subsubindices"]) {
          subsubindexWeight =indexWeights["subindices"][subindexCode]["subsubindices"][subsubindexCode]*100


          if (Object.keys(indexData[subsubindexCode]["data"]).includes(year)) {
            subsubindexValue = indexData[subsubindexCode]["data"][year][country];

            if (isNaN(subsubindexValue)||subsubindexValue==0) {
              if (!noData.includes(country)) {
                noData.push(country);
              }
            } else {
              if(indexWeights["normalization"]==true){
              normValue=normalizeIndex(subsubindexValue,minMaxObj[subsubindexCode]["minn"],minMaxObj[subsubindexCode]["maxx"])
              }else{normValue=subsubindexValue}
                subindexValue += normValue * subsubindexWeight;
            }
          }
          else{
            if (!noData.includes(country)) {
              noData.push(country);
            }
          }
        }
        if (!noData.includes(country)) {
          yearValues[country] = subindexValue*subindexWeight; //this is dangerous since will have some subindices but not necessarily all
        }
      }
console.log(year,noData)
        // if(Object.keys(yearValues).length>0){
      subindexValues[year] = yearValues;
      //  }
    }
    allValues[subindexCode] = { data: subindexValues };
  }
  return allValues;
}

function computeIndexValues(allValues,indexWeights,indexYears){
  console.log(allValues)
  indexValues = {};
  for (i in indexYears) {
    yearValues = {};
    year = indexYears[i];
    noData = [];
    for (country in sidsDict) {
      indexValue = 0;
      for (subindexCode in indexWeights["subindices"]) {
        if (Object.keys(allValues[subindexCode]["data"]).includes(year)) {
          subindexValue = allValues[subindexCode]["data"][year][country];
          if(isNumeric(subindexValue)){
          indexValue += subindexValue;
          }
          else{
            if (!noData.includes(country)) {
              noData.push(country);
             
            }
          }

        }
      }

      if (!noData.includes(country)) {
        yearValues[country] = indexValue;
      }
    }
    indexValues[year] = yearValues;
  }
  return indexValues;
}

function getCustomIndicatorSelection() {
  const checkboxes = document.querySelectorAll(
    'input[name="mviIndicator"]:checked'
  );
  selectedIndis = [];
  checkboxes.forEach((el) => {
    selectedIndis.push(el.id);
  });
  return selectedIndis;
}

function processSpiderData(
  indexData,
  indexWeights,
  indiSelections,
  orderedCountryList
) {
  subindexList=Object.keys(indexWeights["subindices"])
  spiderData = [];
  for (i = 0; i < subindexList.length; i++) {
      spiderAxes = [];
      for(countryIndex in orderedCountryList){
        country=orderedCountryList[countryIndex]
        newCountryData = {};
      newCountryData["axis"] = country;
      val=0
      for(j=subindexList.length-1;j>=i;j=j-1){
    val += indexData[subindexList[j]]["data"]["recentValue"][country];
      }
     newCountryData["value"] =val 
     spiderAxes.push(newCountryData);
    }
    spiderData.push({ name: subindexList[i], axes: spiderAxes });
  }

  return spiderData;
}

function drawIndexSpider(spiderData, indexWeights) {
  subindexList=Object.keys(indexWeights["subindices"])
  var margin = { top: 85, right: 45, bottom: 0, left: 0 },
    width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
    height = Math.min(
      width,
      window.innerHeight - margin.top - margin.bottom - 20
    );


  var radarChartOptionsCustom = {
    w: 500,
    h: 420,
    margin: margin,
    maxValue: 0,
    levels: 6,
    spin: 0,
    roundStrokes: false,
    color: d3.scale
      .ordinal()
      .range(["#0DB14B", "#f0db3a", "#CC333F", "#00A0B0", "#FFFFFF"]), //,
    //				legend: { title: 'Organization XYZ', translateX: 120, translateY: 140 },
  };

  //spiderData = processSpiderData(

  svg_radar_5 = RadarChart(
    "#indexSpider",
    radarChartOptionsCustom,
    subindexList,
    "customIndex",
    { customIndex: spiderData }
  );
}

function getIndexCountryList(indiSelections, indexWeights,indexData) {
  subindexList=Object.keys(indexWeights["subindices"])
  // selectedIndis = getCustomIndicatorSelection();
  selectedSortby = indiSelections["sortby"];
  if (selectedSortby == "Region") {
    chosenCountryList = countryListSpider.filter(item => Object.keys(indexData["index"]["data"]["recentValue"]).includes(item))
  } else if (selectedSortby == "Rank") {

    mviValues=  indexData["index"]["data"]["recentValue"]
    sortedMviData = sort_object(mviValues);
    sortedCountryList = Object.keys(sortedMviData);

    //this filter removes any empty elements
    chosenCountryList = sortedCountryList.filter((item) => item); //mviCountryList for regional, fixed value
  }
  return chosenCountryList;
}
