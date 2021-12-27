var allKeyData;

console.time();

keyIndicatorPopperInstance = new Array();

var photoLinks = []
$.getJSON('https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/photoLinks.json', function (dat) {
	//console.log(dat);
	photoLinks.push(dat);
	// // photoLinks=data2;
	//	console.log(photoLinks);
	//console.timeLog()
})

var metadata = []
$.getJSON("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/keyMetadata.json", function (dat) {
	metadata.push(dat);
	//console.timeLog()
	//console.log(metadata[0])
});

fetch("https://raw.githubusercontent.com/Ben-Keller/smallislands/main/data/exports/allKeyData.json")
	.then(res => res.json())
	.then(data => allKeyData=data)
	.then(countryProfileInit())
	//.then(console.timeLog())



function setSelectedId(s, v) {

	for (var i = 0; i < s.options.length; i++) {
		//console.log(s.options[i].value, v)
		if (s.options[i].value == v) {
			//console.log("here")
			s.options[i].selected = true;

			return;

		}

	}

}

function countryProfileInit() {


	//	console.log(photoLinks[0])

	document.getElementById("countrySelect").addEventListener("change", compileCountryData);

	$("#countryExport").change(function () {

		countryExport = []

		//infos=["Profile","Finance"]

		//	console.log(countryCode)
		//	console.log(countryList)


		//for(category in ["Profile"]){
		for (indicator in allKeyData[countryCode]["Profile"]) {
			newIndi = {}
			newIndi["axis"] = indicator.replace(/,/g, '')
			try {
				//	console.log(metadata[0][el.axis]["sourceName"])
				newIndi["source"] = metadata[0][el.axis]["sourceName"].replace(/,/g, '')
			}
			catch (error) {
				//	console.log("no source for "+el.axis)
				newIndi["source"] = ""
			}
			for (country in countryList) {
				country = countryList[country]
				el = allKeyData[country]["Profile"][indicator]
				newIndi[country] = el
			}
			countryExport.push(newIndi)
		}


		for (pillar in pillars) {
			for (indicator in allKeyData[countryCode][pillars[pillar]]) {
				newIndi = {}
				el = allKeyData[countryCode][pillars[pillar]][indicator]
				newIndi["axis"] = el.axis.replace(/,/g, '')



				try {
					//		console.log(metadata[0][el.axis]["sourceName"])
					newIndi["source"] = metadata[0][el.axis]["sourceName"].replace(/,/g, '')
				}
				catch (error) {
					console.log("no source for " + el.axis)
					newIndi["source"] = ""
				}

				for (country in countryList) {
					country = countryList[country]
					el = allKeyData[country][pillars[pillar]][indicator]
					newIndi[country] = el.value
				}
				countryExport.push(newIndi)
			}
		}

		//could be refactored, same code as "profile" above
		//for(category in ["Finance"]){
		for (indicator in allKeyData[countryCode]["Finance"]) {
			newIndi = {}
			newIndi["axis"] = indicator.replace(/,/g, '')
			try {
				//	console.log(metadata[0][el.axis]["sourceName"])
				newIndi["source"] = metadata[0][el.axis]["sourceName"].replace(/,/g, '')
			}
			catch (error) {
				//	console.log("no source for "+el.axis)
				newIndi["source"] = ""
			}
			for (country in countryList) {
				country = countryList[country]
				el = allKeyData[country]["Finance"][indicator]
				newIndi[country] = el
			}
			countryExport.push(newIndi)
		}



		//console.log(countryExport)
		//console.log(allKeyData[countryCode])

		headers = {}
		headers["axis"] = "Indicator"
		headers["source"] = "Source"
		for (country in countryList) {
			headers[countryList[country]] = allKeyData[countryList[country]].Profile.Country
		}
		//console.log(allKeyData)
		exportCSVFile(headers, countryExport, "sids_profile_data", "")

		$("#countryExport").val("export")

	}) //download(filteredProjects); });

	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	function compileCountryData() {
		var x = document.getElementById("countrySelect");
		countryCode = x.value;
		countryName = allKeyData[countryCode]["Profile"]["Country"]
		countryDict = allKeyData[countryCode]["Profile"]


		///these are not curerntly in use?
		climateData = allKeyData[countryCode]["Climate"]
		climateDataRank = //process some by rank

			console.log(climateData)
		blueData = allKeyData[countryCode]["Blue"]
		blueDataRank = //process some rank
			digitalData = allKeyData[countryCode]["Digital"]
		financeData = allKeyData[countryCode]["Finance"]
		mviData = allKeyData[countryCode]["MVI"]
		mvi2Data = allKeyData[countryCode]["MVI2"]

		//console.log(allKeyData.barbados)
		hdi=parseFloat(countryDict["Human Development Index"])
	if(hdi>=.8){hdiClass="Very high human development"}		
	else if(hdi>=0.7){hdiClass="High human development"}
	else if(hdi>=0.550){hdiClass="Medium human development"}
	else if(hdi>0){hdiClass="Low human development"}
	else{hdiClass="No data"
hdi="No data"}

if (countryDict["Country Office"]=="CO"){
countryOffice=countryName+" CO"
}else{
	countryOffice=countryDict["Country Office"]
}
		// update country info 
		$("#countryProfileInfo").html("<b>Population: </b>".concat(numberWithCommas(countryDict["Population"]).toString(), "<br>\
                  <b>Region: </b>", countryDict["Region"], "<br>\
                  <b>Official Language: </b>", countryDict["Official Language"], "<br>\
                  <b>Surface Area: </b>", numberWithCommas(countryDict["Surface Area"]).toString(), " km<sup>2</sup> <br>\
                  <b>HDI: </b>", hdi.toString()+", "+hdiClass,"<br>\
				  <b>Income Group: </b>", countryDict["Income Classification"],"<br>\
				  <b>Country Office: </b>","<a href=",countryDict["Country Page"]," style='color:purple'>",countryOffice,"</a>"));
		$("#countryProfileTitle").html("<h4>" + countryName + "</h4>")

		$("#reliefMap").attr("src", "maps/relief/".concat(countryCode, "Relief.png"))

		$("#countryImage").attr("src", "images/countryPhotos/".concat(countryCode, ".jpg"))
		///disabled for now, but this is where the links appear when hovering on coutnry images

		// $("#countryImage").hover(
		// 	function () {
		// 		$(this).css("filter", "brightness(80%)");
		// //		console.log(photoLinks[0])
		// //		console.log(photoLinks[0][countryName])
		// 		$("#imageLink").text(photoLinks[0][countryName]);
		// 		$("#imageLink").css("display","block");

		// 	},
		// 	function () {
		// 		 $(this).css("filter", "brightness(100%)");
		// 		 $("#imageLink").css("display","none");
		// 		 }
		// )




		// console.log(financeData)
		financeText = ""
		Object.keys(financeData).forEach(function (d) {
			//should remove this check for finance data if 0, just temp until I clean up the finance data input 
			if (financeData[d] == "" || financeData[d] == 0) { val = "No Data" }
			else { val = nFormatter(financeData[d], 3) }
			financeText = financeText + "<b>" + d + ": </b>" + val + "<br>";
		});
		// console.log("finance",financeText)
		document.getElementById('financeInfo').innerHTML = financeText



		//   "<b>Population: </b>".concat(countryDict["Population"].toString(),"<br>\
		//   <b>Region: </b>",countryDict["Region"],"<br>\
		//   <b>Income Group: </b>", countryDict["Income Classification"],"<br>\
		//   <b>Languages: </b>", countryDict["Languages"],"<br>\
		//   <b>Surface Area: </b>", countryDict["Surface Area"] ,"<br>\
		//   <b>HDI: </b>",countryDict["Human Development Index"]);


		// update stories 

		// 		document.getElementById("countryStories").innerHTML = "<h4>Stories from ".concat(countryDict["Country"], "</h5>\
		//   <p>", countryDict["Country"], " pioneers US$ 12.5 million agreement to prevent deforestation and maintain trajectory\
		//     towards resilience\
		//   </p>\
		//   <p> ", countryDict["Country"], " placing gender equality at the center of private sector and disaster management\
		//   </p>\
		//   <p>Circular economy opportunities can\
		//     reduce GHG emissions with 44% in ", countryDict["Country"], "\
		//   </p>");


		// update all 4 spider charts
		countryList = [countryCode]



		console.log(countryList)
		dataFull = {}
		pillars = ["MVI2", "ClimateRank", "BlueRank", "DigitalRank", "Blue", "Climate", "Digital"]
		for (index in pillars) {
			pillar = pillars[index]
			pillarData = []
			for (i = 0; i < countryList.length; i++) {
				//	console.log(countryList[i])
				//	console.log(allKeyData[countryList[i]])

				////need to convert countryList[i] to code

				pillarData.push({ name: countryList[i], axes: allKeyData[countryList[i]][pillar] })
			}
			dataFull[pillar] = pillarData
		}

		console.log(dataFull)

		svg_radar1 = RadarChart("#climateSpider", radarChartOptionsClimate, countryList, "ClimateRank", dataFull);

		svg_radar2 = RadarChart("#blueSpider", radarChartOptionsBlue, countryList, "BlueRank", dataFull);

		svg_radar3 = RadarChart("#digitalSpider", radarChartOptionsDigital, countryList, "DigitalRank", dataFull);

		svg_radar4 = RadarChart("#mviSpider", radarChartOptionsMVI, countryList, "MVI2", dataFull);

	}

	////////////////////////////////////////////////////////////
	//////////////////////// Set-Up //////////////////////////////
	//////////////////////////////////////////////////////////////

	var margin = { top: 50, right: 45, bottom: 30, left: 45 },
		width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
		height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

	pillarColors = { "Blue": "#0BC6FF", "Climate": "#0DB14B", "Digital": "#F58220" }
	var radarChartOptionsClimate = {
		w: 200,
		h: 180,
		margin: margin,

		levels: 5,
		spin: 0,
		roundStrokes: false,
		color: d3.scale.ordinal().range(["#0DB14B", "#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"])//,
		//				legend: { title: 'Organization XYZ', translateX: 120, translateY: 140 },
	};
	var radarChartOptionsBlue = {
		w: 200,
		h: 180,
		margin: margin,

		levels: 5,
		spin: 0,//3.1415/6,
		roundStrokes: false,
		color: d3.scale.ordinal()
			.range(["#0BC6FF", "#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"]),
		legend: { title: 'Legend', translateX: 0, translateY: 0 },
	};
	var radarChartOptionsDigital = {
		w: 200,
		h: 180,
		margin: margin,

		levels: 5,
		spin: 0,
		roundStrokes: false,
		color: d3.scale.ordinal()
			.range(["#F58220", "#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"])//,
		//legend: { title: 'Legend', translateX: 140, translateY: 0 }
	};

	var radarChartOptionsMVI = {
		w: 320,
		h: 200,
		margin: { top: 70, right: 45, bottom: 100, left: 45 },
		maxValue: 80,
		levels: 4,
		spin: 0,
		textFormat: 1.2,
		opacityArea: 0.2,
		roundStrokes: false,
		color: d3.scale.ordinal()
			.range(["#8f0045 ", "#EDC951", "#CC333F", "#00A0B0", "#FFFFFF"])//,
		//legend: { title: 'Legend', translateX: 140, translateY: 0 }
	};

	/////////////////////////////////////////////////////////
	/////////////// The Radar Chart Function ////////////////
	/// mthh - 2017 /////////////////////////////////////////
	// Inspired by the code of alangrafu and Nadieh Bremer //
	// (VisualCinnamon.com) and modified for d3 v4 //////////
	/////////////////////////////////////////////////////////

	sin = Math.sin;
	cos = Math.cos;
	HALF_PI = Math.PI / 2;



	///options and values for all regions -> countries

	var all = "<option value='anguilla'>Anguilla</option>\
<option value='antiguaAndBarbuda'>Antigua and Barbuda</option>\
<option value='aruba'>Aruba</option>\
<option value='bahamas'>Bahamas</option>\
<option value='bahrain'>Bahrain</option>\
<option value='barbados'>Barbados</option>\
<option value='belize'>Belize</option>\
<option value='bermuda'>Bermuda</option>\
<option value='caboVerde'>Cabo Verde</option>\
<option value='caymanIslands'>Cayman Islands</option>\
<option value='comoros'>Comoros</option>\
<option value='cookIslands'>Cook Islands</option>\
<option value='cuba'>Cuba</option>\
<option value='curacao'>Curaçao</option>\
<option value='dominica'>Dominica</option>\
<option value='dominicanRepublic'>Dominican Republic</option>\
<option value='micronesia'>Micronesia</option>\
<option value='fiji'>Fiji</option>\
<option value='grenada'>Grenada</option>\
<option value='guineaBissau'>Guinea-Bissau</option>\
<option value='guyana'>Guyana</option>\
<option value='haiti'>Haiti</option>\
<option value='jamaica'>Jamaica</option>\
<option value='kiribati'>Kiribati</option>\
<option value='maldives'>Maldives</option>\
<option value='mauritius'>Mauritius</option>\
<option value='montserrat'>Montserrat</option>\
<option value='nauru'>Nauru</option>\
<option value='niue'>Niue</option>\
<option value='palau'>Palau</option>\
<option value='papuaNewGuinea'>Papua New Guinea</option>\
<option value='marshallIslands'>Marshall Islands</option>\
<option value='saintLucia'>Saint Lucia</option>\
<option value='samoa'>Samoa</option>\
<option value='saoTomeAndPrincipe'>Sao Tome and Principe</option>\
<option value='seychelles'>Seychelles</option>\
<option value='singapore'>Singapore</option>\
<option value='sintMaarten'>Sint Maarten</option>\
<option value='solomonIslands'>Solomon Islands</option>\
<option value='kittsAndNevis'>St. Kitts and Nevis</option>\
<option value='stVincent'>St. Vincent and the Grenadines</option>\
<option value='suriname'>Suriname</option>\
<option value='britishVirginIslands'>The British Virgin Islands</option>\
<option value='timorLeste'>Timor Leste</option>\
<option value='tokelau'>Tokelau</option>\
<option value='tonga'>Tonga</option>\
<option value='trinidadAndTobago'>Trinidad and Tobago</option>\
<option value='turksAndCaicos'>Turks and Caicos</option>\
<option value='tuvalu'>Tuvalu</option>\
<option value='vanuatu'>Vanuatu</option>"

	var caribbean = "<option value='anguilla'>Anguilla</option>\
<option value='antiguaBarbuda'>Antigua and Barbuda</option>\
<option value='bahamas'>Bahamas</option>\
<option value='barbados'>Barbados</option>\
<option value='belize'>Belize</option>\
<option value='bermuda'>Bermuda</option>\
<option value='caymanIslands'>Cayman Islands</option>\
<option value='cuba'>Cuba</option>\
<option value='curacao'>Curaçao</option>\
<option value='dominica'>Dominica</option>\
<option value='dominicanRepublic'>Dominican Republic</option>\
<option value='grenada'>Grenada</option>\
<option value='guyana'>Guyana</option>\
<option value='haiti'>Haiti</option>\
<option value='jamaica'>Jamaica</option>\
<option value='montserrat'>Montserrat</option>\
<option value='saintLucia'>Saint Lucia</option>\
<option value='sintMaarten'>Sint Maarten</option>\
<option value='kittsAndNevis'>St. Kitts and Nevis</option>\
<option value='stVincent'>St. Vincent and the Grenadines</option>\
<option value='suriname'>Suriname</option>\
<option value='britishVirgin'>The British Virgin Islands</option>\
<option value='trinidadAndTobago'>Trinidad and Tobago</option>\
<option value='turksAndCaicos'>Turks and Caicos</option>"

	var ais = "<option value='bahrain'>Bahrain</option>\
<option value='caboVerde'>Cabo Verde</option>\
<option value='comoros'>Comoros</option>\
<option value='guineaBissau'>Guinea-Bissau</option>\
<option value='maldives'>Maldives</option>\
<option value='mauritius'>Mauritius</option>\
<option value='saoTomeAndPrincipe'>Sao Tome and Principe</option>\
<option value='seychelles'>Seychelles</option>\
<option value='singapore'>Singapore</option>"

	var pacific = "<option value='aruba'>Aruba</option>\
<option value='cookIslands'>Cook Islands</option>\
<option value='micronesia'>Micronesia</option>\
<option value='fiji'>Fiji</option>\
<option value='kiribati'>Kiribati</option>\
<option value='nauru'>Nauru</option>\
<option value='nieu'>Nieu</option>\
<option value='palau'>Palau</option>\
<option value='papua'>Papua New Guinea</option>\
<option value='marshallIslands'>Marshall Islands</option>\
<option value='samoa'>Samoa</option>\
<option value='solomonIslands'>Solomon Islands</option>\
<option value='timorLeste'>Timor Leste</option>\
<option value='tokelau'>Tokelau</option>\
<option value='tonga'>Tonga</option>\
<option value='tuvalu'>Tuvalu</option>\
<option value='vanuatu'>Vanuatu</option>"

	var all2 = '<option value="">Overlay countries to compare indicator rank among SIDS</option>\
<option value="caribbeanAverage">Caribbean Average</option>\
<option value="aisAverage">AIS Average</option>\
<option value="pacificAverage">Pacific Average</option>'+ all
	var caribbean2 = '<option value="">Overlay countries and regions</option>\
<option value="caribbean">Caribbean Average</option>'+ caribbean
	var ais2 = '<option value="">Overlay countries and regions</option>\
 <option value="caribbean">AIS Average</option>'+ ais
	var pacific2 = '<option value="">Overlay countries and regions</option>\
 <option value="caribbean">Pacific Average</option>'+ pacific

	$("#countryCategory").change(function () {
		oldCountry = document.getElementById("countrySelect").value;
		let val = $(this).val();
		if (val == "all") {
			$("#countrySelect").html(all);
			$("#multiCountrySelect").html(all2);
		} else if (val == "caribbean") {
			$("#countrySelect").html(caribbean);
			$("#multiCountrySelect").html(caribbean2);

		} else if (val == "ais") {
			$("#countrySelect").html(ais);
			$("#multiCountrySelect").html(ais2);
		}
		else if (val == "pacific") {
			$("#countrySelect").html(pacific);
			$("#multiCountrySelect").html(pacific2);
		}

		var optionValues = [];

		$('#multiCountrySelect option').each(function () {
			optionValues.push($(this).val());
		});
		///	console.log(optionValues);
		//	console.log(oldCountry)
		//	console.log(optionValues.indexOf(oldCountry))
		if (optionValues.indexOf(oldCountry) >= 0) {
			//setTimeout here is a temporary fix so the initial selection waits until options are populated
			setTimeout(function () {
				setSelectedId(document.getElementById('countrySelect'), oldCountry);
			}, .01);
		}
		else {
			compileCountryData();
		}
	});

	////initilalize countryView

	$("#countrySelect").html(all);
	$("#multiCountrySelect").html(all2);

	//set option
	//automatically generate content

	///Country profile multiselect

	$('.label.countryMultiSelect.dropdown')
		.dropdown();

	$('.label.countryMultiSelect.dropdown').dropdown({
		onChange: function () {

			countryCode = document.getElementById("countrySelect").value;

			countryList = [countryCode].concat($(".label.countryMultiSelect.dropdown").dropdown("get value"));
			console.log(countryList)

			dataFull = {}
			pillars = ["MVI2", "ClimateRank", "BlueRank", "DigitalRank", "Blue", "Climate", "Digital"]
			for (index in pillars) {
				pillar = pillars[index]
				pillarData = []
				for (i = 0; i < countryList.length; i++) {
					//	console.log(countryList[i])
					//	console.log(allKeyData[countryList[i]])

					////need to convert countryList[i] to code

					pillarData.push({ name: countryList[i], axes: allKeyData[countryList[i]][pillar] })
				}
				dataFull[pillar] = pillarData
			}


			svg_radar1 = RadarChart("#climateSpider", radarChartOptionsClimate, countryList, "ClimateRank", dataFull);

			svg_radar2 = RadarChart("#blueSpider", radarChartOptionsBlue, countryList, "BlueRank", dataFull);

			svg_radar3 = RadarChart("#digitalSpider", radarChartOptionsDigital, countryList, "DigitalRank", dataFull);

			svg_radar4 = RadarChart("#mviSpider", radarChartOptionsMVI, countryList, "MVI2", dataFull);


		}
	});

	$('.no.label.countryMultiSelect.dropdown')
		.dropdown({
			useLabels: false
		});

	$('.countryMultiSelect.button').on('click', function () {
		$('.countryMultiSelect.dropdown')
			.dropdown('restore defaults')
	})


	//if click on country view tab


	$("#countryViewTab").click(function () {


		
		setTimeout(() => {
			compileCountryData();
		}, 1);
	});


	setSelectedId(document.getElementById('countrySelect'), "dominicanRepublic")

}

function rankFormat(num) {
	number = parseInt(num)
	if (num < 20 && num > 10) {
		return num.toString() + "th"
	}
	else if (num.slice(-1) == 1) { return num.toString() + "st" }
	else if (num.slice(-1) == 2) { return num.toString() + "nd" }
	else if (num.slice(-1) == 3) { return num.toString() + "rd" }
	else { return num.toString() + "th" }
}