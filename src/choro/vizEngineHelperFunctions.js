import {sidsDict} from './vizEngineGlobals'

export function isNumeric(el) {
    return !isNaN(parseFloat(el)) && isFinite(el);
   // return n === +n && n !== (n|0);
}

export function sort_object(obj) {
    let items = Object.keys(obj).map(function (key) {
        return [key, obj[key]];
    });
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    let sorted_obj = {}
    items.map(function(value, index) {
        var use_key = value[0];
        let use_value = index;//v[1]
        sorted_obj[use_key] = use_value;
    });

    return (sorted_obj)

}

export function getBoundingBox(selection) {
    /* get x,y co-ordinates of top-left of bounding box and width and height */
    let element = selection.node(),
        bbox = element.getBBox(),
    cx = bbox.x + bbox.width / 2,
    cy = bbox.y + bbox.height / 2;
    return [bbox.x, bbox.width, bbox.y, bbox.height, cx, cy];
}
//
// function countryClicked(d, country) {
//     $(".mdl-tabs__tab").removeClass("selectedPage")
//     $("#countryViewTab").addClass("selectedPage")
//     $("#countryViewTab h5").click()
// }

export function regionColors(region, member) {
    region = region.toLowerCase()
    if (member == "N") { return "black" }

    else if (region == "caribbean") { return "c008080"; }
    else if (region == "pacific") { return "cF0A500"; }
    else if (region == "ais") { return "c97002B"; }
    else { return "black" }
}
//
export  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export function filterObject(obj, arr) {
    let newObj = {}
    Object.keys(obj).forEach((key) => {
        if (arr.includes(key)) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
}

export function getIsoByName(countryName) {
  return Object.keys(sidsDict).find(key => sidsDict[key] === countryName);
}
export function nFormatter(num, digits=3) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "k" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "B" }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }

  if (digits>2 || num<0.01){
    return (num / si[i].value).toPrecision(digits).replace(rx, "$1") + si[i].symbol;

  }
  else{//this fixes error if digits=2 where it says 3.2e2 B for example
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;//"jab"//(str(num) +  si[i].symbol);
  }
}

export function normalizeIndex(val,min,max){
    let normValue;
    if(max>min){
      normValue=(val-min)/(max-min)
    }
    else{
        normValue=0
    }
    return normValue
}
