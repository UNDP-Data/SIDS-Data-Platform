
///////////////////////////////////
/////Viz Type Select
//////////////////////////////////


$('#vizSelect ul li').click(function () {


    var x = $(this);

    $('.vizShader').stop().animate({
        'width': x.width() + 32,
        'left': x.position().left
    }, 400);

    $('.selectedViz').removeClass('selectedViz');
    $(this).children('a').addClass('selectedViz');
    // console.log(this)



    indicatorCode=indicatorGlobal
    indiSelections={}
    indiSelections["viz"] = $('.selectedViz')[0].innerHTML
    indiSelections["page"] = $('.selectedPage').attr('id')
    indiSelections["sortby"] = $('.selectedSortby')[0].innerHTML
    indiSelections["year"] = "recentValue"
    updateVizEngine(indicatorCode,indiSelections);
    

    if(indiSelections["viz"]=="Bar Chart"||indiSelections["viz"]=="Spider"){
        $("#sortbySelect").show()
        }
        else{
          $("#sortbySelect").hide()
        }
        x = $(".selectedSortby").parent()
        
        $('.sortbyShader').stop().animate({
          'width': x.width() + 32,
          'left': x.position().left,
        }, 400);
        
});


// $('#choroInfoBox').click(function () { convertChoroToBar() })



///////////////////////////////////
/////First click of  mvi or indicators with element loading
//////////////////////////////////


$("#mviTab,#countryDataTab").one("click", function () {
    if (sidsEngineInit == 0) {
        // setTimeout(() => {
            //appendCountryLines();
        
            
            ///this should be in initVizEngine, but it breaks for some reason
            appendCountryTitles()
            appendCountryTitles2();
            appendCountryTitles3();
            appendCountryRectangles();
            appendMultiRectangles();
            appendCountryCircles();
            appendCountryLabels();


            var x = $("#choroLi");

            $('.vizShader').stop().animate({
                'width': x.width() + 32,
                'left': x.position().left
            });

            var x = $("#rankLi")
            $(".sortbyShader").stop().animate({
                'width': x.width() + 32,
                'left': x.position().left
            }, .1);

        // }, .001);
    }
    sidsEngineInit = 1
});

$("#indicatorExport").change(function () {
    // console.log("exporting indicator data")
    newIndicators = []
    for (const [key, value] of Object.entries(indicatorData)) {
        newIndicators.push({ "Country": key, "Value": value })
    }
    // console.log(wdiMeta[indicator].Source)//indicator)

    note = "Indicator: " + wdiMeta[indicator]["Indicator Name"] + ";" + wdiMeta[indicator].Source + "; For the most recent year with data."

    exportCSVFile({ Country: "Country", Value: "Value" }, newIndicators, "indicator_data", note.replace(/,/g, ''))

    $("#indicatorExport").val("export")

}) //download(filteredProjects); });


$('#sortbySelect ul li').click(function () {
    var x = $(this);

    $('.sortbyShader').stop().animate({
        'width': x.width() + 32,
        'left': x.position().left
    }, 400);

    $('.selectedSortby').removeClass('selectedSortby');
    $(this).children('a').addClass('selectedSortby');
    // console.log(this)

    indicatorCode=indicatorGlobal
    indiSelections={}
    indiSelections["viz"] = $('.selectedViz')[0].innerHTML
    indiSelections["page"] = $('.selectedPage').attr('id')
    indiSelections["sortby"] = $('.selectedSortby')[0].innerHTML
    indiSelections["year"] = "recentValue"
    updateVizEngine(indicatorCode,indiSelections);

})



////////
// Development Indicators tab
//////////////

$("#countryDataTab").on("click", function () {
    $("#infoLi").hide()
    $(".mdl-tabs__tab").removeClass("selectedPage")
    $(this).addClass("selectedPage")

    $("#mviCustomSelectBox").css("display", "none");
    // $("#customSpider").css("display", "none")

    $('#choroLiLi').text("Choropleth")

    d3.select("#regionLegend").style("height", 42)


    ///temp fix to set timeout. need to figure out why this has a bug, when switching from country profiles to vulnerability

    setTimeout(function () {
       // $(".selectedViz").trigger("click")

        x = $(".selectedViz").parent()
        $('.vizShader').stop().animate({
            'width': x.width() + 32,
            'left': x.position().left,
        }, 400);
    }, .01)

    $("#countryDataTitle").text("SIDS Development Indicators")

   // updateBarAxis();
})



////////
// MVI tab
//////////////


$("#mviTab").click(function () {

    //++ swap menu out
    //++ change tab title and class

    $("#countryDataTitle").text("Towards a Multidimensional Vulnerability Index")
    
    indexCode="mvi-mvi"
    indexSelections={}
    indexSelections["viz"] = $('.selectedViz')[0].innerHTML
    indexSelections["page"] = $('.selectedPage').attr('id')
    indexSelections["sortby"] = $('.selectedSortby')[0].innerHTML
    indexSelections["year"] = "recentValue"

    updateVizEngine(indexCode,indexSelections) //same function as if you were to select an index



    // $("#infoLi").show()
    // $(".mdl-tabs__tab").removeClass("selectedPage")
    // $(this).addClass("selectedPage")

    // // $("#choroInfoBox").css("display", "none");
    // // $("#mviCustomSelectBox").css("display", "block");


    // d3.select("#regionLegend").style("height", 0)///remove? and these next two lines
    // // d3.select("#regionLegend").transition().duration(1000).style("height",0)
    // // d3.select("#choro_legend_container").transition().duration(1000).style("height",0)

   
    // $('#choroLiLi').text("Spider")

    // // selectedViz = $('.selectedViz')[0].innerHTML
    // // if (selectedViz == "Spider") {
    // //     $("#customSpider").css("display", "block")
    // // }
    // // else {
    // //     $("#customSpider").css("display", "none")
    // // }

    // ///temp fix to set timeout. need to maek happen after loaded
    // setTimeout(function () {
    //     $(".selectedViz").trigger("click")
    //     var x = $(".selectedMviPreset")
    //     $(".mviPresetShader").stop().animate({
    //         'width': x.width() + 32,
    //         'left': x.position().left
    //     }, 400);
    // }, .01)


});

////////
//MVI Preset
//////////////


$("#mviPresetSelect ul li").click(function () {
    var x = $(this);
  
    $(".mviPresetShader")
      .stop()
      .animate(
        {
          width: x.width() + 32,
          left: x.position().left,
        },
        400
      );
  
    $(".selectedMviPreset").removeClass("selectedMviPreset");
    $(this).addClass("selectedMviPreset");
    // console.log(this)
  
    selectedMviPreset = this.id;
    console.log(selectedMviPreset);
  
    const cbs = document.querySelectorAll('input[name="mviIndicator"]');
  
    if (selectedMviPreset == "mviLi") {
      cbs.forEach((cb) => {
        cb.checked = true;
      });
    } else if (selectedMviPreset == "eviLi") {
      cbs.forEach((cb) => {
        if (presetDict["evi"].includes(cb.id)) cb.checked = true;
        else {
          cb.checked = false;
        }
      });
    }
  
  
    indexSelections={}
    indexSelections["viz"] = $('.selectedViz')[0].innerHTML
    indexSelections["page"] = $('.selectedPage').attr('id')
    indexSelections["sortby"] = $('.selectedSortby')[0].innerHTML
    indexSelections["year"] = "recentValue"

///add selectedMviPreset to indiSelections

    updateIndexEngine(indexCode,indexSelections) //same function as if you were to select an index

  });