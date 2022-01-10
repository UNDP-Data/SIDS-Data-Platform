
var allDataset = [];
for (const key in datasetMeta) {
  if(typeof key !== "undefined" && key !== 'NaN'){
    var object = {
      key:key,
      organization: datasetMeta[key]["Organization"],
      numberOfYears: datasetMeta[key]["Years"],
      link: datasetMeta[key]["Link"],
      sidsCoverage: datasetMeta[key]["SIDS Coverage"],
      datasetName: datasetMeta[key]["Dataset Name"],
      def: datasetMeta[key]["Description"],
      hash: datasetMeta[key]["# of Indicators"],
      priority: datasetMeta[key]["Priority"]
    };
    allDataset.push(object);
  }
}

allDataset.sort(function(a,b){
  return (a.priority > b.priority) ? 1 : ((a.priority < b.priority) ? -1 : (a.datasetName.replace(/^\s+|\s+$/gm,'').toLowerCase() > b.datasetName.replace(/^\s+|\s+$/gm,'').toLowerCase()) ? 1 : ((a.datasetName.replace(/^\s+|\s+$/gm,'').toLowerCase() < b.datasetName.replace(/^\s+|\s+$/gm,'').toLowerCase()) ? -1 : 0));
});

var innerDatasetHTML = ``;
for(var i = 0 ; i < allDataset.length ; i++){
  innerDatasetHTML += `<div class="dataset-option row-flex space-evenly align-items-center" onClick="selectDataset('`+allDataset[i].key+`')" onmouseover="handleDatasetHover(this,'`+allDataset[i].key+`')">
    <div class='dataset-image `+ allDataset[i].key +`Icon'></div>
    <div class="tooltip-outer-dataset">
    <div class="indicator-tooltip-box-dataset col-flex" style="word-wrap: break-word;overflow-wrap: break-word;">
      <div class="indicator-tooltip-dataset">
        <div class="col-flex" style="margin:10px 6px 0 4px;">
          <div class='dataset-image `+ allDataset[i].key +`Icon' style="margin:0 auto;"></div>
          <div style="width:100%; font-weight:700; font-size:14px; margin-top:10px;">` + allDataset[i].datasetName + `</div>
          <div style="width:100%; font-size:12px;">`+ allDataset[i].def +`</div>
          <div style="margin:12px 0 0 0;border-top:1px solid #A6A6A6; padding-top:8px ; font-size:12px;">`+ allDataset[i].hash +` Indicators, ` + allDataset[i].sidsCoverage + ` SIDS</div>
          <div style="margin:8px 0 10px 0;font-size:12px;"><b>Organization:</b> `+ allDataset[i].organization +`<span style="float:right;"><a href='`+ allDataset[i].link +`' target="_blank">Link</a></span></div>
        </div>
      </div>
    </div>
    <div class="side-box-left"></div>
    <div class="side-box-right"></div>
    </div>
  </div>`
}

document.getElementsByClassName('dataset-internal-box')[0].innerHTML = innerDatasetHTML;

var prevData;
function handleDatasetHover(e,curr){
  if(!e.children[1].matches(':hover') && curr!==prevData){
    e.children[1].style.top = (window.event.clientY-180) + "px";
  }
  prevData = curr;
}

function searchIndicator(event){
  var inputvalue = event.value.toLowerCase().replace(/\s/g, '');

  var value = document.getElementsByClassName('values')[0].children;

  for(var i = 0 ; i  < value.length ; i++){
    var currValArray = value[i].children[0].innerHTML.toLowerCase().split(" ");
    var val = 0;

    for(var  j = 0 ; j < currValArray.length ; j++){
      if(currValArray[j].length >= inputvalue.length){
        if(currValArray[j].substr(0,inputvalue.length) === inputvalue){
          val = 1;
          break;
        }
      }
    }

    var currVal = value[i].children[0].innerHTML.toLowerCase().replace(/\s/g, '');
    if(val === 0 && currVal.substr(0,inputvalue.length) !== inputvalue){
      value[i].classList.add('display-none');
    } else {
      value[i].classList.remove('display-none');
    }
  }
}

function updateCategory(dataset){
   var categories = [];

    for (const category in indicatorCategories[dataset.toLowerCase()]) {
      if(category.toLowerCase()!=="none"){
        categories.push(category);
      }
    }

   if(categories.length === 0){
     document.getElementsByClassName('categories')[0].classList.add('display-none');
     document.getElementsByClassName('values')[0].className = "values col-flex maxheight-withoutCat";
     return;
   } else {
     document.getElementsByClassName('categories')[0].classList.remove('display-none');
     document.getElementsByClassName('values')[0].className = "values col-flex";
   }

   var innerHTML = ``;
   innerHTML += `<div class="category-option row-flex align-items-center" onClick="selectCategory('`+ dataset.toUpperCase() +`','All')">
     <div style="margin-left:12%;">All</div>
   </div>`

   for(var i = 0 ; i < categories.length ; i++){
     innerHTML += `<div class="category-option row-flex align-items-center" onClick="selectCategory('`+ dataset.toUpperCase() +`','`+ categories[i] +`')">
       <div style="margin-left:12%;">`+ categories[i] +`</div>
     </div>`
   }

   document.getElementsByClassName('selected-category')[0].innerHTML = '<div style="margin-left:12%;">All Categories</div>';
   document.getElementsByClassName('selected-subcategory')[0].innerHTML = '<div style="margin-left:12%;">Select a sub-category</div>';
   document.getElementsByClassName('category-options')[0].innerHTML = innerHTML;
}

function updateSubCategory(dataset,category){
  var subcategoriesNames = [];

  for (const subcategory in indicatorCategories[dataset.toLowerCase()][category]) {
      if(subcategory.toLowerCase() !== 'none'){
        subcategoriesNames.push(subcategory);
      }
  }

  if(subcategoriesNames.length !== 0){
    document.getElementsByClassName('sub-categories')[0].classList.remove('display-none');
    document.getElementsByClassName('values')[0].className = "values col-flex maxheight-withBoth";
  } else {
    document.getElementsByClassName('sub-categories')[0].classList.add('display-none');
    document.getElementsByClassName('values')[0].className = "values col-flex";
    return;
  }

  var innerHTML = ``;
  innerHTML += `<div class="subcategory-option row-flex align-items-center" onClick="selectSubCategory('`+ dataset +`','`+ category +`','All')">
    <div style="margin-left:12%;">All</div>
  </div>`
  for(var i = 0 ; i < subcategoriesNames.length ; i++){
    innerHTML += `<div class="subcategory-option row-flex align-items-center" onClick="selectSubCategory('`+ dataset +`','`+ category +`','`+ subcategoriesNames[i] +`')">
      <div style="margin-left:12%;">`+ subcategoriesNames[i] +`</div>
    </div>`
  }

  document.getElementsByClassName('selected-subcategory')[0].innerHTML = '<div style="margin-left:12%;">Select a sub-category</div>';
  document.getElementsByClassName('subcategory-options')[0].innerHTML = innerHTML;
}

function selectSubCategory(dataset, category, subcategory){
  document.getElementsByClassName('values')[0].className = "values col-flex maxheight-withBoth";
  document.getElementsByClassName('subcategory-options')[0].classList.add('growUp');
  setTimeout( () => {
    document.getElementsByClassName('subcategory-options')[0].classList.add('display-none');
    document.getElementsByClassName('subcategory-options')[0].classList.remove('growUp');
  },280);
  document.getElementsByClassName('selected-subcategory')[0].innerHTML = `<div style="margin-left:12%;">`+ subcategory +`</div>`

  updateValuesFromSubCategory(dataset, category, subcategory);
  removeDescription();

  console.log({'Sub-Category':subcategory});
}

function selectCategory(dataset, category){
  document.getElementsByClassName('category-options')[0].classList.add('growUp');
  setTimeout( () => {
    document.getElementsByClassName('category-options')[0].classList.add('display-none');
    document.getElementsByClassName('category-options')[0].classList.remove('growUp');
  },280);
  document.getElementsByClassName('selected-category')[0].innerHTML = `<div style="margin-left:12%;">`+ category +`</div>`

  updateSubCategory(dataset, category);
  updateValuesFromCategory(dataset, category);
  removeDescription();

  console.log({'Category':category});
}

function selectDataset(dataset){
  document.getElementsByClassName('menu-box')[0].classList.remove('height-fixed');
  document.getElementsByClassName('dataset-options')[0].classList.add('growUp');
  document.getElementsByClassName('search-dataset-box')[0].classList.add('heightUp');
  document.getElementsByClassName('search-dataset')[0].classList.add('heightUp');
  document.getElementsByClassName('sub-categories')[0].classList.add('display-none');
  document.getElementsByClassName('non-dataset')[0].classList.add('display-none');

  setTimeout( () => {
    document.getElementsByClassName('search-dataset-box')[0].classList.add('display-none');
    document.getElementsByClassName('search-dataset-box')[0].classList.remove('heightUp');
    document.getElementsByClassName('search-dataset')[0].classList.add('display-none');
    document.getElementsByClassName('search-dataset')[0].classList.remove('heightUp');
  },20);

  setTimeout( () => {
    document.getElementsByClassName('selected-dataset')[0].classList.remove('display-none');
  },260);

  setTimeout( () => {
    document.getElementsByClassName('dataset-options')[0].classList.remove('growUp');
    document.getElementsByClassName('dataset-options')[0].classList.add('display-none');
    document.getElementsByClassName('dataset-down-arrow')[0].classList.remove('display-none');
    document.getElementsByClassName('non-dataset')[0].classList.remove('display-none');
  },280);

  document.getElementsByClassName('selected-dataset')[0].innerHTML = `<div class='row-flex space-evnely align-items-center'>
    <div class="dataset-image `+ dataset +`Icon"></div>
  </div>`

  updateCategory(dataset);
  updateValuesFromDataset(dataset);
  removeDescription();

  console.log({'Dataset':dataset});
}

function selectDescriptionDropdown(value,indicatorCode){
  document.getElementsByClassName('descriptionDropdown-options')[0].classList.add('growUp');
  setTimeout( () => {
    document.getElementsByClassName('descriptionDropdown-options')[0].classList.add('display-none');
    document.getElementsByClassName('descriptionDropdown-options')[0].classList.remove('growUp');
  },280);
  document.getElementsByClassName('selected-descriptionDropdown')[0].children[0].innerHTML = value;

  var description = document.getElementsByClassName("indiDescription")[0];
  description.children[0].children[0].innerHTML = indicatorMeta[indicatorCode]["Indicator"];
  description.children[0].children[1].children[0].innerHTML = indicatorMeta[indicatorCode]["Units"];
  description.children[0].children[2].innerHTML = indicatorMeta[indicatorCode]["Definition"];
  description.children[0].children[3].children[1].innerHTML = indicatorMeta[indicatorCode]["Source"];
  description.children[0].children[3].children[2].innerHTML = '<a href="' + indicatorMeta[indicatorCode]["Link"] + '" target="_blank">Link</a>';

  console.log({'IndicatorCode':indicatorCode,'Indicator' : indicatorMeta[indicatorCode]["Indicator"],'Dimension':value});


///this function is poorly built (and generally the way dimension is handled) since the indicatorCode itself is changing.
//so this is just a temp fix
indicatorCode=getCodeByNameAndDim(indicatorMeta[indicatorCode]["Indicator"],value,indicatorMeta[indicatorCode]["Category"],indicatorMeta[indicatorCode]["Subcategory"],indicatorMeta[indicatorCode]["Dataset"])
handleDimensionSelect(indicatorCode);
}

function getCodeByNameAndDim(name,dim,cat,sub,dat){
  for (i in indicatorCategories[dat][cat][sub][name]){
code=indicatorCategories[dat][cat][sub][name][i]
if(indicatorMeta[code]["Dimension"]==dim){
  correctCode= code
}
  }
return correctCode
}


function showDescription(dimensions,index,indicatorCode){
  var allValues = document.getElementsByClassName("value");
  for(var i = 0 ;  i < allValues.length ;i++){
    if(i===index){
      allValues[i].classList.add('background-blue');
    } else {
      allValues[i].classList.remove('background-blue');
    }
  }

  var className = document.getElementsByClassName("values")[0].className;
  if(className.length === 15){
    document.getElementsByClassName("values")[0].className = "values col-flex maxheight-dis";
  } else if(className.length === 34){
    document.getElementsByClassName("values")[0].className = "values col-flex maxheight-dis-withBoth";
  } else if(className.length === 36){
    document.getElementsByClassName("values")[0].className = "values col-flex maxheight-dis-withoutCat";
  }

  document.getElementsByClassName("indiDescription-box")[0].classList.remove('display-none');

  var indicator = indicatorMeta[indicatorCode]["Indicator"];
  var dataset = indicatorMeta[indicatorCode]["Dataset"].toLowerCase();
  var link = indicatorMeta[indicatorCode]["Link"];
  var unit = indicatorMeta[indicatorCode]["Units"];
  var def = indicatorMeta[indicatorCode]["Definition"];
  var source = indicatorMeta[indicatorCode]["Source"];

  var description;
console.log(dimensions)
  if(dimensions.length >= 1){
    var dimensionsArr = dimensions.split("\,");
    //Sorting dimensions according to the Priority.
    dimensionsArr.sort(function(a,b){
      try{
      return indicatorMeta[a]["Priority"] - indicatorMeta[b]["Priority"];}
      catch(error){console.log(error)}
    });
console.log(dimensionsArr)
    var dropdown = ``;

     for(var i = 0 ; i < dimensionsArr.length ; i++){
      console.log(dimensionsArr[i])
        dropdown += `<div class="descriptionDropdown-option row-flex align-items-center" onClick="selectDescriptionDropdown('` + indicatorMeta[dimensionsArr[i]]["Dimension"] + `','` + dimensionsArr[i] + `')">
         <div style="margin-left:10%;margin-right:10px;">` + indicatorMeta[dimensionsArr[i]]["Dimension"] + `</div>
       </div>`
     }

    description = `<div style="width:96%;margin:0 6px 0 4px;word-wrap: break-word;overflow-wrap: break-word;display: inline-block;">
        <div style="width:100%; font-weight:700; font-size:14px; margin-top:6px;">` + indicator + `</div>
        <div class='row-flex space-between align-items-center' style="margin:6px 0;">
          <div style="font-size:12px;  margin:6px 4px 8px 0; max-width:120px">(`+ unit +`)</div>
          <div class="descriptionDropdown col-flex space-between">
            <div class="row-flex align-items-center selected-descriptionDropdown" onClick="toggleOptionMenu('descriptionDropdown')">
              <div style="margin-left:10%;margin-right:14px;">` + indicatorMeta[dimensionsArr[0]]["Dimension"] + `</div>
            </div>

            <div class="descriptionDropdown-options col-flex align-items-center dropdown display-none">
              ` + dropdown + `
            </div>

            <div class="down-arrow-grey" onClick="toggleOptionMenu('descriptionDropdown')"></div>
          </div>
        </div>

        <div style="font-size:12px;">`+ def +`</div>
        <div style="width:100%;margin:12px 0 10px 0;padding-top:8px;border-top:1px solid #A6A6A6;font-size:12px;"><span><b>Source:</b></span> <span>`+ source +`</span><span style="float:right;"><a href='`+link+`' target="_blank">Link</a></span></div>
      </div>`;
  } else {
    description = `<div style="width:96%;margin:0 6px 0 4px;word-wrap: break-word;overflow-wrap: break-word;display: inline-block;">
        <div style="width:100%; font-weight:700; font-size:14px; margin-top:6px;">` + indicator + `</div>
        <div class='row-flex space-between align-items-center' style="margin:6px 0;">
          <div style="font-size:12px;  margin:6px 4px 8px 0;">(`+ unit +`)</div>
          <div></div>
        </div>

        <div style="font-size:12px;">`+ def +`</div>
        <div style="width:100%;margin:12px 0 10px 0;padding-top:8px;border-top:1px solid #A6A6A6;font-size:12px;"><b>Source:</b> `+ source +`<span style="float:right;"><a href='`+link+`' target="_blank">Link</a></span></div>
      </div>`;
  }

  document.getElementsByClassName("indiDescription")[0].innerHTML = description;

  prev=index;
}

function removeDescription(){
  var allValues = document.getElementsByClassName("value");
  for(var i = 0 ;  i < allValues.length ;i++){
    allValues[i].classList.remove('background-blue');
  }
  document.getElementsByClassName("values")[0].classList.remove('maxheight');
  document.getElementsByClassName("indiDescription-box")[0].classList.add('display-none');
}

function deactivateSearch(){
  document.getElementsByClassName('search-dataset')[0].classList.remove('display-none');
  document.getElementsByClassName('search-dataset-box')[0].classList.add('display-none');
  document.getElementsByClassName('menu-content')[0].classList.remove('display-none');
  document.getElementsByClassName('search-values-box')[0].classList.add('display-none');
  document.getElementsByClassName('deactivateSearch')[0].classList.add('display-none');
}

function selectWithinDataset(indicatorCode){
  var category = indicatorMeta[indicatorCode]["Category"];
  var subcategory = indicatorMeta[indicatorCode]["Subcategory"];
  var indicator = indicatorMeta[indicatorCode]["Indicator"];
  var dataset = indicatorMeta[indicatorCode]["Dataset"].toLowerCase();

  document.getElementsByClassName('menu-content')[0].classList.remove('display-none');
  document.getElementsByClassName('search-values-box')[0].classList.add('display-none');
  selectDataset(dataset);

  if(category.toLowerCase() !== 'none'){
    selectCategory(dataset,category);
  }

  if(subcategory.toLowerCase() !== 'none'){
    selectSubCategory(dataset,category,subcategory);
  }
  var val = document.getElementsByClassName('values')[0].children;

  for(var i = 0 ; i < val.length ;i++){
    if(val[i].children[0].innerHTML === indicator){
      val[i].click();
      val[i].scrollIntoView();
      break;
    }
  }

}

function activateSearch(){

  document.getElementsByClassName('search-dataset')[0].classList.add('display-none');
  document.getElementsByClassName('search-dataset-box')[0].classList.remove('display-none');
  document.getElementsByClassName('menu-content')[0].classList.add('display-none');
  document.getElementsByClassName('search-values-box')[0].classList.remove('display-none');

  var included = [];
  var allVal = [];
  for (const key in indicatorMeta) {
    if(indicatorMeta[key]["Dataset"]){
      var category = indicatorMeta[key]["Category"];
      var subcategory = indicatorMeta[key]["Subcategory"];
      var indicator = indicatorMeta[key]["Indicator"];
      var indicatorCode = indicatorMeta[key]["Indicator Code"];
      var dataset = indicatorMeta[key]["Dataset"];
      var source = indicatorMeta[key]["Source"];

      if(!included.includes(indicator)){
        var object = {
          key: key,
          category: category,
          subcategory: subcategory,
          indicator: indicator,
          source: source,
          dataset: dataset,
          indicatorCode: indicatorCode,
        };
        allVal.push(object);
        included.push(indicator);
      }
    }
  }

  allVal.sort(function(a,b){
    return (a.indicator.replace(/^\s+|\s+$/gm,'').toUpperCase() > b.indicator.replace(/^\s+|\s+$/gm,'').toUpperCase()) ? 1 : ((a.indicator.replace(/^\s+|\s+$/gm,'').toUpperCase() < b.indicator.replace(/^\s+|\s+$/gm,'').toUpperCase()) ? -1 : 0);
  });

  var innerHTML = ``;
  for(var i = 0 ; i < allVal.length ; i++){
    var str = '';

    if(allVal[i].source){
      if(allVal[i].source.length <= 40){
        str += allVal[i].source;
      } else {
        str += allVal[i].source.substring(0,40);
        str += '...';
      }
    }


    innerHTML += `<div class="search-value col-flex"  onClick="selectWithinDataset('` + allVal[i].indicatorCode + `')" onmouseover="handleHover(this,`+i+`)">
      <div style="margin-left: 4px; width:100%; font-weight:700; font-size:14px; margin-top:6px;">`+ allVal[i].indicator +`</div>
      <div style="text-align: right; width:100%; font-size:12px; margin:10px 6px 10px 0;">`+ str +`</div>

      <div class="tooltip-outer">
      <div class="indicator-tooltip-box col-flex" style="word-wrap: break-word;overflow-wrap: break-word;">
        <div class="indicator-tooltip">
          <div style="margin:0 6px 0 4px;">
            <div style="width:100%; font-weight:700; font-size:14px; margin-top:6px;">` + allVal[i].indicator + `</div>
            <div style="width:100%; font-size:12px;">`+ allVal[i].def +`</div>
            <div style="margin:12px 0 10px 0;padding-top:8px;border-top:1px solid #A6A6A6; font-size:12px;"><b>Source:</b> `+ allVal[i].source +`<span style="float:right;"><a href='`+allVal[i].link+`' target="_blank">Link</a></span></div>
          </div>
        </div>
      </div>
      <div class="side-box-left"></div>
      <div class="side-box-right"></div>
      </div>

    </div>`
  }

  document.getElementsByClassName('search-values')[0].innerHTML = innerHTML;
}

function handleDatasetSearch(event){
  var inputvalue = event.value.toLowerCase().replace(/\s/g, '');

  var value = document.getElementsByClassName('search-values')[0].children;

  for(var i = 0 ; i  < value.length ; i++){
    var currValArray = value[i].children[0].innerHTML.toLowerCase().split(" ");
    var currVal = value[i].children[0].innerHTML.toLowerCase().replace(/\s/g, '');

    var val = 0;

    for(var  j = 0 ; j < currValArray.length ; j++){
      if(currValArray[j].length >= inputvalue.length){
        if(currValArray[j].substr(0,inputvalue.length) === inputvalue){
          val = 1;
          break;
        }
      }
    }

    if(val === 0 && currVal.substr(0,inputvalue.length) !== inputvalue){
      value[i].classList.add('display-none');
    } else {
      value[i].classList.remove('display-none');
    }
  }
}

var prev;
function handleHover(e,curr){
  if(!e.children[2].matches(':hover') && curr!==prev){
    e.children[2].style.top = (window.event.clientY-180) + "px";
  }
  prev = curr;
}

function updateValuesFromDataset(dataset){

  var included = [];
  var allVal = [];
  for (const key in indicatorMeta) {


    if(indicatorMeta[key]["Dataset"] && indicatorMeta[key]["Dataset"].toUpperCase() === dataset.toUpperCase()){
      var category = indicatorMeta[key]["Category"];
      var subcategory = indicatorMeta[key]["Subcategory"];
      var indicator = indicatorMeta[key]["Indicator"];

      if(typeof indicatorCategories[dataset.toLowerCase()] === "undefined" || typeof indicatorCategories[dataset.toLowerCase()][category] === "undefined" || typeof indicatorCategories[dataset.toLowerCase()][category][subcategory] === "undefined"){
        console.log("Not Found in Indicator Categories file");
      } else if(indicatorCategories[dataset.toLowerCase()][category][subcategory][indicator].length > 1){
        if(!included.includes(indicator)){
          var object = {
            key: key,
            category: indicatorMeta[key]["Category"],
            subcategory: indicatorMeta[key]["Subcategory"],
            indicator: indicatorMeta[key]["Indicator"],
            link: indicatorMeta[key]["Link"],
            def: indicatorMeta[key]["Definition"],
            source: indicatorMeta[key]["Source"],
            dimension: 1,
            priority: indicatorMeta[key]["Priority"],
            dimensionString: indicatorCategories[dataset.toLowerCase()][category][subcategory][indicator].toString()
          };
          allVal.push(object);
          included.push(indicator);

        }
      } else {
        var object = {
          key: key,
          category: indicatorMeta[key]["Category"],
          subcategory: indicatorMeta[key]["Subcategory"],
          indicator: indicatorMeta[key]["Indicator"],
          link: indicatorMeta[key]["Link"],
          def: indicatorMeta[key]["Definition"],
          source: indicatorMeta[key]["Source"],
          dimension: 0,
          priority: indicatorMeta[key]["Priority"]
        };
        allVal.push(object);
      }

    }
  }

  allVal.sort(function(a,b){
    return (a.priority > b.priority) ? 1 : ((a.priority < b.priority) ? -1 : (a.indicator.replace(/^\s+|\s+$/gm,'').toLowerCase() > b.indicator.replace(/^\s+|\s+$/gm,'').toLowerCase()) ? 1 : ((a.indicator.replace(/^\s+|\s+$/gm,'').toLowerCase() < b.indicator.replace(/^\s+|\s+$/gm,'').toLowerCase()) ? -1 : 0));
  });

  var innerHTML = ``;

  for(var i = 0 ; i < allVal.length ; i++){
    if(allVal[i].dimension === 1){
      var str = '';
      if(allVal[i].source){
        if(allVal[i].source.length <= 40){
          str += allVal[i].source;
        } else {
          str += allVal[i].source.substring(0,40);
          str += '...';
        }
      }

      innerHTML += `<div class="value col-flex"  onClick="handleIndicatorSelect('` + allVal[i].dimensionString + `',`+ i +`,'` + allVal[i].key + `')" onmouseover="handleHover(this,`+i+`)">
        <div style="margin-left: 4px; width:100%; font-weight:700; font-size:14px; margin-top:6px;">`+ allVal[i].indicator +`</div>
        <div style="text-align: right; width:100%; font-size:12px; margin:10px 6px 10px 0;">`+ str +`</div>

        <div class="tooltip-outer">
        <div class="indicator-tooltip-box col-flex" style="word-wrap: break-word;overflow-wrap: break-word;">
          <div class="indicator-tooltip">
            <div style="margin:0 6px 0 4px;">
              <div style="width:100%; font-weight:700; font-size:14px; margin-top:6px;">` + allVal[i].indicator + `</div>
              <div style="width:100%; font-size:12px;">`+ allVal[i].def +`</div>
              <div style="margin:12px 0 10px 0;padding-top:8px;border-top:1px solid #A6A6A6; font-size:12px;"><b>Source:</b> `+ allVal[i].source +`<span style="float:right;"><a href='`+allVal[i].link+`' target="_blank">Link</a></span></div>
            </div>
          </div>
        </div>
        <div class="side-box-left"></div>
        <div class="side-box-right"></div>
        </div>
      </div>`
    } else {
      var str = '';
      if(allVal[i].source){
        if(allVal[i].source.length <= 40){
          str += allVal[i].source;
        } else {
          str += allVal[i].source.substring(0,40);
          str += '...';
        }
      }
      innerHTML += `<div class="value col-flex"  onClick="handleIndicatorSelect('',`+ i +`, '` + allVal[i].key + `')" onmouseover="handleHover(this,`+i+`)">
        <div style="margin-left: 4px; width:100%; font-weight:700; font-size:14px; margin-top:6px;">`+ allVal[i].indicator +`</div>
        <div style="text-align: right; width:100%; font-size:12px; margin:10px 6px 10px 0;">`+ str +`</div>

        <div class="tooltip-outer">
        <div class="indicator-tooltip-box col-flex" style="word-wrap: break-word;overflow-wrap: break-word;">
          <div class="indicator-tooltip">
            <div style="margin:0 6px 0 4px;">
              <div style="width:100%; font-weight:700; font-size:14px; margin-top:6px;">` + allVal[i].indicator + `</div>
              <div style="width:100%; font-size:12px;">`+ allVal[i].def +`</div>
              <div style="margin:12px 0 10px 0;padding-top:8px;border-top:1px solid #A6A6A6; font-size:12px;"><b>Source:</b> `+ allVal[i].source +`<span style="float:right;"><a href='`+allVal[i].link+`' target="_blank">Link</a></span></div>
            </div>
          </div>
        </div>
        <div class="side-box-left"></div>
        <div class="side-box-right"></div>
        </div>

      </div>`
    }
  }

  document.getElementsByClassName('values')[0].innerHTML = innerHTML;
}

function updateValuesFromCategory(dataset, category){
  if(category === 'All'){
    updateValuesFromDataset(dataset);
  } else {
    var included = [];
    var allVal = [];
    for (const key in indicatorMeta) {
      if(indicatorMeta[key]["Dataset"] && indicatorMeta[key]["Category"] && indicatorMeta[key]["Dataset"].toLowerCase() === dataset.toLowerCase() && indicatorMeta[key]["Category"].toLowerCase() === category.toLowerCase()){

        var category = indicatorMeta[key]["Category"];
        var subcategory = indicatorMeta[key]["Subcategory"];
        var indicator = indicatorMeta[key]["Indicator"];

        if(typeof indicatorCategories[dataset.toLowerCase()] === "undefined" || typeof indicatorCategories[dataset.toLowerCase()][category] === "undefined" || typeof indicatorCategories[dataset.toLowerCase()][category][subcategory] === "undefined"){
          console.log("Not Found in Indicator Categories file");
        } else if(indicatorCategories[dataset.toLowerCase()][category][subcategory][indicator].length > 1){
          if(!included.includes(indicator)){
            var object = {
              key: key,
              category: indicatorMeta[key]["Category"],
              subcategory: indicatorMeta[key]["Subcategory"],
              indicator: indicatorMeta[key]["Indicator"],
              link: indicatorMeta[key]["Link"],
              def: indicatorMeta[key]["Definition"],
              source: indicatorMeta[key]["Source"],
              dimension: 1,
              priority: indicatorMeta[key]["Priority"],
              dimensionString: indicatorCategories[dataset.toLowerCase()][category][subcategory][indicator].toString()
            };
            allVal.push(object);
            included.push(indicator);

          }
        } else {
          var object = {
            key: key,
            category: indicatorMeta[key]["Category"],
            subcategory: indicatorMeta[key]["Subcategory"],
            indicator: indicatorMeta[key]["Indicator"],
            link: indicatorMeta[key]["Link"],
            def: indicatorMeta[key]["Definition"],
            source: indicatorMeta[key]["Source"],
            priority: indicatorMeta[key]["Priority"],
            dimension: 0
          };
          allVal.push(object);
        }

      }
    }

    allVal.sort(function(a,b){
      return (a.priority > b.priority) ? 1 : ((a.priority < b.priority) ? -1 : (a.indicator.replace(/^\s+|\s+$/gm,'').toLowerCase() > b.indicator.replace(/^\s+|\s+$/gm,'').toLowerCase()) ? 1 : ((a.indicator.replace(/^\s+|\s+$/gm,'').toLowerCase() < b.indicator.replace(/^\s+|\s+$/gm,'').toLowerCase()) ? -1 : 0));
    });

    var innerHTML = ``;

    for(var i = 0 ; i < allVal.length ; i++){
      if(allVal[i].dimension === 1){
        var str = '';
        if(allVal[i].source){
          if(allVal[i].source.length <= 40){
            str += allVal[i].source;
          } else {
            str += allVal[i].source.substring(0,40);
            str += '...';
          }
        }

        innerHTML += `<div class="value col-flex"  onClick="handleIndicatorSelect('` + allVal[i].dimensionString + `',`+ i +`,'` + allVal[i].key + `')" onmouseover="handleHover(this,`+i+`)">
          <div style="margin-left: 4px; width:100%; font-weight:700; font-size:14px; margin-top:6px;">`+ allVal[i].indicator +`</div>
          <div style="text-align: right; width:100%; font-size:12px; margin:10px 6px 10px 0;">`+ str +`</div>
          <div class="tooltip-outer">
          <div class="indicator-tooltip-box col-flex" style="word-wrap: break-word;overflow-wrap: break-word;">
            <div class="indicator-tooltip">
              <div style="margin:0 6px 0 4px;">
                <div style="width:100%; font-weight:700; font-size:14px; margin-top:6px;">` + allVal[i].indicator + `</div>
                <div style="width:100%; font-size:12px;">`+ allVal[i].def +`</div>
                <div style="margin:12px 0 10px 0;padding-top:8px;border-top:1px solid #A6A6A6; font-size:12px;"><b>Source:</b> `+ allVal[i].source +`<span style="float:right;"><a href='`+allVal[i].link+`' target="_blank">Link</a></span></div>
              </div>
            </div>
          </div>
          <div class="side-box-left"></div>
          <div class="side-box-right"></div>
          </div>
        </div>`
      } else {
        var str = '';
        if(allVal[i].source){
          if(allVal[i].source.length <= 40){
            str += allVal[i].source;
          } else {
            str += allVal[i].source.substring(0,40);
            str += '...';
          }
        }
        innerHTML += `<div class="value col-flex"  onClick="handleIndicatorSelect('',`+ i +`, '` + allVal[i].key + `')" onmouseover="handleHover(this,`+i+`)">
          <div style="margin-left: 4px; width:100%; font-weight:700; font-size:14px; margin-top:6px;">`+ allVal[i].indicator +`</div>
          <div style="text-align: right; width:100%; font-size:12px; margin:10px 6px 10px 0;">`+ str +`</div>

          <div class="tooltip-outer">
          <div class="indicator-tooltip-box col-flex" style="word-wrap: break-word;overflow-wrap: break-word;">
            <div class="indicator-tooltip">
              <div style="margin:0 6px 0 4px;">
                <div style="width:100%; font-weight:700; font-size:14px; margin-top:6px;">` + allVal[i].indicator + `</div>
                <div style="width:100%; font-size:12px;">`+ allVal[i].def +`</div>
                <div style="margin:12px 0 10px 0;padding-top:8px;border-top:1px solid #A6A6A6; font-size:12px;"><b>Source:</b> `+ allVal[i].source +`<span style="float:right;"><a href='`+allVal[i].link+`' target="_blank">Link</a></span></div>
              </div>
            </div>
          </div>
          <div class="side-box-left"></div>
          <div class="side-box-right"></div>
          </div>

        </div>`
      }
    }

    document.getElementsByClassName('values')[0].innerHTML = innerHTML;
  }
}

function updateValuesFromSubCategory(dataset, category, subcategory){
  if(subcategory === 'All'){
    updateValuesFromCategory(dataset,category);
  } else {
    var included = [];
    var allVal = [];
    for (const key in indicatorMeta) {
      if(indicatorMeta[key]["Dataset"] && indicatorMeta[key]["Category"] && indicatorMeta[key]["Subcategory"] && indicatorMeta[key]["Dataset"].toLowerCase() === dataset.toLowerCase() && indicatorMeta[key]["Category"] === category && indicatorMeta[key]["Subcategory"] === subcategory){

        var category = indicatorMeta[key]["Category"];
        var subcategory = indicatorMeta[key]["Subcategory"];
        var indicator = indicatorMeta[key]["Indicator"];

        if(typeof indicatorCategories[dataset.toLowerCase()] === "undefined" || typeof indicatorCategories[dataset.toLowerCase()][category] === "undefined" || typeof indicatorCategories[dataset.toLowerCase()][category][subcategory] === "undefined"){
          console.log("Not Found in Indicator Categories file");
        } else if(indicatorCategories[dataset.toLowerCase()][category][subcategory][indicator].length > 1){
          if(!included.includes(indicator)){
            var object = {
              key: key,
              category: indicatorMeta[key]["Category"],
              subcategory: indicatorMeta[key]["Subcategory"],
              indicator: indicatorMeta[key]["Indicator"],
              link: indicatorMeta[key]["Link"],
              def: indicatorMeta[key]["Definition"],
              source: indicatorMeta[key]["Source"],
              priority: indicatorMeta[key]["Priority"],
              dimension: 1,
              dimensionString: indicatorCategories[dataset.toLowerCase()][category][subcategory][indicator].toString()
            };
            allVal.push(object);
            included.push(indicator);

          }
        } else {
          var object = {
            key: key,
            category: indicatorMeta[key]["Category"],
            subcategory: indicatorMeta[key]["Subcategory"],
            indicator: indicatorMeta[key]["Indicator"],
            link: indicatorMeta[key]["Link"],
            def: indicatorMeta[key]["Definition"],
            source: indicatorMeta[key]["Source"],
            priority: indicatorMeta[key]["Priority"],
            dimension: 0
          };
          allVal.push(object);
        }

      }
    }

    allVal.sort(function(a,b){
      return (a.priority > b.priority) ? 1 : ((a.priority < b.priority) ? -1 : (a.indicator.replace(/^\s+|\s+$/gm,'').toLowerCase() > b.indicator.replace(/^\s+|\s+$/gm,'').toLowerCase()) ? 1 : ((a.indicator.replace(/^\s+|\s+$/gm,'').toLowerCase() < b.indicator.replace(/^\s+|\s+$/gm,'').toLowerCase()) ? -1 : 0));
    });

    var innerHTML = ``;

    for(var i = 0 ; i < allVal.length ; i++){
      if(allVal[i].dimension === 1){
        var str = '';
        if(allVal[i].source){
          if(allVal[i].source.length <= 40){
            str += allVal[i].source;
          } else {
            str += allVal[i].source.substring(0,40);
            str += '...';
          }
        }

        innerHTML += `<div class="value col-flex"  onClick="handleIndicatorSelect('` + allVal[i].dimensionString + `',`+ i +`,'` + allVal[i].key + `')" onmouseover="handleHover(this,`+i+`)">
          <div style="margin-left: 4px; width:100%; font-weight:700; font-size:14px; margin-top:6px;">`+ allVal[i].indicator +`</div>
          <div style="text-align: right; width:100%; font-size:12px; margin:10px 6px 10px 0;">`+ str +`</div>

          <div class="tooltip-outer">
          <div class="indicator-tooltip-box col-flex" style="word-wrap: break-word;overflow-wrap: break-word;">
            <div class="indicator-tooltip">
              <div style="margin:0 6px 0 4px;">
                <div style="width:100%; font-weight:700; font-size:14px; margin-top:6px;">` + allVal[i].indicator + `</div>
                <div style="width:100%; font-size:12px;">`+ allVal[i].def +`</div>
                <div style="margin:12px 0 10px 0;padding-top:8px;border-top:1px solid #A6A6A6; font-size:12px;"><b>Source:</b> `+ allVal[i].source +`<span style="float:right;"><a href='`+allVal[i].link+`' target="_blank">Link</a></span></div>
              </div>
            </div>
          </div>
          <div class="side-box-left"></div>
          <div class="side-box-right"></div>
          </div>

        </div>`
      } else {
        var str = '';
        if(allVal[i].source){
          if(allVal[i].source.length <= 40){
            str += allVal[i].source;
          } else {
            str += allVal[i].source.substring(0,40);
            str += '...';
          }
        }
        innerHTML += `<div class="value col-flex"  onClick="handleIndicatorSelect('',`+ i +`, '` + allVal[i].key + `')" onmouseover="handleHover(this,`+i+`)">
          <div style="margin-left: 4px; width:100%; font-weight:700; font-size:14px; margin-top:6px;">`+ allVal[i].indicator +`</div>
          <div style="text-align: right; width:100%; font-size:12px; margin:10px 6px 10px 0;">`+ str +`</div>

          <div class="tooltip-outer">
          <div class="indicator-tooltip-box col-flex" style="word-wrap: break-word;overflow-wrap: break-word;">
            <div class="indicator-tooltip">
              <div style="margin:0 6px 0 4px;">
                <div style="width:100%; font-weight:700; font-size:14px; margin-top:6px;">` + allVal[i].indicator + `</div>
                <div style="width:100%; font-size:12px;">`+ allVal[i].def +`</div>
                <div style="margin:12px 0 10px 0;padding-top:8px;border-top:1px solid #A6A6A6; font-size:12px;"><b>Source:</b> `+ allVal[i].source +`<span style="float:right;"><a href='`+allVal[i].link+`' target="_blank">Link</a></span></div>
              </div>
            </div>
          </div>
          <div class="side-box-left"></div>
          <div class="side-box-right"></div>
          </div>

        </div>`
      }
    }

    document.getElementsByClassName('values')[0].innerHTML = innerHTML;
  }
}

function toggleOptionMenu(val){
  var menu = document.getElementsByClassName(val+"-options")[0];

  if(menu.classList.contains('display-none')){
    var dropdown = document.getElementsByClassName('dropdown');
    for(var i = 0 ; i < dropdown.length ;i++){
      dropdown[i].classList.add('display-none');
    }
    menu.classList.remove('display-none');
    if(val === 'dataset'){
      document.getElementsByClassName('search-dataset')[0].classList.add('heightDown');
      document.getElementsByClassName('search-dataset')[0].classList.remove('display-none');
      document.getElementsByClassName('selected-dataset')[0].classList.add('display-none');
      document.getElementsByClassName('non-dataset')[0].classList.add('display-none');
      setTimeout( () => {
        document.getElementsByClassName('search-dataset')[0].classList.remove('heightDown');
      },310);
      document.getElementsByClassName('menu-box')[0].classList.add('height-fixed');
    }
  } else {
    menu.classList.add('growUp');
    setTimeout( () => {
      var dropdown = document.getElementsByClassName('dropdown');
      for(var i = 0 ; i < dropdown.length ;i++){
        dropdown[i].classList.add('display-none');
      }
      menu.classList.remove('growUp');
    },280);
  }
}

window.addEventListener('click', function(e){
  if (document.getElementById('indicatorSelectMenu').contains(e.target)){
    console.log("indicatorClick")// Clicked in box

  } else{
    onClick="deactivateSearch()"
    // Clicked outside the box
  }
});
