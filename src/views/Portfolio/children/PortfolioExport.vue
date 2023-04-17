<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="export-button"
        :icon="!isDesktop"
        :outlined="!isDesktop"
        :block="isDesktop"
        v-bind="attrs"
        v-on="on"
      >
        <span v-if="isDesktop">{{$t('root.buttons.export')}}</span>
        <v-icon dark v-else>mdi-export-variant</v-icon>
      </v-btn>
    </template>
    <v-list dense>
      <v-list-item-group>
        <v-list-item @click="exportCSV">
          <v-list-item-title>{{$t('root.export.csv')}}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="exportProjectList">
          <v-list-item-title>{{$t('root.export.list')}}</v-list-item-title>
        </v-list-item>
        <v-list-item @click="exportPDF">
          <v-list-item-title>{{$t('root.export.pdf')}}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import sizeMixin from '@/mixins/size.mixin'
import sidsList from '@/assets/sidsList'
import { goals } from '@/assets/goalsList'

import { mapState } from 'vuex';

export default {
  name: 'PortfolioExport',
  mixins:[sizeMixin],
  props:{
    region: {
      type: String,
      default: 'All'
    },
    year: {
      type: String,
      default: 'All'
    },
    funding: {
      type: String,
      default: 'All'
    },
    projects: {},
    data:{},
    categories:{}
  },
  data() {
    return {
      portfolioHeaders: {
          country: "Country",
          region: "Region",
          year: "Year",
          title: "Project Title",
          budget: "Budget (USD)",
          expense: "Expense (USD)",
          sdg: "SDGs",
          solution: "Signature Solution",
          samoa: "SAMOA Pathway",
          donors: "Funding Sources",
      },
      summaryHeaders: {
        category: 'Category',
        budget: "Total Budget (USD)",
        projects: "Number of Projects",
        countries: "SIDS with UNDP Projects",
        type: "Donor or Recipient"
      },
      regions: ["Caribbean", "Pacific", "AIS"],
    }
  },
  computed:{
    ...mapState({
      fundingCategories: state => state.sids.fundingCategories,
    }),
  },
  methods: {
    exportProjectList(){
      let projectExport = this.projecctExportRender(),
      fileData = [this.portfolioHeaders].concat(projectExport),
      note = `This dataset is the list of UNDP projects filtered by the ${this.region}  region, the year(s) ${this.year} , and the funding category ${this.funding} . All data is used with permission from the UNDP open data portal.`

      let filename = window.location.pathname.substring(1).replaceAll('/', '_') + '_projects'
      this.exportCSVFile(fileData, filename, note)
    },
    exportCSV(){
      let summaryExport = this.summaryExportRender(),
      fileData = [this.summaryHeaders].concat(summaryExport),
      note = `This dataset is the compiled budget and project totals per category for all UNDP projects filtered by the ${this.region}  region, the year(s) ${this.year} , and the funding category ${this.funding} . All data is used with permission from the UNDP open data portal.`

      let filename = window.location.pathname.substring(1).replaceAll('/', '_') + '_summary'
      this.exportCSVFile(fileData, filename, note)
    },
    exportCSVFile(fileData, fileTitle, note) {
      // Convert Object to JSON
      var jsonObject = JSON.stringify(fileData);
      var csv = this.convertToCSV(jsonObject,note);
      var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
      var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", exportedFilenmae);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    },
    convertToCSV(objArray,note) {
      var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
      var str=""
      if(note!=""){
      str += '#'+note+'\r\n';}
      for (var i = 0; i < array.length; i++) {
          var line = '';
          for (var index in array[i]) {
              if (line != '') {
                line += ','
              }
              if(array[i][index]) {
                line += `"${array[i][index]}"`;
              }
          }
          str += line + '\r\n';
      }
      return str;
    },
    projecctExportRender() {
      return this.projects.reduce((dataArray, project) => {
        return dataArray.concat(project.year.map(year => {
          return {
            country: project.country,
            region: project.region,
            year,
            title: project.title,
            budget: project.budget[year],
            expense: project.expense[year],
            sdg: project.sdg.map(goalNumber => {
              return goals.sdgs[goalNumber-1].title
            }),
            solution: project.solution.map(goalNumber => {
              return goals['signature-solutions'][goalNumber-1] ? goals['signature-solutions'][goalNumber-1].title : 'Other';
            }),
            samoa: project.samoa.map(goalNumber => {
              return goals.samoa[goalNumber-1].title
            }),
            donors: project.donors.map(donor => {
              return this.fundingCategories[donor].donor
            })
          }
        }))
      },[])
    },
    summaryExportRender() {
      let summaryExport = [],
      distinctCountries = [],
      totalBudg = this.projects.reduce((budget, project) => {
        return budget + project.year.reduce((projectBudget, year) => {
          return projectBudget+project.budget[year]
        },0)
      },0);
      for (let project in this.projects) {
        if (!distinctCountries.includes(this.projects[project].country)) {
          distinctCountries.push(this.projects[project].country)
        }
      }
      let newEl = {};
      newEl["category"] = "Total";
      newEl["budget"] = totalBudg;
      newEl["projects"] = this.projects.length;
      newEl["countries"] = distinctCountries.length;
      newEl["type"] = "Recipient";

      summaryExport.push(newEl)
      for (let region in this.regions) {
          let regionDistinctProjects = [],
          regionProjects = this.projects.filter((d) => { return d.region == this.regions[region] })
          totalBudg = regionProjects.reduce((budget, project) => {
            return budget + project.year.reduce((projectBudget, year) => {
              return projectBudget+project.budget[year]
            },0)
          },0);

          for (let project in regionProjects) {
            if (!regionDistinctProjects.includes(this.projects[project].title)) {
                regionDistinctProjects.push(this.projects[project].title)
            }
          }
          newEl = {}
          newEl["category"] = this.regions[region]
          newEl["budget"] = totalBudg
          newEl["projects"] = regionProjects.length
          newEl["countries"] = 1//join(';')
          newEl["type"] = "Recipient"
          summaryExport.push(newEl)
      }


      //by recipient country,
      for (let country in distinctCountries) {
        if(country !== 'all') {
            let countryDistinctProjects = [],
            regionProjects = this.projects.filter((d) => { return d.country == distinctCountries[country] })
            totalBudg = regionProjects.reduce((budget, project) => {
              return budget + project.year.reduce((projectBudget, year) => {
                return projectBudget+project.budget[year]
              },0)
            },0);
            for (let project in regionProjects) {
              if (!countryDistinctProjects.includes(this.projects[project].title)) {
                  countryDistinctProjects.push(this.projects[project].title)
              }
            }
            newEl = {}
            newEl["category"] = distinctCountries[country]
            newEl["budget"] = totalBudg
            newEl["projects"] = regionProjects.length
            newEl["countries"] = 1//join(';')
            newEl["type"] = "Recipient"
            summaryExport.push(newEl)
          }
      }

      //by funding category,
      for (let fundCat in this.categories) {
          let label = this.categories[fundCat].value,
          categoryDistinctProjects = [],
          categoriesDistinctCountries = [],
          totalBudg = 0;
          if(label !== 'all') {
            this.projects.map(project => {
              let donors = project.donors;//["budget"])
              donors.map((donor) => {
                try {
                  let category = this.fundingCategories[donor].category;
                  let country = sidsList.find(country => {
                    return project.country === country.iso
                  });
                  country = country ? country.name : '';
                  if (label == "Programme Countries") {
                    if (category == "Government" && this.fundingCategories[donor].subCategory == country) {
                      let budget = project.year.reduce((projectBudget, year) => {
                        return projectBudget+project.budget[year]
                      },0)
                      totalBudg += budget / donors.length
                      if (!categoryDistinctProjects.includes(project.title)) {
                          categoryDistinctProjects.push(project.title)
                      }
                      if (!categoriesDistinctCountries.includes(project.country)) {
                          categoriesDistinctCountries.push(project.country)
                      }
                    }
                  }

                  else if (label == "Donor Countries") {
                      if (category == "Government" && this.fundingCategories[donor].subCategory != country) {
                        let budget = project.year.reduce((projectBudget, year) => {
                          return projectBudget+project.budget[year]
                        },0)
                        totalBudg += budget / donors.length
                      }
                      if (!categoryDistinctProjects.includes(project.title)) {
                          categoryDistinctProjects.push(project.title)
                      }
                      if (!categoriesDistinctCountries.includes(project.country)) {
                          categoriesDistinctCountries.push(project.country)
                      }
                  }

                  else if (category == label) {
                      let budget = project.year.reduce((projectBudget, year) => {
                        return projectBudget+project.budget[year]
                      },0)
                      totalBudg += budget / donors.length
                      if (!categoryDistinctProjects.includes(project.title)) {
                          categoryDistinctProjects.push(project.title)
                      }
                      if (!categoriesDistinctCountries.includes(project.country)) {
                          categoriesDistinctCountries.push(project.country)
                      }
                  }
              }
              catch (error) {
                  // console.log("no category");
              }
            })
            })
          label = label.value ? label.value : label;
          newEl = {}
          newEl["category"] = label.replace(/,/g, '')
          newEl["budget"] = Math.round(totalBudg)
          newEl["projects"] = categoryDistinctProjects.length
          newEl["countries"] = categoriesDistinctCountries.length
          newEl["type"] = "Donor"

          summaryExport.push(newEl)
        }
      }


      //by sdg,
      goals.sdgs.map((goal) => {
        let distinctProjects = [],
        countries = [],
        totalBudg = 0;
        this.projects.filter((d) => { return d.sdg.includes(goal.value)}).map(project => {
          totalBudg += project.year.reduce((projectBudget, year) => {
            return projectBudget+project.budget[year]
          },0)
          if (!distinctProjects.includes(project.title)) {
            distinctProjects.push(project.title)
          }
          if (!countries.includes(project.country)) {
            countries.push(project.country)
          }
        })
        newEl = {}
        newEl["category"] = "SDG " + goal.title
        newEl["budget"] = totalBudg
        newEl["projects"] = distinctProjects.length
        newEl["countries"] = countries.length
        newEl["type"] = "Recipient"

        summaryExport.push(newEl)
      })
      goals['signature-solutions'].map((goal) => {
        let distinctProjects = [],
        countries = [],
        totalBudg = 0;
        this.projects.filter((d) => { return d.solution.includes(goal.value)}).map(project => {
          totalBudg += project.year.reduce((projectBudget, year) => {
            return projectBudget+project.budget[year]
          },0)
          if (!distinctProjects.includes(project.title)) {
            distinctProjects.push(project.title)
          }
          if (!countries.includes(project.country)) {
            countries.push(project.country)
          }
        })
        newEl = {}
        newEl["category"] = "Signature solution " + goal.title
        newEl["budget"] = totalBudg
        newEl["projects"] = distinctProjects.length
        newEl["countries"] = countries.length
        newEl["type"] = "Recipient"

        summaryExport.push(newEl)
      })
      goals.samoa.map((goal) => {
        let distinctProjects = [],
        countries = [],
        totalBudg = 0;
        this.projects.filter((d) => { return d.samoa.includes(goal.value)}).map(project => {
          totalBudg += project.year.reduce((projectBudget, year) => {
            return projectBudget+project.budget[year]
          },0)
          if (!distinctProjects.includes(project.title)) {
            distinctProjects.push(project.title)
          }
          if (!countries.includes(project.country)) {
            countries.push(project.country)
          }
        })
        newEl = {}
        newEl["category"] = "SAMOA Pathway " + goal.title
        newEl["budget"] = totalBudg
        newEl["projects"] = distinctProjects.length
        newEl["countries"] = countries.length
        newEl["type"] = "Recipient"

        summaryExport.push(newEl)
      })
      return summaryExport;
    },
    exportPDF() {
      window.print();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
