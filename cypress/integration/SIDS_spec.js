describe('SIDS pages', function() {
  beforeEach(function() {
    // Load our app before starting each test case
    cy.visit('localhost:8080')
  })

  it('Loads the SIDS app', function() {
    cy.get('.sdg-goal', { timeout: 15000 }).should('exist')
    cy.percySnapshot('prtfolio')
  })

  it('Loads the about', function() {
    // Load the page or perform any other interactions with the app.
    cy.visit('localhost:8080/about');
    cy.get('.v-expansion-panel', { timeout: 15000 }).should('exist')
    // Take a snapshot for visual diffing
    cy.percySnapshot('about');
  });

  it('Loads the indicator page', function() {
    // Load the page or perform any other interactions with the app.
    cy.visit('http://localhost:8080/development-indicators');
    cy.get('.choroMap', { timeout: 15000 }).should('exist')
    // Take a snapshot for visual diffing
    cy.percySnapshot('indicators');
  });

  it('Loads the indicator bars', function() {
    // Load the page or perform any other interactions with the app.
    cy.visit('http://localhost:8080/development-indicators/hdr-185106/recentValue/bars');
    cy.get('.choroRect', { timeout: 15000 }).should('exist')
    // Take a snapshot for visual diffing
    cy.percySnapshot('bars');
  });

  it('Loads the mvi', function() {
    // Load the page or perform any other interactions with the app.
    cy.visit('http://localhost:8080/vulnerability');
    cy.get('.radarArea', { timeout: 15000 }).should('exist')
    // Take a snapshot for visual diffing
    cy.percySnapshot('mvi');
  });

  it('Loads the profiles', function() {
    // Load the page or perform any other interactions with the app.
    cy.visit('http://localhost:8080/country-profiles');
    cy.get('.desc-spiders', { timeout: 15000 }).should('exist')
    // Take a snapshot for visual diffing
    cy.percySnapshot('profiles');
  });

  it('Loads the gis', function() {
    // Load the page or perform any other interactions with the app.
    cy.visit('http://localhost:8080/geospatial-data');
    cy.get('.mapboxgl-canvas', { timeout: 25000 }).should('exist')
    // Take a snapshot for visual diffing
    cy.percySnapshot('gis');
  });
})
