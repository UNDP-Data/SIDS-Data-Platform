describe('SIDS pages', function() {
  beforeEach(function() {
    // Load our app before starting each test case
    cy.visit('http://localhost:8080')
  })

  it('Loads the SIDS app', function() {
    cy.wait(60000)
    cy.get('.sdg-goal').should('exist')
    cy.percySnapshot('prtfolio')
  })

  it('Loads the about', function() {
    // Load the page or perform any other interactions with the app.
    cy.visit('http://localhost:8080/about');
    cy.wait(60000)
    cy.get('.v-expansion-panel').should('exist')
    // Take a snapshot for visual diffing
    cy.percySnapshot('about');
  });

  it('Loads the indicator page', function() {
    // Load the page or perform any other interactions with the app.
    cy.visit('http://localhost:8080/development-indicators');
    cy.wait(60000)
    cy.get('.choroMap').should('exist')
    // Take a snapshot for visual diffing
    cy.percySnapshot('indicators');
  });

  it('Loads the indicator bars', function() {
    // Load the page or perform any other interactions with the app.
    cy.visit('http://localhost:8080/development-indicators/hdr-185106/recentValue/bars');
    cy.wait(60000)
    cy.get('.choroRect').should('exist')
    // Take a snapshot for visual diffing
    cy.percySnapshot('bars');
  });

  it('Loads the mvi', function() {
    // Load the page or perform any other interactions with the app.
    cy.visit('http://localhost:8080/vulnerability');
    cy.wait(60000)
    cy.get('.radarArea').should('exist')
    // Take a snapshot for visual diffing
    cy.percySnapshot('mvi');
  });

  it('Loads the profiles', function() {
    // Load the page or perform any other interactions with the app.
    cy.visit('http://localhost:8080/country-profiles');
    cy.wait(60000)
    cy.get('.desc-spiders').should('exist')
    // Take a snapshot for visual diffing
    cy.percySnapshot('profiles');
  });

  it('Loads the gis', function() {
    // Load the page or perform any other interactions with the app.
    cy.visit('http://localhost:8080/geospatial-data');
    cy.wait(60000)
    cy.get('.mapboxgl-canvas').should('exist')
    // Take a snapshot for visual diffing
    cy.percySnapshot('gis');
  });
})
