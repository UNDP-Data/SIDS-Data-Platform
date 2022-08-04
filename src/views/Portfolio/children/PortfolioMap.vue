<template>
  <div class="map d-flex">
    <slot name="header" />
    <v-row class="justify-md-end chips-block justify-center" >
      <v-col class="chips-container pl-0 justify-md-end justify-center">
        <portfolio-indicator-box
          class="portfolio-chip"
          :value="projectsNumber"
          :title="$t('portfolio.chips.sidsWithProjects')"
        />
        <portfolio-indicator-box
          class="portfolio-chip"
          :value="memberStates"
          :title="$t('portfolio.chips.unMembsers')"
        />
        <portfolio-indicator-box
          class="portfolio-chip"
          :value="UNDPprojectsNumber"
          :title="$t('portfolio.chips.projects')"
        />
        <portfolio-indicator-box
          class="portfolio-chip"
          :value="projectsFundning"
          :title="$t('portfolio.chips.funding')"
        />
      </v-col>
    </v-row>
    <div id="map-container">
        <svg id="map-svg">
        </svg>
    </div>
    <div class="filler-block">
    </div>
  </div>
</template>

<script>
import PortfolioIndicatorBox from './PortfolioIndicatorBox'
import format from '@/mixins/format.mixin'
import * as d3 from 'd3';
import * as d3geo from "d3-geo-projection";
import mapData from '@/assets/output.json'
import pointData from '@/assets/sids.json'
import sidsList from '@/assets/sidsList'

export default {
  name: 'PortfolioMap',
  mixins:[format],
  props:{
    projects:{
      default:()=>([]),
      type: Array
    },
    region: {
      default:'All',
      type:String
    }
  },
  components:{
    PortfolioIndicatorBox
  },
  data() {
    return {
      map:null,
      zoom:null,
      path: null,
      width: null,
      height: null,
      activeRegion: null,
      g:null,
      titles:[
        {"type":"Feature","geometry":{"type":"Point","coordinates":[-75.98267711245876,1.520880383123256]},"properties":{"OBJECTID":102, color:"#0a8080", "name":'Caribbean'}},
        {"type":"Feature","geometry":{"type":"Point","coordinates":[-2.606592420403899,-8.23811497852346974]},"properties":{"OBJECTID":102, color:"#97032b", "name":'AIS'}},
        {"type":"Feature","geometry":{"type":"Point","coordinates":[140.580479656511, -0.5129557776870115]},"properties":{"OBJECTID":102, color:"#f0a402", "name":'Pacific'}},
      ],
      regionTransforms: {
        'Caribbean' : {
          translate: [0, -130],
          scale: 2
        },
        'AIS' : {
          translate: [-300, -130],
          scale: 1.5
        },
        'Pacific' : {
          translate: [-1500, -350],
          scale: 2
        }
      },
      textTransform: {
        SUR:[0,20],
        GUY: [-12, 20],
        BLZ:[-14, 10],
        TTO: [25, 35],
        GRD: [30, 30],
        VCT: [35, 25],
        BRB: [35, 13],
        LCA: [43, 5],
        DMA: [43, 2],
        MSR: [45, -3],
        ATG: [40,-12],
        KNA: [40, -22],
        AIA: [30, -38],
        SXM: [40, -28],
        VGB: [20, -48],
        DOM: [-15, -50],
        BHS: [-15, 0],
        CUB: [-22, 0],
        CYM: [-16, 4],
        JAM: [-10, 20],
        HTI: [-13, -35],
        CUW: [-27, 30],
        ABW: [-24, 10],
        TCA: [30, -56],
        TON: [0, 10],
        MHL: [0, 10],
        SLB: [0, 10],
      }
    }
  },
  computed:{
    projectsNumber() {
      switch (this.regions) {
        case 'caribbean':
          return 25;
        case 'ais':
          return 9;
        case 'pacific':
          return 16;
        default:
          return 50;
      }
    },
    memberStates() {
      switch (this.regions) {
        case 'caribbean':
          return 16
        case 'ais':
          return 9
        case 'pacific':
          return 13
        default:
          return 38
      }
    },
    UNDPprojectsNumber() {
      let distinctProjects = [];
      this.projects.map(project => {
          if (!distinctProjects.includes(project.title)) {
            distinctProjects.push(project.title)
          }
      })
      return distinctProjects.length
    },
    projectsFundning() {
      let funding = 0;
      this.projects.map(project => {
        funding = funding + parseInt(project.budget);
      })
      return this.nFormatter(funding)
    }
  },
  methods: {
    initMap() {
      let rootThis = this;
      this.map = d3.select('#map-svg');
      this.width = document.getElementById('map-container').offsetWidth;
      this.height = document.getElementById('map-container').offsetHeight;
      this.g = this.map.append("g");
      let pointDataFiltered = pointData.features.filter(feature => {
        return sidsList.some(c => c.iso === feature.properties.ISOB)
      })
      let projection = d3geo.geoEckert4().rotate([-61,0])
                   .fitSize([this.width, this.height], mapData),
      gpaths = this.g.append("g"),
      pointsg = this.g.append("g").attr("class", "points"),
      gtexts = this.g.append("g"),
      gLines = this.g.append("g"),
      gTitles = this.g.append("g"),
      paths = gpaths.selectAll("path")
        .data(mapData.features),
      points = pointsg.selectAll("circle")
        .data(pointDataFiltered);
      this.path = d3.geoPath().projection(projection);
      this.zoom = d3.zoom().on("zoom", () => {
        this.g.style("stroke-width", 1 / d3.event.transform.k + "px");
        this.g.attr("transform", d3.event.transform);
        pointsg.style("stroke-width", 1 / d3.event.transform.k + "px");
        pointsg.selectAll("circle").attr("r", 4 / d3.event.transform.k + 'px')
        gtexts.selectAll("text").attr("font-size", 10 / d3.event.transform.k + 'px')
        gTitles.selectAll("text").attr("font-size", 20 / d3.event.transform.k + 'px')
        gLines.selectAll("path").attr("stroke-width", 1 / d3.event.transform.k + 'px')
      });
      paths.enter().append("path")
        .attr('id', (d) => {
          return d.properties.iso3
        })
        .attr("fill",(d) => {
          return rootThis.computeFill(d.properties.iso3)
        })
        .attr("class", (d) => {
          if(sidsList.some(c => c.iso === d.properties.iso3)) {
            return `clickable ${rootThis.computeRegion(d.properties.iso3)}`
          }
          return ''
        })
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("stroke", "#fff")
        .on('mousedown.log', function (d) {
          if(this.classList.contains("clickable")) {
            d3.event.stopPropagation()
            if(rootThis.region === d.properties.iso3) {
              rootThis.$emit('updateRegion', 'All');
            } else {
              rootThis.$emit('updateRegion', d.properties.iso3);
            }
          }
        });

        points.enter().append("circle")
          .attr("cx", function (d) { return projection(d.geometry.coordinates)[0]; })
          .attr("cy", function (d) { return projection(d.geometry.coordinates)[1]; })
          .attr("r", "4px")

          .attr("fill",(d) => {
            return rootThis.computeFill(d.properties.ISOB)
          })
          .attr("class", (d) => {
            return `clickable ${rootThis.computeRegion(d.properties.ISOB)}`
          })
          .style("stroke", "#fff")
          .on('mousedown.log', function (d) {
            if(this.classList.contains("clickable")) {
              d3.event.stopPropagation()
              if(rootThis.region === d.properties.ISOB) {
                rootThis.$emit('updateRegion', 'All');
              } else {
                rootThis.$emit('updateRegion', d.properties.ISOB);
              }
            }
          });
        this.map
          .on("mousedown.log", function() {
            let coordinates = projection.invert(d3.mouse(this))[0],
            region;
            if(coordinates > -110 && coordinates < -30 ) {
              region = 'Caribbean';
            } else if (coordinates > -30 && coordinates < 110) {
              region = 'AIS';
            } else {
              region = 'Pacific';
            }
            if(rootThis.region !== 'All') {
              rootThis.$emit('updateRegion', 'All');
            } else {
              rootThis.$emit('updateRegion', region);
            }
          })
        gtexts.selectAll('.country_label.point_label')
          .data(pointDataFiltered)
          .enter().append('text')
          .attr("class", function (d) {return `country_label point_label ${rootThis.computeRegion(d.properties.ISOB)}`})
          .text(function (d) { return d.properties.Admin})
          .attr("fill", "black")
          .style("text-anchor", (d) => {
            if(rootThis.textTransform[d.properties.ISOB] && rootThis.textTransform[d.properties.ISOB][0] < 0) {
              return 'end'
            }
            return "start"
          })
          .style("transform", (d) => {
            if(rootThis.textTransform[d.properties.ISOB]) {
              return `translate(${rootThis.textTransform[d.properties.ISOB][0]}px,${rootThis.textTransform[d.properties.ISOB][1]}px)`
            }
            return ''
          })
          .attr('id', function (d) {return `point-label-${d.properties.ISOB}`})
          .attr("dx", function (d) { return projection(d.geometry.coordinates)[0]+5; })
          .attr("font-size", '10px')
          .attr("dy", function (d) { return projection(d.geometry.coordinates)[1]-5; })
          .on('mousedown.log', function (d) {
            d3.event.stopPropagation()
            let iso = d.properties.ISOB || d.properties.iso3;
            if(rootThis.region === iso) {
              rootThis.$emit('updateRegion', 'All');
            } else {
              rootThis.$emit('updateRegion', iso);
            }
          });

        gtexts.selectAll('.country_label.poly_label')
          .data(mapData.features)
          .enter().append('text')
          .attr('id', function (d) {return `poly-label-${d.properties.iso3}`})
          .attr("class", function (d) {return `country_label poly_label ${rootThis.computeRegion(d.properties.iso3)}`})
          .each(function(d) {
            let sidsCountry = sidsList.find(c => c.iso === d.properties.iso3)
            if(sidsCountry && d3.select(`#point-label-${d.properties.iso3}`).empty()) {
              var bounds = rootThis.path.bounds(d),
              x = (bounds[0][0] + bounds[1][0]) / 2,
              y = (bounds[0][1] + bounds[1][1]) / 2;
              d3.select(this).text(d.properties.name)
                .attr("dx", x+5)
                .attr("dy", y-5)
                .attr("font-size", '10px')
                .attr("fill", "black")
                .style("transform", (d) => {
                  if(rootThis.textTransform[d.properties.iso3]) {
                    return `translate(${rootThis.textTransform[d.properties.iso3][0]}px,${rootThis.textTransform[d.properties.iso3][1]}px)`
                  }
                  return ''
                })
                .style("text-anchor", (d) => {
                  if(rootThis.textTransform[d.properties.iso3] && rootThis.textTransform[d.properties.iso3][0] < 0) {
                    return 'end'
                  }
                  return "start"
                })
            }
          })
      let line = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .curve(d3.curveLinear)
      gTitles.selectAll(".map-title")
        .data(this.titles)
        .enter().append("text")
          .attr("class", (d) => { return `map-title ${d.properties.name}`})
          .attr("dx", function (d) { return projection(d.geometry.coordinates)[0]+5; })
          .attr("dy", function (d) { return projection(d.geometry.coordinates)[1]-5; })
          .attr("stroke",(d)=> {
            return d.properties.color
          })
          .attr('text-anchor', (d) => {
            if(d.properties.name ==='Caribbean') {
              return 'end'
            }
          })
          .style("fill",(d)=> {
            return d.properties.color
          })
          .text((d)=> {
            return d.properties.name
          })
          .attr("font-size", '20px')
          .on('mousedown.log', (d)=> {
            d3.event.stopPropagation()
            rootThis.$emit('updateRegion', d.properties.name);
          })
      gLines.selectAll(".parish-line.point-line")
        .data(pointDataFiltered)
      .enter().append('path')
        .attr("class",(d) => { return `parish-line point-line ${rootThis.computeRegion(d.properties.ISOB)}` })
        .attr('id', function (d) {return `point-line-${d.properties.ISOB}`})
        .attr("d", function(d) {
          let tTransfrom = rootThis.textTransform[d.properties.ISOB]
          if(tTransfrom && (Math.abs(tTransfrom[0]) + Math.abs(tTransfrom[1])) > 10 ) {
            let centroid = rootThis.path.centroid(d),
            endpointX = centroid[0]+ tTransfrom[0] + 5,
            endpointY = centroid[1]+ tTransfrom[1] - 8;
            if(tTransfrom[0] < -10) {
              endpointX+=3
              // endpointX+=d3.select(`#point-label-${d.properties.ISOB}`).node().getComputedTextLength();
            }
            return line([
              {"x": centroid[0], "y": centroid[1]},
              {"x": endpointX, "y": endpointY}
            ]);
          }
        })
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("opacity", 0.8)
        .attr("fill", "#000")
    gLines.selectAll(".parish-line.poly-name-line")
      .data(mapData.features)
    .enter().append('path')
      .attr("class",(d) => { return `parish-line poly-name-line ${rootThis.computeRegion(d.properties.iso3)}` })
      .attr("d", function(d) {
        let sidsCountry = sidsList.find(c => c.iso === d.properties.iso3);
        let point = pointDataFiltered.some((k) => {
          return k.properties.ISOB === d.properties.iso3
        })
        if(sidsCountry && !point) {
          let tTransfrom = rootThis.textTransform[d.properties.iso3]
          if(tTransfrom && (Math.abs(tTransfrom[0]) + Math.abs(tTransfrom[1])) > 10 ) {
            let centroid = rootThis.path.centroid(d),
            endpointX = centroid[0]+ tTransfrom[0] + 5,
            endpointY = centroid[1]+ tTransfrom[1] - 8;
            if(tTransfrom[0] < -10) {
              endpointX+=3
              // endpointX+=d3.select(`#poly-label-${d.properties.iso3}`).node().getComputedTextLength();
            }
            return line([
              {"x": centroid[0], "y": centroid[1]},
              {"x": endpointX, "y": endpointY}
            ]);
          }
        }
      })
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("opacity", 0.8)
      .attr("fill", "#000")
    },
    computeRegion(iso) {
      let sidsCountry = sidsList.find(c => c.iso === iso)
      if(sidsCountry) {
        return sidsCountry.region
      } else return '';
    },
    computeFill(iso) {
      let region = this.computeRegion(iso)
      if(region) {
        if(region === 'AIS') {
          return  "#97032b"
        }
        if(region === 'Pacific') {
          return  "#f0a402"
        }
        if(region === 'Caribbean') {
          return  "#0a8080"
        }
      }
      return  "#c5c5c6"
    },
    resetMap() {
      d3.selectAll('#ctitle').remove()
      this.map.attr("class", '');
      this.map.selectAll(`.clickable`).style("stroke", "#fff");
      this.map.transition()
        .duration(1350)
        .call( this.zoom.transform, d3.zoomIdentity ); // updated for d3 v4
    },
    selectCountry(iso) {
        d3.selectAll('#ctitle').remove()
        let d = mapData.features.find(d => d.properties.iso3 === iso)
        this.map.attr("class", 'zoomed');
        this.map.selectAll(`.clickable`).style("stroke", "#fff");
        this.map.selectAll(`#${iso}`).style("stroke", "#000");
        this.map.selectAll(`#${iso}`).raise()
        var bounds = this.path.bounds(d),
          dx = bounds[1][0] - bounds[0][0],
          dy = bounds[1][1] - bounds[0][1],
          x = (bounds[0][0] + bounds[1][0]) / 2,
          y = (bounds[0][1] + bounds[1][1]) / 2,
          scale = Math.max(1, Math.min(35, 0.9 / Math.max(dx / (this.width-250), dy / (this.height-250))));
          console.log(scale)
          let translate = [this.width / 2 - scale * x, this.height / 2 - scale * y];
        this.map.transition()
          .duration(1350)

          .call( this.zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
        let center = this.path.centroid(d)
        this.g.append("text")
        .attr('id', 'ctitle')
        .text(function () { return d.properties.name})
        .style("text-anchor", 'middle')
        .attr("dx", center[0])
        .attr("dy", center[1])
        .attr("font-size", 30 / scale + 'px')

    },
    selectRegion(name) {
      let transforms = this.regionTransforms[name];

      this.map.transition()
        .duration(1350)
        .attr('class', `zoom-${name}`)
        .call( this.zoom.transform, d3.zoomIdentity ).on("end", () => {
          this.map.selectAll(`.clickable.${name}`).style("stroke", "#000");
          this.map.transition()
            .duration(1350)
            .call( this.zoom.transform, d3.zoomIdentity.translate(transforms.translate[0],transforms.translate[1]).scale(transforms.scale) ); // updated for d3 v4
        })
    }
  },
  watch: {
    region() {
      if(this.region !== 'All') {
        if(['AIS', 'Caribbean', 'Pacific'].includes(this.region)) {
          this.selectRegion(this.region)
        } else {
          this.selectCountry(this.region)
        }
      } else {
        this.resetMap();
      }
    }
  },
  mounted() {
    this.initMap();
    if(this.region !== 'All') {
      if(['AIS', 'Caribbean', 'Pacific'].includes(this.region)) {
        this.selectRegion(this.region)
      } else {
        this.selectCountry(this.region)
      }
    }
  }
}
</script>

<style>
.map {
  flex-direction: column;
  height: calc(100vh - 237px);
  max-height: 640px;
  width: 100%;
  margin-bottom: 8px;
  position: relative;
}
#map-container, .filler-block {
  height: 100%
}
#map-container {
  position: absolute;
  top: -1em;
  left: 0;
  width: 100%;
  overflow: hidden;
  cursor: pointer;
}
.custom-chip_header {
  justify-content: center;
  padding: 0.1em;
  font-weight: 700;
}
.custom-chip_text {
  justify-content: center;
  padding: 0.4em;
  max-width: 120px;
  text-align: center;
  font-size: 12px;
  line-height: 1;
  font-weight: 900;
  margin: auto;
}
.map_info {
  flex-grow: 0;
}


@media all and (min-width:960px) {
  .map {
    min-height: 350px;
    max-height: calc(100vh - 460px);
    margin: 0 -2em;
    width: calc(100% + 4em);
    padding: 0 2em;
  }
  .portfolio-chip:last-child {
    margin-right: 0 !important;
  }
}

@media all and (min-width:1264px) {
  .map {
    min-height: 550px;
    max-height: calc(100vh - 200px);
  }
}
@media all and (min-width:1400px) {
  .map {
    max-height: calc(100vh - 260px);
  }
}

@media all and (max-width:959px) {
  .map {
    background-image:none !important;
    height: auto;
    max-height: 720px;
  }
}
@media all and (max-width:600px) {
  .portfolio-chip {
    min-width: 30%;
    margin: 5px 5% !important
  }
}
.chips-container {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  padding-top: 0;
  padding-bottom: 0;
}
.chips-block{
  margin-left: auto;
  margin-right: 0%;
}
.clickable {
  cursor: pointer;
}
#map-container svg {
  margin-top: -30px;
  width: 100%;
  height: 100%;
}

.zoomed .points,.zoomed .country_label, .zoomed .parish-line, .zoomed .map-title {
  display: none;
}

.svg-shadow {
  -webkit-filter: drop-shadow( 1px 0px 18px 7px rgba(255, 236, 0, 0.43));
  filter: drop-shadow( 1px 0px 18px 7px rgba(255, 236, 0, 0.43));
}
.country_label {
  font-family: sans-serif;
  text-shadow: -1px 1px 2px #f4f5f8, 1px 1px 2px #f4f5f8, 1px -1px 2px #f4f5f8, -1px -1px 2px #f4f5f8;
  fill: black;
}
#ctitle {
  font-family: sans-serif;
  text-shadow: -1px 1px 2px #f4f5f8, 1px 1px 2px #f4f5f8, 1px -1px 2px #f4f5f8, -1px -1px 2px #f4f5f8;
  fill: black;
}
.map-title {
  font-family: sans-serif;
  font-weight: bold;
}
.country_label,
.parish-line, .map-title {
  opacity: 1;
  transition: opacity 1500ms linear;
}
.zoom-AIS .country_label.Caribbean,  .zoom-AIS .parish-line.Caribbean, .zoom-AIS .map-title.Caribbean,
.zoom-AIS .country_label.Pacific,  .zoom-AIS .parish-line.Pacific, .zoom-AIS .map-title.Pacific,
.zoom-Caribbean .country_label.AIS,  .zoom-Caribbean .parish-line.AIS, .zoom-Caribbean .map-title.AIS,
.zoom-Caribbean .country_label.Pacific,  .zoom-Caribbean .parish-line.Pacific,  .zoom-Caribbean .map-title.Pacific,
.zoom-Pacific .country_label.AIS,  .zoom-Pacific .parish-line.AIS, .zoom-Pacific .map-title.AIS,
.zoom-Pacific .country_label.Caribbean,  .zoom-Pacific .parish-line.Caribbean,  .zoom-Pacific .map-title.Caribbean
{
  opacity: 0 !important;
}
</style>
