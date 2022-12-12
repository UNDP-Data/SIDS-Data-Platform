export default {
  methods: {
    getProjectFundning(project) {
        return project.year.reduce((b, yb) => {return b + project.budget[yb]}, 0);
    },
    computeYearString(yearsArr) {
      return yearsArr.reduce((str, year, index) => {
        if(index === 0) {
          str+=year;
          return str;
        }
        if(year-1 === yearsArr[index-1]) {
          str = str.replace(` - ${year-1}`,'')
          str+= ` - ${year}`
        } else {
          str+= `, ${year}`
        }
        return str;
      },'')
    },
  }
}
