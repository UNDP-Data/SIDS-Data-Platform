import { mapState } from 'vuex';
import sidsList from '@/assets/sidsList'

export default {
  computed: {
    ...mapState({
      SIDSDataWithDonors: state => state.sids.SIDSDataWithDonors,
    })
  },
  methods: {
    checkProjectsCategory(project, donor) {
      if(this.fundingCategory === 'Programme Countries') {
        if(donor.category === 'Government' && project.country) {
          let country = sidsList.find(country => {
            return project.country === country.iso
          })
          return country && country.name === donor.subCategory;
        }
      }
      else if(this.fundingCategory === 'Donor Countries') {
        return project.country  != donor.subCategory;
      }
      else {
        return donor.category === this.fundingCategory;
      }
    }
  }
}
