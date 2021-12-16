presetDict = { "evi": ["agrInst", "expConc", "expInst", "popLECZ", "popDry", "remote", "victims", "agrGDP"] }

mviIndicatorNames = {
    "expConc": "Export Concentration", "expInst": "Export Instability", "agrInst": "Agricultural Instability", "agrGDP": "Agriculture & Fishing (% of GDP)",
    "victims": "Victims of Disasters", "popLECZ": "% Population in Coastal Zones", "remote": "Remoteness",//"popDry": "% Population in Drylands", 
    "tourism": "Tourism Revenue (% of Exports)", "fdi": "FDI Inflows (% of GDP)", "remit": "Remittances (% of GDP)"
}

mviIndicatorsDict = {
    "expConc": "Exportconcentration", "expInst": "ExportInstability", "agrInst": "AgriculturalInstability", "agrGDP": "AgricultureandfishingasshareofGDP",
    "victims": "Victimsofdisasters", "popLECZ": "Shareofpopulationinlowelevatedcoastalzones",  "remote": "Remoteness",//"popDry": "%PopulationinDrylands",
    "tourism": "Tourismrevenuesasshareofexports", "fdi": "FDIinflowsaspercentageofGDP", "remit": "RemittancesaspercentageofGDP"
}

mviDimensionColors = { "Financial": "#0DB14B", "Economic": "#f0db3a", "Geographic": "#CC333F", "Environmental": "#00A0B0" }

mviDimensions = {
    "Financial": ["tourism", "remit", "fdi"],
    "Economic": ["agrInst", "expConc", "expInst"],

    "Geographic": ["popLECZ", "remote"],//"popDry", 
    "Environmental": ["victims", "agrGDP"]

}

mviDimensionList = Object.keys(mviDimensions)