import './Home.scss';
import axios from 'axios';
import React, { useState } from 'react';
import { HiOutlineSearch, HiSun, HiOutlineSun } from 'react-icons/hi';
import { IoIosSnow } from 'react-icons/io';
import { TbWind } from 'react-icons/tb';
import Lottie from 'react-lottie';
import Bad from './../lottieAnimation/bad-weather.json';
import Dark from './../lottieAnimation/dark-cloud.json';
import DayClear from './../lottieAnimation/day-clear.json';
import DayCloud from './../lottieAnimation/day-cloud.json';
import Rain from './../lottieAnimation/rain.json';
import Snow from './../lottieAnimation/snow.json';
import Haze from './../lottieAnimation/haze.json';
import Mist from './../lottieAnimation/mist-weather.json';
import DayBrokenCloud from './../lottieAnimation/day-broken-cloud.json';
import ReactCountryFlag from "react-country-flag";
import _ from 'lodash';
import { useEffect, useCallback } from 'react';

function Home() {
  const popularCities = ["London", "Paris", "New York"];
  const API_KEY = 'd9a3a899779348044d9a75ad83d2b8e2';
  const [searchHistory, setSearchHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [data, setData] = useState();
  const [recent, setRecent] = useState('recent');
  const [search, setSearch] = useState('lucknow');
  const handleSearch = (e) => setSearch(e.target.value);
  const Search = useCallback(async (data) => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${data}&appid=${API_KEY}`);
    setData(response.data);
    setSearchHistory((id) => _.uniq([...id, data]));
    setSearch('');
    console.log(searchHistory, "searchHistory");
  }, [search]);
  const weatherType = data ? data.weather[0].main : null;
  console.log("data", data);
  const ThemeMode = () => {
    setDarkMode(!darkMode);
  }
  // FetchData();
  return (
    <div style={{
      background: darkMode && "#0a2351",
    }}>
      <div className='Header'>
        <h1>Weather Station</h1>
        <div className="search">
          <input type="text" placeholder="Search" className='searchBox' value={search} onChange={handleSearch} />
          <button className='searchBtn' onClick={() => Search(search)}><HiOutlineSearch /></button>
        </div>
        <div className="themeMode" onClick={ThemeMode}>{darkMode ? <HiSun /> : <HiOutlineSun />}</div>
      </div>
      <div className="main">
        <div className="PopularSearches">
          <div className="tabs">
            <input type="radio" name="Choice" id="popular" onChange={() => setRecent("popular")} />
            <label htmlFor="popular">Most Popular Searches</label>
            <input type="radio" name="Choice" id="recent" onChange={() => setRecent("recent")} />
            <label htmlFor="recent">Recent Searches</label></div>
          <div className="list">
            {recent === "popular" ? <div className="popular">
              {popularCities.map((city) => <div className="city" onClick={() => Search(city)}>{city}</div>)}
            </div> :
              <div className="recent">
                {searchHistory ? searchHistory.map(item => (
                  <p onClick={() => Search(item)}>{item}</p>
                )) : <p>Nothing to see here</p>}
              </div>}
          </div>
        </div>
        <div className="midPart">
          {data ? <Lottie
            height={400}
            width={400}
            options={{
              loop: true,
              autoplay: true,
              animationData: weatherType === 'Clear' ? DayClear : weatherType === 'Cloud' ? DayCloud : weatherType === 'Rain' ? Rain : weatherType === 'Snow' ? Snow : weatherType === 'Haze' ? Haze : weatherType === 'Mist' ? Mist : weatherType === 'Thunderstorm' ? DayBrokenCloud : Dark,
            }} /> : null}

        </div>
        <div className="weatherInfo">
          <span className="tempText">{data && (data.main.temp - 273.15).toFixed(2)}° </span>
          <span className='temp'>{data && data.name}</span>
          <span><IoIosSnow className='rotating' />{data && data.main.humidity}%</span>
          <span><TbWind className='moving' /> {data && data.wind.speed}km/h</span>
        </div>
      </div>
      <div className="detail">
        <div className="location">
          Country : <ReactCountryFlag
            countryCode={data && data.sys.country}
            svg
            cdnUrl="https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.4.3/flags/1x1/"
            cdnSuffix="svg"
            title={data && data.sys.country}
          /> <br />
          <i> City :</i> {data && data.name} <br />
          <i> Lattitude :</i>  {data && data.coord.lat}<br />
          <i> Longitude :</i> {data && data.coord.lon}<br />
        </div>
        <div className="weatherDetail">
          <i> Feels Like:</i> {data && (data.main.feels_like - 273.15).toFixed(2)}° <br />
          <i> Pressure :</i> {data && data.main.pressure}<br />
          <i> Min Temp:</i>{data && (data.main.temp_min - 273.15).toFixed(2)}°<br />
          <i>  Max Temp:</i>{data && (data.main.temp_max - 273.15).toFixed(2)}°
        </div>
      </div>
    </div>
  );
}

export default Home;