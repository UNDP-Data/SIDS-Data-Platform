// This color library includes the color ramps used in UNDP SIDS Geospatial Dashboard.

// Please generally assign each data topic with a unique color scheme 
//     considering its data type (qualitative, sequential, diverging),
//     and in most cases associate dark color with high values, vice versa.

// If possible, avoid red-green combination for colorblind-friendly design.

// Recommended resource for single color scheme choices: https://colorbrewer2.org/
// Examples of bi-variate color scheme choices: https://nowosad.github.io/post/cbc-bp2/


// TYPE 1-3: Basic Type (Qualitative, Sequential, Diverging)
// TYPE 4-5: Bivariate Type (3*3, 4*4)
// TYPE 6: Special Type

// ----------------------------------------------
// TYPE 1: Qualitative / Categorical Color Ramps 
var colorQual = {

    'light5':['#b3e2cd','#fdcdac','#cbd5e8','#f4cae4','#e6f5c9'], // 5 light colors: green, orange, blue, pink, yellow-green    
    'dark5':['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00'], // 5 light colors: red, blue, green, purple, orange
};

// ------------------------------
// TYPE 2: Sequential Color Ramps (Low to High)
var colorSeq = {       

    // single hue    
    'green':['#edf8fb', '#b2e2e2', '#66c2a4', '#2ca25f', '#006d2c'],  // light -> dark green
    'purple':['#f2f0f7', '#cbc9e2', '#9e9ac8', '#756bb1', '#54278f'], // light -> dark purple
    'orange':['#ffffd4', '#fed98e', '#fe9929', '#d95f0e', '#993404'], // light -> dark orange
    'pop':['#feebe2', '#fbb4b9', '#f768a1', '#c51b8a', '#7a0177'],    // light -> dark pink
    'newSun':['#FEF65C', '#FEE745', '#FFD82F', '#FFC918', '#FFBA01'], // light -> dark yellow
    'blues':['#ABD7EC', '#59C1E8', '#3585DA', '#1061B0', '#003C72'],  // light -> dark blue
    'silvers':['#BEBEBE','#AFAFAF', '#9F9F9F', '#909090', '#808080'], // light -> dark black

    // gray to color
    'combo':['#fdfbf6', '#FEE745', '#FFD82F', '#FFC918', '#FFBA01'], // white -> dark yellow
    'pinkish':['#f8eff1', '#f1d2d4', '#e7a9b1', '#c65e6a', '#af3039'], // white -> red   

    // multiple hues
    'yellow-blue':chroma.scale(['#fafa6e', '#2A4858']).mode('lch').colors(5), // yellow -> dark blue
    'colorBlindGreen': ["#ffffcc","#c2e699","#78c679","#31a354","#006837"],   // yellow -> drak green

    // TO-BE-MODIFIED
    'ocean':['#08519c', '#3182bd', '#6baed6', '#bdd7e7', '#eff3ff'],    // dark -> light blue (Atlas: move to the TYPE 6)
    'sunIndex':['#fdfbf6', '#FAE7B9', '#FAE39B', '#FADE7C', '#FADA5E'], // light -> dark yellow (Atlas: too similar; consider others instead)
    'minty':['#aaf0d1', '#96e6c2', '#7dd8b5', '#5ec69d', '#3eb489']     // light -> dark green (Atlas: too similar; consider others instead)
};
 
// -----------------------------
// TYPE 3: Diverging Color Ramps (Low to High)
// Note: only the variables with a meaningful midpoint of range should be considered in this type.
var colorDiv = {
    
    'red-blue':['#ca0020', '#f4a582', '#f7f7f7', '#92c5de', '#0571b0'], // red -> white -> blue
    'blue-red':['#0571b0', '#92c5de', '#f7f7f7', '#f4a582', '#ca0020'], // blue -> white -> red

    // TO-BE-MODIFIED
    'gdpColor':['#ca0020', '#f4a582', '#f7f7f7', '#92c5de', '#0571b0'], // red -> white -> blue (Atlas: use sequential color for GDP)
};

// -----------------------------------
// TYPE 4: 3*3 Bi-Variate Color Ramps (Base type: Qual/Seq/Div)

var colorQualQual3 = {

};
var colorQualSeq3 = {

};
var colorQualDiv3 = {

};
var colorSeqSeq3 = {
    'blue-red-brown':[
        '#e8e8e8', '#e4acac', '#c85a5a', // white -> red
        '#b0d5df', '#ad9ea5', '#985356',
        '#64acbe', '#627f8c', '#574249'],// blue -> brown
    'blue-pink-purple':[
        '#e8e8e8', '#d9aeca', '#c974ad', // white -> pink
        '#aecbd9', '#9f91bb', '#8f579d',
        '#74adc9', '#6573ab', '#55398e'],// blue -> purple
};
var colorSeqDiv3 = {

};
var colorDivDiv3 = {

};

// -----------------------------------
// TYPE 5: 4*4 Bi-Variate Color Ramps (Base type: Qual/Seq/Div)

var colorQualQual4 = {

};

var colorQualSeq4 = {

};

var colorQualDiv4 = {

};

var colorSeqSeq4 = {

};

var colorSeqDiv4 = {

};

var colorDivDiv4 = {

};

// -----------------------------------
// TYPE 6: Special Color Ramps
var colorNaturalFeature = {
    'elevation':[],
    'ocean-depth':['#08519c', '#3182bd', '#6baed6', '#bdd7e7', '#eff3ff'], // dark -> light blue (Atlas: move to the TYPE 6)
};
