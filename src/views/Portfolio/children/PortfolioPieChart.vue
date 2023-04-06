<template>
  <div class="pt-3">
    <p :style="{display: noData ? 'block' : 'none'}">
      No data for selected filters
    </p>
    <div :style="{visibility: !noData ? 'visible' : 'hidden'}" class="pie-chart" :id="chartName + postfix">
    </div>
    <div class="d-none" v-for="(axis, index) in data" :id="chartName + postfix +'tooltip'+ index" :key="index">
      <portfolio-pieChart-tooltip :header="chartName === 'region' ? $t(`regions.${axis.category}`) : $t(`portfolio.fundingTypes.${axis.category}`)" :budget="axis.value" :finance="nFormatter(axis.value)" :percetage="data"/>
    </div>
  </div>
</template>

<script>
import PortfolioPieChartTooltip from './PortfolioPieChartTooltip';
import * as d3 from 'd3';
import format from '@/mixins/format.mixin'
import tippy from 'tippy.js';

export default {
  name: 'PortfolioMap',
  mixins:[format],
  components:{
    PortfolioPieChartTooltip
  },
  props:{
    chartName: {
      type: String,
      default: 'region'
    },
    postfix: {
      type: String,
      default: ''
    },
    colorScheme: {
      type: Function,
      default: ()=>(()=>({}))
    },
    data: {
      type: Array,
      default: ()=>([])
    },
    activeCategory: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      resizeTimeout:null,
      pie: null,
      tooltips:[],
      arc: null,
      outerArc: null,
      makePie: null,
    }
  },
  computed: {
    locale() {
      return this.$i18n.locale
    },
    noData() {
      return this.data.every(item => item.value === 0)
    }
  },
  methods: {
    initChart() {
      this.pie = d3.select(`#${this.chartName}${this.postfix}`).append("svg").append("g");
      let translate = this.$vuetify.breakpoint.name === 'xs' || this.$vuetify.breakpoint.name === 'sm' ?
      `translate(160, 40)` : `translate(140, 75)`
      this.pie.append("g")
        .attr("class", "slices").attr("transform", translate);
      this.pie.append("g")
        .attr("class", "labels").attr("transform", translate);
      this.pie.append("g")
        .attr("class", "lines").attr("transform", translate);
        let radius = window.innerWidth < 960 ? 38 : 64
      this.arc = d3.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

      this.outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

      this.makePie = d3.pie()
        .value(d => d.value)
        .sort(null);
    },
    midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    },
    drawChart() {
      const rootThis = this;
      let radius = window.innerWidth < 960 ? 38 : 64
      this.arc
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);
      this.outerArc
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);
      let translate = window.innerWidth < 960 ?
        `translate(160, 40)` : `translate(140, 75)`;
      this.pie.select(".slices").attr("transform", translate);
      this.pie.select(".labels").attr("transform", translate);
      this.pie.select(".lines").attr("transform", translate);
      /* ------- PIE SLICES -------*/
      var slice = this.pie.select(".slices").selectAll("path.slice")
        .data(this.makePie(this.data));

      slice.enter()
        .insert("path")
        .style("fill", function(d) { return rootThis.colorScheme(d.data.category); })
        .attr("class", "slice");

      slice
        .transition().duration(1000)
        .attrTween("d", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            return rootThis.arc(interpolate(t));
          };
        })
        slice.on('click', function (d) {
          rootThis.setFilter(rootThis.chartName, d.data.category)
        })
      rootThis.tooltips.map((t)=>t.destroy())
      let newTooltips = [];
      slice.each((data, index, list) => {
        newTooltips.push(
          tippy(list[index], {
            content() {
              const template = document.getElementById(`${rootThis.chartName}${rootThis.postfix}tooltip${index}`);
              return template.innerHTML;
            },
            theme: 'light',
            interactive: true,
            allowHTML: true,
            appendTo: () => document.body
          })
        )
      })
      slice.exit()
        .remove();
      rootThis.tooltips = newTooltips;
      /* ------- TEXT LABELS -------*/

      let text = this.pie.select(".labels").selectAll("text")
        .data(this.makePie(this.data));
      text.enter()
        .append("text")
        .attr("dy", ".35em")
        .attr("font-size", "12px")
        .attr('font-weight', (d) => {
          if(d.data.category === rootThis.activeCategory) {
            return "bold"
          }
        })
        .text(function (d) {
          if (d.data.value == 0) { return ""; } else {
            let text = rootThis.chartName === 'region' ? rootThis.$t(`regions.${d.data.category}`) : rootThis.$t(`portfolio.fundingTypes.${d.data.category}`)
            return text + " - " + rootThis.nFormatter(d.data.value, 1);
          }
        });
      let sumall = 0
      for (let source in this.data) {
        sumall += this.data[source].value
      }

      text.text(function (d,c,g) {
        let showText = !((d.data.value / sumall) < 0.0236);
        if(c !== 0) {
          showText = showText && !(((d.data.value + g[c-1].__data__.data.value) / sumall) < 0.1);
        }

        if (!showText) { return ""; } else {
          let text = rootThis.chartName === 'region' ? rootThis.$t(`regions.${d.data.category}`) : rootThis.$t(`portfolio.fundingTypes.${d.data.category}`)
          return text + " - " + rootThis.nFormatter(d.data.value, 1);
        }
      });
      text.transition().duration(1000)
        .attrTween("transform", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            var d2 = interpolate(t);
            var pos = rootThis.outerArc.centroid(d2);
            pos[0] = radius * (rootThis.midAngle(d2) < Math.PI ? 1 : -1);
            return "translate(" + pos + ")";
          };
        })
        .attr('font-weight', (d) => {
          if(d.data.category === rootThis.activeCategory) {
            return "bold"
          }
        })
        .styleTween("text-anchor", function (d) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            var d2 = interpolate(t);
            return rootThis.midAngle(d2) < Math.PI ? "start" : "end";
          };
        });

      text.exit()
        .remove();

      /* ------- SLICE TO TEXT POLYLINES -------*/

      var polyline = this.pie.select(".lines").selectAll("polyline")
        .data(this.makePie(this.data));

      polyline.enter()
        .append("polyline");

      polyline.transition().duration(1000)
        .attrTween("points", function (d,c,g) {
          this._current = this._current || d;
          var interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(0);
          return function (t) {
            var d2 = interpolate(t);
            var pos = rootThis.outerArc.centroid(d2);
            pos[0] = radius * 0.95 * (rootThis.midAngle(d2) < Math.PI ? 1 : -1);
            let showText = !((d.data.value / sumall) < 0.0236);
            if(c !== 0) {
              showText = showText && !(((d.data.value + g[c-1].__data__.data.value) / sumall) < 0.1);
            }
            if (!showText) {
              return []
            }
            return [rootThis.arc.centroid(d2), rootThis.outerArc.centroid(d2), pos];
          };
        });

      polyline.exit()
        .remove();
      },
      setFilter(type, value) {
        this.$emit('changeFilter',{type, value})
      },
      updateScreenSize() {
        let rootThis = this;
        if(this.resizeTimeout) {
          clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(async () => {
          rootThis.$nextTick(rootThis.drawChart);
        }, 100);
      }
    },
    created() {
      window.addEventListener("resize", this.updateScreenSize);
    },
    destroyed() {
      window.removeEventListener("resize", this.updateScreenSize);
    },
    mounted() {
      this.initChart();
      this.drawChart();
      // no idea why but works good only if called twice (same as in old version)
      this.drawChart();
    },
    watch: {
      data() {
        this.$nextTick(this.drawChart);
      },
      locale() {
        this.$nextTick(this.drawChart);
      }
    },
}
</script>

<style>
.pie-chart {
  text-align: center;
}
.pie-chart svg {
  width: auto;
  height: 130px;
  overflow: visible;
}
.pie-chart polyline {
  opacity: 0.3;
  stroke: black;
  stroke-width: 2 px;
  fill: none;
}
.slices:hover .slice {
    opacity: 0.5;
}
.slice {
  cursor: pointer;
}
.slices:hover .slice:hover {
    opacity: 1;
}
@media all and (max-width:959px) {
  .pie-chart svg {
    max-width: 310px;
    margin: auto;
    height: 90px;
    min-height: 90px;
  }
}
</style>
