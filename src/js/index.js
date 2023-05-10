import '../css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import Notiflix from 'notiflix';

var debounce = require('lodash.debounce');

const refs = {
  searchBox: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.searchBox.addEventListener('keydown', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const inputValue = e.target.value.trim();

  if (inputValue === '') {
    return;
  }
  fetchCountries(inputValue)
    .then(data => handleSearchResult(data))
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function handleSearchResult(data) {
  if (data.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
  } else if (data.length > 1 && data.length < 11) {
    renderCountryList(data);
    refs.countryInfo.innerHTML = '';
  } else {
    renderCountryCard(data);
    refs.countryList.innerHTML = '';
  }
}

function renderCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-item">
              <img src = "${country.flags.svg}" width="30px"><p>${country.name.common}</p>
            </li>`;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function renderCountryCard(countries) {
  const markup = countries
    .map(country => {
      return `<div class="country-card-container"><img src = "${
        country.flags.svg
      }" height="30px"><h2>${country.name.common}</h2></div>
            <ul>
              <li><p><b>Capital: </b>${country.capital}</p></li>
            <li><p><b>Population: </b>${country.population}</p></li>
              <li><p><b>Languages: </b>${Object.values(country.languages).join(
                ','
              )}</p></li>
              </ul>`;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}
