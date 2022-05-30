import { featureCollection } from "@turf/helpers";
import dissolve from "@turf/dissolve";

export function onDataClick(e) {
  if (this.options.bivarateMode) {
    return;
  }
  let cls = this.options.currentLayerState;
  // if (mapboxMapInstance === this.map2) {
  //   cls = globals.comparisonLayerState;
  // }

  if (this.getSource("highlightS")) {
    this.removeLayer("highlight");
    this.removeSource("highlightS");
  }

  if (this.getSource("clickedone")) {
    this.removeLayer("clickedone");
    this.removeSource("clickedone");
  }

  var currId = e.features[0].properties.hexid;

  var feats = this.map.queryRenderedFeatures({
    layers: [cls.hexSize],
    filter: ["==", "hexid", currId],
  });

  var fc = featureCollection(feats);

  var dis = dissolve(fc);

  this.map.addSource("clickedone", {
    type: "geojson",
    data: dis,
  });

  this.map.addLayer({
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

export function onAdminClick(e, adminLayerId) {
  let cls = this.options.currentLayerState;

  var rendered = this.map.queryRenderedFeatures({
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


  if (this.map.getSource("highlightS")) {
    this.map.removeLayer("highlight");
    this.map.removeSource("highlightS");
  }

  if (this.map.getSource("joined")) {
    this.map.removeLayer("joined");
    this.map.removeSource("joined");
  }

  this.map.addSource("highlightS", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [],
    },
  });

  this.map.addLayer({
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

    this.map.addSource("joined", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });

    this.map.addLayer({
      id: "joined",
      source: "joined",
      type: "line",
      paint: {
        "line-color": "purple",
        "line-width": 3,
      },
    });

    this.map.getSource("joined").setData(joined);
  } else {
    this.map.getSource("highlightS").setData(feats[0]);
  }
}
