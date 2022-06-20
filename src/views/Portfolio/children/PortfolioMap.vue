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
          <!-- <defs>
             <filter id="dropShadow" x="-70%" y="-70%" height="240%" width="240%">
               <feDropShadow
                dx="0"
                dy="0"
                stdDeviation="10px"
                flood-color="#fbff00"
                flood-opacity="1"
              />
            </filter>
          </defs> -->
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
import mapData from '@/assets/world-administrative-boundaries.json'
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
      activeCountry:null,
      zoom:null
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
      let width = document.getElementById('map-container').offsetWidth,
      height = document.getElementById('map-container').offsetHeight,
      projection = d3geo.geoEckert4().rotate([-61,0])
                   .fitSize([width, height], mapData),
      path = d3.geoPath().projection(projection),
      g = this.map.append("g"),
      paths = g.selectAll("path")
        .data(mapData.features);
      let pointsg = this.map.append("g").attr("class", "points"),
      points = pointsg.selectAll("circle")
        .data(pointData.features);
      this.zoom = d3.zoom().on("zoom", () => {
        g.style("stroke-width", 1 / d3.event.transform.k + "px");
        g.attr("transform", d3.event.transform);
        pointsg.attr("transform", d3.event.transform)
        pointsg.style("stroke-width", 1 / d3.event.transform.k + "px");
        console.log(points, 4 / d3.event.transform.k)
        pointsg.selectAll("circle").attr("r", 4 / d3.event.transform.k + 'px')
      });
      let i = [];
      paths.enter().append("path")
        .attr('id', (d) => {
          return d.properties.iso3
        })
        .attr("fill",(d) => {
          let sidsCountry = sidsList.find(c => c.iso === d.properties.iso3)
          if(sidsCountry) {
            i.push(d.properties.iso3);
            if(sidsCountry.region === 'AIS') {
              return  "#97032b"
            }
            if(sidsCountry.region === 'Pacific') {
              return  "#f0a402"
            }
            if(sidsCountry.region === 'Caribbean') {
              return  "#0a8080"
            }
          }
          return  "#c5c5c6"
        })
        .attr("class", (d) => {
          let sidsCountry = sidsList.find(c => c.iso === d.properties.iso3)
          if(sidsCountry) {
            if(sidsCountry.region === 'AIS') {
              return  "clickable AIS"
            }
            if(sidsCountry.region === 'Pacific') {
              return  "clickable Pacific"
            }
            if(sidsCountry.region === 'Caribbean') {
              return  "clickable Caribbean"
            }
          }
        })
        .attr("d", d3.geoPath()
            .projection(projection)
        )
        .style("stroke", "#fff")
        .on('mousedown.log', function (d) {
          if(this.classList.contains("clickable")) {
            d3.event.stopPropagation()
            if(rootThis.activeCountry === d.properties.iso3) {
              rootThis.activeCountry = null
              rootThis.map.attr("class", '');
              rootThis.resetMap();
              rootThis.map.selectAll(`.clickable`).style("stroke", "#fff");
            } else {
              rootThis.map.attr("class", 'zoomed');
              rootThis.map.selectAll(`.clickable`).style("stroke", "#fff");
              rootThis.map.selectAll(`#${d.properties.iso3}`).style("stroke", "#000");
              rootThis.map.selectAll(`#${d.properties.iso3}`).raise()
              rootThis.activeCountry = d.properties.iso3
              var bounds = path.bounds(d),
                dx = bounds[1][0] - bounds[0][0],
                dy = bounds[1][1] - bounds[0][1],
                x = (bounds[0][0] + bounds[1][0]) / 2,
                y = (bounds[0][1] + bounds[1][1]) / 2,
                scale = Math.max(1, Math.min(25, 0.9 / Math.max(dx / width, dy / height))),
                translate = [width / 2 - scale * x, height / 2 - scale * y];

              rootThis.map.transition()
                .duration(750)
                .call( rootThis.zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
              rootThis.handleCountryClick(d.properties.iso3)
            }
          }
        });

        points.enter().append("circle")
          .attr("cx", function (d) { console.log(projection(d.geometry.coordinates), d); return projection(d.geometry.coordinates)[0]; })
          .attr("cy", function (d) { return projection(d.geometry.coordinates)[1]; })
          .attr("r", "4px")
          .attr("fill",(d) => {
            let sidsCountry = sidsList.find(c => c.iso === d.properties.ISOB)
            if(sidsCountry) {
              i.push(d.properties.ISOB);
              if(sidsCountry.region === 'AIS') {
                return  "#97032b"
              }
              if(sidsCountry.region === 'Pacific') {
                return  "#f0a402"
              }
              if(sidsCountry.region === 'Caribbean') {
                return  "#0a8080"
              }
            }
            return  "#c5c5c6"
          })
          .attr("class", (d) => {
            let sidsCountry = sidsList.find(c => c.iso === d.properties.ISOB)
            if(sidsCountry) {
            if(sidsCountry.region === 'AIS') {
              return  "clickable AIS"
            }
            if(sidsCountry.region === 'Pacific') {
              return  "clickable Pacific"
            }
            if(sidsCountry.region === 'Caribbean') {
              return  "clickable Caribbean"
            }
            }
          })
          .style("stroke", "#fff")
          .on('mousedown.log', function (d) {
            if(this.classList.contains("clickable")) {
              d3.event.stopPropagation()
              if(rootThis.activeCountry === d.properties.ISOB) {
                rootThis.activeCountry = null
                rootThis.map.attr("class", '');
                rootThis.resetMap()
                rootThis.map.selectAll(`.clickable`).style("stroke", "#fff");
              } else {
                rootThis.map.attr("class", 'zoomed');
                rootThis.map.selectAll(`.clickable`).style("stroke", "#fff");
                rootThis.map.selectAll(`#${d.properties.ISOB}`).style("stroke", "#000");
                rootThis.map.selectAll(`#${d.properties.ISOB}`).raise()
                rootThis.activeCountry = d.properties.ISOB
                var bounds = path.bounds(d),
                  dx = bounds[1][0] - bounds[0][0],
                  dy = bounds[1][1] - bounds[0][1],
                  x = (bounds[0][0] + bounds[1][0]) / 2,
                  y = (bounds[0][1] + bounds[1][1]) / 2,
                  scale = Math.max(1, Math.min(25, 0.9 / Math.max(dx / width, dy / height))),
                  translate = [width / 2 - scale * x, height / 2 - scale * y];
                rootThis.map.transition()
                  .duration(750)
                  .call( rootThis.zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) );
                  rootThis.handleCountryClick(d.properties.ISOB)
              }
            }
          });
        this.map
          .on("mousedown.log", function() {
            let coordinates = projection.invert(d3.mouse(this))[0],
            region,
            translate,
            scale;
            if(coordinates > -110 && coordinates < -30 ) {
              region = 'Caribbean';
              translate =[-200, -600]
              scale = 4;
            } else if (coordinates > -30 && coordinates < 110) {
              region = 'AIS';
              translate =[-300, -100]
              scale = 1.5;
            } else {
              region = 'Pacific';
              translate =[-1500, -350]
              scale = 2;
            }
            if(rootThis.activeCountry !== 'All') {
              rootThis.map.selectAll(`.${rootThis.activeCountry}`).style("stroke", "#fff");
              rootThis.activeCountry = 'All';
              rootThis.map.attr("class", '');
              rootThis.map.selectAll(`.clickable`).style("stroke", "#fff");
              return rootThis.resetMap()
            } else {
              rootThis.map.transition()
                .duration(750)
                .call( rootThis.zoom.transform, d3.zoomIdentity ).on("end", function() {
                  rootThis.map.selectAll(`.${region}`).style("stroke", "#000");
                  rootThis.map.transition()
                    .duration(750)
                    .call( rootThis.zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4
                })
            }
            rootThis.activeCountry = region;
            rootThis.$emit('updateRegion', region);
          })
    },
    resetMap() {
      this.map.transition()
        .duration(750)
        .call( this.zoom.transform, d3.zoomIdentity ); // updated for d3 v4
        this.handleCountryClick('All')
    },
    handleCountryClick(iso) {
      this.$emit('updateRegion', iso);
    }
  },
  watch: {
  },
  mounted() {
    this.initMap()
    console.log('init')
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
  transform: translateY(-50px);
  width: 100%;
  height: 100%;
}

.zoomed .points{
  display: none;
}

.svg-shadow {
  -webkit-filter: drop-shadow( 1px 0px 18px 7px rgba(255, 236, 0, 0.43));
  filter: drop-shadow( 1px 0px 18px 7px rgba(255, 236, 0, 0.43));
}
</style>
