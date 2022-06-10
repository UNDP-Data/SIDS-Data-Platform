import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueI18n from 'vue-i18n'


import * as Sentry from "@sentry/vue";
import { BrowserTracing } from "@sentry/tracing";

import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import 'flag-icon-css/css/flag-icons.css';

if(process.env.NODE_ENV === 'production') {
  Sentry.init({
    Vue,
    dsn: "https://f0106440f0b54e72a1dc96cb8828553a@o1141689.ingest.sentry.io/6200357",
    integrations: [
      new BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          tracingOrigins: ["data.undp.org", /^\//],
      }),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

Vue.config.productionTip = process.env.NODE_ENV === 'production';

Vue.use(VueI18n);

let i18n = new VueI18n({
  locale: 'en', // set locale
  fallbackLocale: 'en',
  messages:{
    en: {
      navigation: {
        portfolio: 'UNDP SIDS Portfolio',
        indicators: 'Development Indicators',
        mvi: 'Vulnerability',
        profiles: 'Country Profiles',
        gis: 'Geospatial Data',
        about: 'About'
      },
      countryNames: {

      }
      root: {
        noData: 'No Data',
        link: 'Link',
        source: 'Source',
        header: {
          header: ['Data Platform', 'for the', 'SMALL ISLAND DEVELOPING STATES'],
          description:'UNDP’s integrated approach supports Small Island Developing States to accelerate transformative development based on three pillars: Climate Action, Blue Economy, and Digital Transformation.'
        },
        footer: {
          poweredBy:'Powered by the UNDP Data Futures Platform'
        },
        buttons: {
          export: 'export',
          about: 'about this'
        },
        forms: {
          selectCountries: 'Select countries',
          years: 'Years',
          region: 'Region'
        },
        goals: {
          samoa: 'SAMOA Pathway',
          sdgs: 'Sustainable Development Goals',
          'signature-solutions': 'Signature solutions'
        },
        samoa: {
          eGrowth: {
            name: "Sustainable, inclusive and equitable economic growth",
            title: "1. Sustained and sustainable, inclusive and equitable economic growth with decent work for all",
            content: "To support SIDS to achieve sustained, inclusive and equitable growth with full and productive employment, social protection and the creation of decent work for all.",
          },
          clChange: {
            name: "Climate Change",
            title: "2. Climate Change",
            content: "To help SIDS with climate adaptation, including persistent drought and extreme weather events, sea-level rise, coastal erosion and ocean acidification.",
          },
          susEnegy: {
            name: "Sustainable Energy",
            title: "3. Sustainable Energy",
            content: "To address challenges in accessing sustainable energy in the SIDS including enhanced accessibility to modern energy services, energy efficiency and use of economically viable and environmentally sound technology",
          },
          disaster: {
            name: "Disaster Risk Reduction",
            title: "4. Disaster risk reduction",
            content: "To address the critical need to build resilience, strengthen monitoring and prevention, reduce vulnerability, raise awareness and increase preparedness to respond to and recover from disasters in SIDS",
          },
          oceans: {
            name: "Oceans and Seas",
            title: "5. Oceans and seas",
            content: "To support healthy, productive and resilient oceans and coasts are critical for, inter alia, poverty eradication, access to sufficient, safe and nutritious food, livelihoods, economic development, essential ecosystem services, and identity and culture in SIDS.",
          },
          food: {
            name: "Food Security and Nutrition",
            title: "6. Food security and nutrition",
            content: "To support the right to have access to safe, sufficient and nutritious food, the eradication of hunger and the provision of livelihoods while conserving, protecting and ensuring the sustainable use of land, soil, forests, water, plants and animals, biodiversity and ecosystems.",
          },
          water: {
            name: "Water and Sanitation",
            title: "7. Water and sanitation",
            content: "To support the efforts of small island developing States to develop capacities for the effective, inclusive and sustainable implementation of the integrated management of water resources and related ecosystems",
          },
          transport: {
            name: "Sustainable Transportation",
            title: "8. Sustainable transportation",
            content: "To support SIDS to gain access to environmentally sound, safe, affordable, sustainable and well-maintained transportation",
          },
          production: {
            name: "Sustainable Consumption and Production",
            title: "9. Sustainable consumption and production",
            content: "To support SIDS on sustainable consumption and production patterns to advance sustainable consumption and production, with an emphasis on MSMEs, sustainable tourism, waste management, food and nutrition, lifestyles, and rural supply chains.",
          },
          waste: {
            name: "Chemical and Waste management",
            title: "10. Management of chemicals and waste, including hazardous waste",
            content: "To support SIDS in sound management of chemicals throughout their life cycle and of waste is crucial for the protection of human health and the environment",
          },
          health: {
            name: "Health and NCDs",
            title: "11. Health and non-communicable diseases",
            content: "To support prevention, treatment, care, and education in health as well as support the national actions of SIDS in addressing communicable and non-communicable diseases.",
          },
          gender: {
            name: "Gender Equality",
            title: "12. Gender Equality and women’s empowerment",
            content: "To support gender equality and women’s empowerment and the full realization of human rights for women and girls have a transformative and multiplier effect on sustainable development and is a driver of economic growth in SIDS.",
          },
          socialDevelopment: {
            name: "Social Development",
            title: "13. Social Development",
            content: "To support efforts to enhance social protection and inclusion, to improve well-being and to guarantee opportunities for the most vulnerable and disadvantaged to have equal access to education, health, food, water and sanitation, and productive resources.",
          },
          biodiversity: {
            name: "Biodiversity",
            title: "14. Biodiversity",
            content:  "To suport the conservation and sustainable use of biodiversity, as well as their access to and the fair and equitable sharing of benefits arising from the utilization of genetic resources, with the vision of living in harmony with nature",
          },
          invasiveSpecies: {
            name: "Invasive species",
            title: "15. Invasive alien species",
            content: "To help multisectoral collaboration in SIDS to address invasive alien species in order to protect biodiversity and livelihoods, preserve and maintain ocean resources and ecosystem resiliency, and enhance food security and adapt to climate change",
          },
          meansOfImplementation: {
            name: "Means of Implementation",
            title: "16. Means of implementation, including partnerships",
            content: "To support SIDS in enhanced global partnership for development, adequate provision and mobilization of all means of implementation and continued international support to achieve internationally agreed goals.",
          }
        },
        sdgs: {
          poverty: {
            name: "No poverty",
            title: "Goal 1 - No Poverty",
            content: "To end poverty in all its forms, everywhere, through a powerful commitment to leave no one behind and to reach those fathest behind first.",
          },
          hunger: {
            name: "Zero hunger",
            title: "Goal 2 - Zero Hunger",
            content: "To end hunger, achieve food security and improve nutrition and promote sustainable agriculture.",
          },
          health: {
            name: "Good health and well-being",
            title: "Goal 3 - Good Health and Well-Being",
            content: "To ensure healthy lives and promote well-being for all at all ages.",
          },
          education: {
            name: "Quality education",
            title: "Goal 4 - Quality Education",
            content: "To ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.",
          },
          gender: {
            name: "Gender equality",
            title: "Goal 5 - Gender Equality",
            content: "To achieve gender equality and empower all women and girls.",
          },
          water: {
            name: "Clean water and sanitation",
            title: "Goal 6 - Clean Water and Sanitation",
            content: "To ensure availability and sustainable management of water and sanitation for all.",
          },
          energy: {
            name: "Affordable and clean energy",
            title: "Goal 7 - Affordable and Clean Energy",
            content: "To ensure access to affordable, reliable, sustainable and modern energy for all.",
          },
          growth: {
            name: "Decent work and economic growth",
            title: "Goal 8 - Decent Work and Economic Growth",
            content: "To foster sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.",
          },
          industry: {
            name: "Industry, innovation and infrastructure",
            title: "Goal 9 - Industry, Innovation, and Infrastructure",
            content: "To build resilient infrastructure, promote inclusive and sustainable industrialization, and foster innovation",
          },
          inequality: {
            name: "Reduced inequalities",
            title: "Goal 10 - Reduced Inequality",
            content: "To reduce income inequality within and among countries.",
          },
          cities: {
            name: "Sustainable cities and communities",
            title: "Goal 11 - Sustainable cities and communities",
            content: "To make cities and human settlements inclusive, safe, resilient, and sustainable.",
          },
          consumption: {
            name: "Responsible consumption and production",
            title: "Goal 12 - Responsible consumption and production",
            content: "To ensure sustainable consumption and production patterns",
          },
          climate: {
            name: "Climate action",
            title: "Goal 13 - Climate Action",
            content: "To take urgent action to combat climate change and its impacts by regulating emissions and promoting developments in renewable energy",
          },
          marineLife: {
            name: "Life below water",
            title: "Goal 14 - Life Below Water",
            content: "To conserve and sustainably use the oceans, seas and marine resources for sustainable development.",
          },
          landLife: {
            name: "Life on Land",
            title: "Goal 15 - Life on Land",
            content: "To protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss",
          },
          peace: {
            name: "Peace, justice, and strong institutions",
            title: "Goal 16 - Peace, justice and strong institutions",
            content: "To promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.",
          },
          partnerships: {
            name: "Partnerships for the goals",
            title: "Goal 17 - Partnership for the goals",
            content: "To strengthen the means of implementation and revitalize the global partnership for sustainable development."
          }
        },
        'signature-solutions': {
          poverty: {
            name: "Keeping people out of poverty",
            title: "Keeping people out of poverty",
          },
          governance: {
            name: "Strengthen effective, inclusive and accountable governance",
            title: "Strengthen effective, inclusive and accountable governance",
          },
          prevention: {
            name: "Enhance national prevention and recovery capacities for resilient societies",
            title: "Enhance national prevention and recovery capacities for resilient societies",
          },
          solutions: {
            name: "Promote nature-based solutions for a sustainable planet",
            title: "Promote nature-based solutions for a sustainable planet",
          },
          energy: {
            name: "Close the energy gap",
            title: "Close the energy gap",
          },
          equality: {
            name: "Strenghten gender equality and the empowerment of women and girls",
            title: "Strenghten gender equality and the empowerment of women and girls",
          }
        },
        pillars: {
          blueEconomy: {
            name: "Blue Economy",
            content: "Harnessing the blue economy through an integrated approach rooted in sustainable finance and development.",
          },
          climateAction: {
            name: "Climate Action",
            content: "Promoting decarbonized and resilient societies through scaled up climate action and enhanced efforts to mobilize climate finance.",
          },
          digitalTransformation: {
            name: "Digital transformation",
            content: "Accelerating digital transformation through a whole-of-society approach that puts people at the centre for inclusive societies and resilient economies.",
          },
        },
      },
      portfolio: {
        header: 'UNDP Portfolio in Small Island Developing States',
        fundingCategories: 'Funding categories',
        fundingSources: 'Funding sources',
        chips:{
          sidsWithProjects:'SIDS with UNDP Projects',
          unMembsers: 'UN Member States',
          projects: 'UNDP Projects',
          funding: 'Total Project Funding'
        },
        yearsAll: '2012 to 2021',
        projects: 'Projects',
        allSources: 'All Funding Sources',
        fundingTypes: {
          all: 'All',
          eu: 'European Union',
          donors: 'Donor Countries',
          programmeCountries: 'Programme Countries',
          unAcgencies: 'UN Agencies',
          unFunds: 'UN Pooled Funds',
          verticalFunds: 'Vertical Funds',
          other: 'Other'
        },
        budget: 'Budget',
        share: 'Share',
        projectTitle: 'Project title'
      },
      countryProfile: {
        header: 'Country profile',
        allSids: 'All SIDS',
        infoBox: {
          region: 'Region'.
          office: 'Country Office',
          memberState: 'Member State (Y/N)',
          population: 'Population',
          lang: 'Official Language',
          area: 'Surface Area',
          income: 'Income Classification',
          incomeLowMiddle: 'Lower-middle income',
          incomeHigh: 'High income',
          incomeUpMiddle: 'Upper-middle income',
          hdi: 'Human Development Index',
          hdiHigh: 'High human development',
          hdiMedium: 'Medium human development',
          hdiLow: 'Low human development',
          gini: 'Gini Index',
          countryPage: 'Country Page',
          overlayCountries: 'Overlay countries to compare indicator rank',
          among: 'among',
          sidsCountires: 'SIDS countries',
          globally: 'Globally',
          regionally: 'Regionally',
          radarAnnotation: 'Values for radar charts for each of the pillars of the SIDS Offer are displayed by rank among All SIDS countries for visualization purposes'
        },
      },
      gis: {
        legend: {
          noData: 'No Data for this Region',
          selectDataset: 'Select a Datasets and Layers to view data on the map.',
          x: 'X axis',
          y: 'Y axis'
        },
        controller: {
          rightDataset: 'Right Dataset',
          secondDataset: 'Second Dataset',
          rightLayer: 'Right Layer',
          secondLayer: 'Second Layer',
          leftLayer: 'Left Layer',
          firstLayer: 'First Layer',
          layer: 'Layer',
          leftDataset: 'Left Dataset',
          firstDataset: 'First Dataset',
          dataset: 'Dataset'
        },
        toolbar: {
          pageName: 'SIDS Geospatial Platform',
          dataReference: 'Reference',
          defaultMessage: 'This map visualizes data for the SIDS at different resolutions. Select a dataset above or a country to view spatial data about that region.',
          mode3d: ['3D mode', ' - Visualize data values using 3-dimensional'],
          boundary: ['Boundaries', ' - Toggles the display of administrative boundaries.'],
          basemap: ['Change Basemap', ' - Switch between Satellite Imagery and abstract map themes'],
          satellite: 'Satellite Imagery',
          light: 'Light Theme',
          dark: 'Dark Theme',
          bivar: ['Bivariate Mode',' - Show the relationships between two datasets'],
          color: ['Color scheme', ' - Change between several color palettes for the displayed data'],
          countrySelect: ['Country Select', ' - Focus map on the country or region of interest'],
          comparison: ['Comparison', ' - Enable a draggable slider to visually compare datasets'],
          labels: ['Map Labels', ' - Toggle On/Off labels (Towns, roads, etc.)'],
          opacity: ['Opacity', ' - Change data layers\' opacity'],
          regionalAnalysis: ['Regional Analysis',' - Draw an area of interest to compute statistics for the region'],
          resolution: ['Resolution',' - Choose different level of aggregation of the data layer.'],
          hexbins: 'Hexbins',
          administrativeRegions: 'Administrative regions',
          level1: 'Level 1',
          level2: 'Level 2',
          value: 'Value',
          class: 'Class',
          firstValue: 'First value',
          firstValue: 'First value',
          regionalStatistics: 'Regional statistics',
          mean: 'Mean'
        }
      }
      indicators: {
        tabs: {
          spider : 'Spider',
          bars: 'Bar Chart',
          global: 'Global view',
          series: 'Time Series',
          choro: 'Choropleth'
        },
        forms: {
          chartType: 'Chart type',
          indicator: 'Indicator',
          dimension: 'Dimension',
          region: 'Region',
          recent:'Recent value'
        },
        filters: {
          rank: 'Rank',
          region: 'Region'
        },
        mvi: {
          environmental:'Environmental',
          disasters:'Victims of Disasters',
          agricultureFishing:'Agriculture and Fishing (% of GDP)',
          geographic:'Geographic',
          remoteness:'Remoteness',
          drylands:'Population in Drylands',
          coastalZones:'% Population in Coastal Zones',
          economic:'Economic',
          exportConcentration:'Export Concentration',
          exportInstability:'Export Instability',
          agriculturalInstability:'Agricultural Instability',
          financial:'Financial',
          tourismRevenue:'Tourism Revenue (% of Exports)',
          remittances:'Remittances (% of GDP)',
          fdiInflows:'FDI Inflows (% of GDP)'
        }
      }
      about: {
        header: 'About the SIDS Data Platform',
        whatSids: 'What are Small Island Developing States?',
        whatSidsContent: [
          'Small Island Developing States (SIDS)',
          'are a distinct group of 38 UN Member States and 20 Non-UN Members/Associate Members of United Nations regional commissions that face unique social, economic and environmental vulnerabilities. The three geographical regions in which SIDS are located are: the Caribbean, the Pacific, and the Atlantic, Indian Ocean and South China Sea (AIS).',
          'SIDS were recognized as a special case both for their environment and development at the 1992 United Nations Conference on Environment and Development held in Rio de Janeiro, Brazil.',
          'The aggregate population of all the SIDS is 65 million, slightly less than 1% of the world’s population, yet this group faces unique social, economic, and environmental challenges.',
          'SIDS face a host of challenges including, for many, their remote geography. As a result, many SIDS face high import and export costs for goods as well as irregular international traffic volumes. Yet, they must rely on external markets for many goods due to the narrow resource base.'
        ],
        whatOffer: 'What is UNDP\'s SIDS Offer?',
        whatOfferContent: [
          'UNDP’s SIDS offer –',
          'Rising Up for SIDS',
          '– presents an integrated approach for tapping into areas with potential to accelerate green recovery and transform societies based on three interconnected pillars: Climate Action, Blue Economy and Digital Transformation. The offer responds to the ambitions and demands SIDS expressed during the 2019 midterm review of the S.A.M.O.A. Pathway. It includes measures strengthening UNDP’s programmatic engagement, increasing our ability to respond to urgent challenges and enhancing organizational agility.',
          'Climate Action',
          '- Promoting decarbonized and resilient societies through scaled up climate action and enhanced efforts to mobilize climate finance.</p>',
          'Blue Economy',
          '- Harnessing the blue economy through an integrated approach rooted in sustainable finance and development.</p>',
          'Digital Transformation',
          '- Accelerating digital transformation through a whole-of-society approach that puts people at the centre for inclusive societies and resilient economies.',
          'Financing for Development',
          '- Supporting SIDS to mobilize financing for development by seizing finance innovation opportunities such as: blue finance solutions, risk insurance, catalysing private sector investment and leveraging domestic resource mobilization.'
        ],
        whatPlatform: 'What is the SIDS Data Platform?',
        whatPlatformContent: 'The UNDP Data Platform for Small Island Developing States, a digital tool for accelerating development in SIDS by providing policymakers, research institutions, and country offices with access to updated, standardized, and comprehensive data. As a central component of the UNDP’s SIDS Offer, the visualization and analytics features of this platform will help SIDS to respond to the SAMOA Pathway and the 2030 agenda by rising up to the urgent challenges of climate change and their green and blue transition. By focusing on the needs of SIDS, this tool has been designed specifically to feature datasets about Digital Transformation, Blue Economy, and Climate Action.  There are three main types of data within the SIDS data platform, including data on the UNDP portfolio of projects and investment in SIDS, country-level development indicators, and geospatial data. For each data type we have developed interfaces within the platform to visualize, analyze, and export these data.',
        whatSources:'What are the sources of data used?',
        whatSourcesContent:'The SIDS data platform uses all publicly available datasets from a broad base of partner agencies and research publications. This includes data from the World Bank, WHO, UNICEF, UNDESA, IRENA, ITU, IGRAC, IHME, FAO, UNCTAD, UNDESA, Yale, CIESIN, OECD, UNWTO, ILO, and many additional sources. All citations are provided with the corresponding dataset within the platform. We have strived to curate the data in order to feature reliable, accurate and comprehensive information.',
        whatFuture: 'What are the future stages of development for this data platform?',
        whatFutureContent: 'The current phase has been focused on the aggregation and visualization of publicly available development-related datasets in SIDS to support policymaking and to provide an opportunity for international, regional, and sub-regional SIDS-SIDS collaboration. In our next phase, we intend to use these collated datasets to build analysis tools that identify trends and generate insights specifically focused on the developmental challenges and solutions relevant for SIDS.',
        whatContact:'Who should I contact to learn more?',
        whatContactContent:[
          'To learn more about UNDP’s SIDS Offer, please visit our',
          'SparkBlue page',
          'For questions about UNDP’s SIDS Offer, “Rising up for SIDS”, please contact:',
          'Riad Meddeb',
          'Senior Principal Advisor for SIDS',
          'Ines Benabdallah',
          'Programme Officer, SIDS',
          'For technical questions about the platform please contact',
          'Benjamin Keller' ]
      }
    }
  }
})

new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
