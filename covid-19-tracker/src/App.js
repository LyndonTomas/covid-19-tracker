import './App.css';
import React, {useState, useEffect} from 'react';
import {
  MenuItem,
  FormControl, 
  Select,
  Card,
  CardContent
} from '@material-ui/core';
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from './Table'
import { sortData } from "./util"
// import LineGraph from './LineGraph'


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() =>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, [])

  // State = how to write a variable in React
  // https://disease.sh/v3/covid-19/countries
  // USEEFFECT = Runs a piece opf code based on a given condition
  // The code inside here will run once
    // when the component loads and not again 
    // async -> sends a request, wait for it, do something with the info
  useEffect(() =>{
    const getCountriesData = async() =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country)=> (
          {
            name: country.country, //ex. United States, Unitek Kingdom
            value:country.countryInfo.iso2 // ex. USA, UK
          }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
      });
    };
    getCountriesData();
  }, [countries]);

 const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url = countryCode ==='worldwide' 
    ? 'https://disease.sh/v3/covid-19/countries/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then( response => response.json())
    .then( data=>{
      setCountry(countryCode);
      setCountryInfo(data);
    })
 };

  return (
    <div className="app"> 
    {/* BEM Naming convention */}
      <div className="app__left">
          {/* Header */}
          {/* Title + Select input Dropdown field */}
        <div className="app__header">
        <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} 
            onChange={onCountryChange}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country =>(
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths }/>
        </div>

          <Map />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by country</h3>
          {/* table */}
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          {/* <LineGraph /> */}
          {/* graph */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
