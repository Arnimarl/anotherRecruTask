import './styles/main.css';
import readLaterModule from './readLaterModule.js';

require("babel-core/register");
require("babel-polyfill");

const mainNewsModule = (function() {
  const guardianAPIUrl = "https://content.guardianapis.com/search?";
  const guardianAPIKey = "b9d2f34a-7913-411a-ab27-bb1cb526e304";
  const maxNumOfPagesForPaginaton = 50;
  const paginationSelectEl = document.getElementById("activePageSelect");
  const sectionSelectEl = document.getElementById("sectionSelect");
  const searchPhraseFormEl = document.getElementById("newsContentSearchForm");
  const searchPhraseInputEl = document.getElementById("newsContentSearch");
  const searchNoOlderThanNumOfDays = 30;

  function getStartSearchDate() {
    // start searching for articles not older than {searchNoOlderThanNumOfDays} days
    let startDate = new Date();
    startDate.setDate(startDate.getDate()-searchNoOlderThanNumOfDays);

    return `${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`;
  }

  function getNews(params) {
    let sectionQuery = "";
    let searchPhraseQuery = "";
    const sectionName = sectionSelectEl.value;
    const searchPhrase = searchPhraseInputEl.value;
    const fromDate = getStartSearchDate();

    if (!params.page) {
      params.page = 1;
    }

    if (sectionName !== "all") {
      sectionQuery = `&section=${sectionName}`;
    }

    if (searchPhrase.length) {
      searchPhraseQuery = `&q="${searchPhrase}"`;
    }

    const url = `${guardianAPIUrl}from-date=${fromDate}&page=${params.page}${sectionQuery}${searchPhraseQuery}&api-key=${guardianAPIKey}`;

    return fetch(url)
      .then(res => {return res.json()})
      .then(json => {return json.response});
  }

  function adjustPagination(pages) {
    let paginationEl = document.getElementById("activePageSelect");
    paginationEl.innerHTML = "";

    if (pages > maxNumOfPagesForPaginaton) {
      pages = maxNumOfPagesForPaginaton;
    }

    for (let i = 1; i <= pages; i++) {
      paginationEl.innerHTML += `<option value="${i}">${i}</option>`;
    }
    
  }

  function renderNews(news) {
    const newsList = document.querySelector(".newsList");
    const newsElTemplate = document.querySelectorAll(".singleNews")[0].cloneNode(true);

    newsList.innerHTML = "";

    news.results.forEach(singleNews => {
      const newsEl = newsElTemplate.cloneNode(true);
      const pubDate = new Date(singleNews.webPublicationDate);

      newsEl.querySelector(".newsTitle").innerHTML = singleNews.webTitle;
      newsEl.querySelector(".newsSectionName").innerHTML = singleNews.sectionName;
      newsEl.querySelector(".newsPublicationDate").innerHTML = `${pubDate.getDate()}.${pubDate.getMonth()}.${pubDate.getFullYear()}`;
      newsEl.querySelector(".newsLink").setAttribute("href", singleNews.webUrl);
      newsEl.querySelector(".readLaterBtn").setAttribute("data-title", singleNews.webTitle);
      newsEl.querySelector(".readLaterBtn").setAttribute("data-url", singleNews.webUrl);
      newsList.appendChild(newsEl);
    });
  }

  async function displayLastNews(params = {}) {
    const news = await getNews(params);

    if (!news.results.length) {
      document.getElementById("pageReloadLink").classList.remove("hide");
    }

    renderNews(news);
    readLaterModule.setListeners();

    if (params.doNotAdjustPagination) {
      return;
    }
    adjustPagination(news.pages);
  }

  function initListeners() {
    paginationSelectEl.addEventListener("change", () => {
      displayLastNews({page: paginationSelectEl.value, doNotAdjustPagination: true});
    });

    sectionSelectEl.addEventListener("change", () => {
      displayLastNews();
    });

    searchPhraseFormEl.addEventListener("submit", (e) => {
      e.preventDefault();
      displayLastNews();
    });
  }
  
  function init() {
    displayLastNews();
    initListeners();
    readLaterModule.init();
  }

  return {
    init
  }
})();

mainNewsModule.init();
