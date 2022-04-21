# SIDS data platform

[Demo](https://sids-dashboard.github.io/SIDSDataPlatform)

## npm commands

#### Project setup
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run serve
```

#### Compiles and minifies for production
```
npm run build
```

#### Lints and fixes files
```
npm run lint
```

#### Start server in testing mode
```
npm run start-server
```

#### Start auto testing
```
npm run ci
```

## Git workflow

                    
```seq
Fork feature branch->Fork staging branch: Pull request (publish to fork pages)
Fork staging branch->Main repo staging branch: Pull request  (publish to main pages)
Main repo staging branch->Main repo production branch: Pull request (publish to data.undp server)
```

## Code base highlites

### Key vendors

####[Vue](https://vuejs.org/)
SPA framework that project built on - version 2 is used.

####[Vueitfy](https://vuetifyjs.com/)
Component library used for moust of the ui. Some default styles are overwriten and can be found in assests/styles folder.

####[d3.js](https://d3js.org/)
Data visualisation library - version 5 is used.

### File structure
+ /assets - static files (images, icons, videos), root styles, fonts, files with root static vatiables (sdg goals, country codes etc)
+ /choro - key self-written vendor,used to generates charts on profiles & MVI views moust of d3 code is here
+ /services/index.js - API calls (backend endpoints, configs and API call functions)
+ /components - reusable vue components shared across different views
+ /views - page components
	+ /views/children - components that used only on this page (e.g. navigations)
+ /store - vuex store
	+ /store/texts.store - text content for tooltips and some of the pages
	+ /store/profiles.store - store used for profiles page
	+ /store/sids.store - store used for portfolio page
	+ /store/indicators.store - store used for MVI & indicators pages
	+ /store/loader.store - page loader state
+ /router - vue router config
+ /gis - gis page vendors with 

## CI/CD

### Automated testing
Automated testing is based on screenshot comparasion made with [percy.io](https://percy.io/) cloud service and [cypress](https://www.cypress.io/) testing framework.

Cypress configuration is in /cypress.json and /cypress/.
Percy configuration can be found on cloud platform.

### Github actions

####publish-to-pages

Triggers on merge to staging, publishes new vesion to github pages of the main repo


####CI-percy

Triggers on pull request to production, makes creenshot comparation of a new and old versions, if there are differences requres approval on percy cloud platform for PR to me merged.

Github secret - PERCY_TOKEN, authorisation token for percy platform

####Publish production to ftp 

Builds project with --production flag and uploads files to the data.undp.org hosting via ftp.

Github secret - FTP_PASSWORD , ftp password.

## Cloud vendors

###[percy.io](https://percy.io/)
Testing tool based on screenshot comparaion

###[Sentry.io](https://Sentry.io/)
Error logging tool, enebled only for [production](data.undp.org/sids) environment
Intialized in /src/main.js file

###[Google analytics](https://analytics.google.com/)
Site analytics tool, initialized in /public/index.html, enebled only for [production](data.undp.org/sids) environment
