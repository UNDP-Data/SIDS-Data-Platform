import { featureCollection } from "@turf/helpers";
import dissolve from "@turf/dissolve";

export function onDataClick(e, map) {
  if (this.options.bivarateMode) {
    return;
  }
  let cls = this.options.currentLayerState;
  if (map === this.map2) {
    cls = this.options.comparisonLayerState;
  }

  if (this.getSource("highlightS", map)) {
    this.removeLayer("highlight", map);
    this.removeSource("highlightS", map);
  }

  if (this.getSource("clickedone", map)) {
    this.removeLayer("clickedone", map);
    this.removeSource("clickedone", map);
  }

  var currId = e.features[0].properties.hexid;

  var feats = map.queryRenderedFeatures({
    layers: [cls.hexSize],
    filter: ["==", "hexid", currId],
  });

  var fc = featureCollection(feats);

  var dis = dissolve(fc);

  map.addSource("clickedone", {
    type: "geojson",
    data: dis,
  });

  map.addLayer({
    id: "clickedone",
    source: "clickedone",
    type: "line",
    paint: {
      "line-color": "purple",
      "line-width": 3,
    },
  });
  this.emit('selectionUpdate', {
    value: e.features[0].properties[cls.dataLayer]
  })
}

export function onAdminClick(e, adminLayerId, map) {
  let cls = this.options.currentLayerState;

  var rendered = map.queryRenderedFeatures({
    layers: [adminLayerId],
  });

  let feats,
  eventObject = {};

  if (cls.hexSize === "admin1") {
    feats = this.map.querySourceFeatures("admin1", {
      sourceLayer: ["admin1"],
      filter: ["==", "GID_1", e.features[0].id],
    });
    eventObject.selectionName = `${e.features[0].properties.NAME_1} ${e.features[0].properties.TYPE_1}`;
    eventObject.value = e.features[0].properties[cls.dataLayer];
  } else if (cls.hexSize === "admin2") {
    feats = this.map.querySourceFeatures("admin2", {
      sourceLayer: ["admin2"],
      filter: ["==", "GID_2", e.features[0].id],
    });
    eventObject.value = e.features[0].properties[cls.dataLayer];
  }

  this.emit('selectionUpdate', eventObject)

  var countries = [];
  rendered.map(function (x) {
    countries.push(x.properties.NAME_0);
  });


  if (map.getSource("highlightS")) {
    map.removeLayer("highlight");
    map.removeSource("highlightS");
  }

  if (map.getSource("joined")) {
    map.removeLayer("joined");
    map.removeSource("joined");
  }

  map.addSource("highlightS", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });

  map.addLayer({
    id: "highlight",
    source: "highlightS",
    type: "line",
    paint: {
      "line-color": "purple",
      "line-width": 3,
    },
  });

  if (feats.length > 1) {
    var newOne = [];

    feats.forEach(function (f) {
      var geom = f.geometry;
      var props = f.properties;
      var id = f.id;

      if (geom.type === "MultiPolygon") {
        for (var i = 0; i < geom.coordinates.length; i++) {
          var poly = {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: geom.coordinates[i],
            },
            id: id,
            properties: props,
          };
          newOne.push(poly);
        }
      } else {
        newOne.push(f);
      }
    });

    var fc = featureCollection(newOne);

    var joined = dissolve(fc);

    map.addSource("joined", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    map.addLayer({
      id: "joined",
      source: "joined",
      type: "line",
      paint: {
        "line-color": "purple",
        "line-width": 3,
      },
    });

    map.getSource("joined").setData(joined);
  } else {
    map.getSource("highlightS").setData(feats[0]);
  }
}

export function onBivariateClick(clicked, map) {
  if (clicked.features[0].properties.bivarClass === 9) {
    return;
  }
  let classToBivariateClasses = {
    0: { 1: "Low", 2: "Low" },
    1: { 1: "Medium", 2: "Low" },
    2: { 1: "High", 2: "Low" },
    3: { 1: "Low", 2: "Medium" },
    4: { 1: "Medium", 2: "Medium" },
    5: { 1: "High", 2: "Medium" },
    6: { 1: "Low", 2: "High" },
    7: { 1: "Medium", 2: "High" },
    8: { 1: "High", 2: "High" },
    9: { 1: "Unassigned", 2: "Unassigned" },
  };

  let cls = this.options.currentLayerState;
  let bvls = this.options.bivariateLayerState;

  //prepare infobox for display
  this.emit('bivariateClick', {
    class:clicked.features[0].properties["bivarClass"] + 1,
    level1: classToBivariateClasses[clicked.features[0].properties["bivarClass"]][1],
    value1:clicked.features[0].properties[bvls.dataLayer[0].Field_Name],
    level2: classToBivariateClasses[clicked.features[0].properties["bivarClass"]][2],
    value2: clicked.features[0].properties[bvls.dataLayer[1].Field_Name]
  })

  //clear preexisting highlighted source/layer
  if (map.getSource("highlightS")) {
    map.removeLayer("highlight");
    map.removeSource("highlightS");
  }
  if (map.getSource("clickedone")) {
    map.removeLayer("clickedone");
    map.removeSource("clickedone");
  }

  //determine the styleId based on what current resolution is
  let property;
  if (cls.hexSize === "admin1") {
    property = "GID_1";
  } else if (cls.hexSize === "admin2") {
    property = "GID_2";
  } else {
    property = "hexid";
  }
  //find which of the rendered features the clicked on is, and create highlight
  var featureId = clicked.features[0].properties[property];

  var feats = this.map.queryRenderedFeatures({
    layers: [bvls.hexSize],
    filter: ["==", property, featureId],
  });

  var fc = featureCollection(feats); //use turf.js to aggregate into a single geojson and add as layer to map
  var dis = dissolve(fc);
  map.addSource("clickedone", {
    type: "geojson",
    data: dis,
  });
  map.addLayer({
    id: "clickedone",
    source: "clickedone",
    type: "line",
    paint: {
      "line-color": "red",
      "line-width": 5,
    },
  });
}
