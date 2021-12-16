///////////////////////
//////Data Processing function
//////////////////////////////////////


function processVizElementAttributes(selectedViz,selectedYear,selectedSortby,selectedIndicator){
    vizPositions={}
    vizColors={}
    vizSizes={}
    vizOpacities={}

    // if(selectedViz=="Bivariate View"){}
    if(selectedViz=="Spider"){}
    if(selectedViz=="Bar Chart"){}
    if(selectedViz=="Global View"){}
    if(selectedViz=="Choropleth"){

    ///rectangle 0
    vizPositions={}
    vizColors={}
    vizSizes={}
    vizOpacities={}
    ///rectangles 1-4
    vizPositions={}
    vizColors={}
    vizSizes={}
    vizOpacities={}
    ///circles
    vizPositions={}
    vizColors={}
    vizSizes={}
    vizOpacities={}
    ///titles1
    vizPositions={}
    vizColors={}
    vizSizes={}
    vizOpacities={}
    ///titles2
    vizPositions={}
    vizColors={}
    vizSizes={}
    vizOpacities={}
    ///countrysvgs
    vizPositions={}
    vizColors={}
    vizSizes={}
    vizOpacities={}
    ///lines (skip for now)
    vizPositions={}
    vizColors={}
    vizSizes={}
    vizOpacities={}
    ///x-axis
    vizPositions={}
    vizColors={}
    vizSizes={}
    vizOpacities={}
    ///y-axis
    vizPositions={}
    vizColors={}
    vizSizes={}
    vizOpacities={}
    ///regionTitles
    vizPositions={}
    vizColors={}
    vizSizes={}
    vizOpacities={}
    ///choroLegend

    }

    vizElementAttributes={
        'vizPositions':vizPositions,
        'vizColors':vizColors,
        'vizSizes':vizSizes,
        'vizOpacities':vizOpacities
    }
    return vizElementAttributes;

}