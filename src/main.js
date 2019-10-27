import './styles/main.css';
require('babel-core/register');
require('babel-polyfill');

const newsModule = (function() {
  const guardianAPIUrl = 'https://content.guardianapis.com/search?';
  const guardianAPIKey = 'b9d2f34a-7913-411a-ab27-bb1cb526e304';
  const maxNumOfPagesForPaginaton = 50;
  const paginationSelectEl = document.getElementById('activePageSelect');
  const sectionSelectEl = document.getElementById('sectionSelect');

  function getNews(params) {
    let sectionQuery = '';
    const sectionName = sectionSelectEl.value;

    if (!params.page) {
      params.page = 1;
    }

    if (sectionName !== 'all') {
      sectionQuery = `&section=${sectionName}`;
    }

    const url = `${guardianAPIUrl}from-date=2019-09-27&page=${
      params.page
    }${sectionQuery}&api-key=${guardianAPIKey}`;

    return fetch(url)
      .then(res => {
        return res.json();
      })
      .then(json => {
        return json.response;
      });
  }

  function adjustPagination(pages) {
    let paginationEl = document.getElementById('activePageSelect');
    paginationEl.innerHTML = '';

    if (pages > maxNumOfPagesForPaginaton) {
      pages = maxNumOfPagesForPaginaton;
    }

    for (let i = 1; i <= pages; i++) {
      paginationEl.innerHTML += `<option value="${i}">${i}</option>`;
    }
  }

  function renderNews(news) {
    const newsList = document.querySelector('.newsList');
    const newsElTemplate = document
      .querySelectorAll('.singleNews')[0]
      .cloneNode(true);

    newsList.innerHTML = '';

    news.results.forEach(singleNews => {
      const newsEl = newsElTemplate.cloneNode(true);
      const pubDate = new Date(singleNews.webPublicationDate);

      newsEl.querySelector('.newsTitle').innerHTML = singleNews.webTitle;
      newsEl.querySelector('.newsSectionName').innerHTML =
        singleNews.sectionName;
      newsEl.querySelector(
        '.newsPublicationDate'
      ).innerHTML = `${pubDate.getDate()}.${pubDate.getMonth()}.${pubDate.getFullYear()}`;
      newsEl.querySelector('.newsLink').setAttribute('href', singleNews.webUrl);
      newsList.appendChild(newsEl);
    });
  }

  async function displayLastNews(params = {}) {
    const news = await getNews(params);

    renderNews(news);
    if (params.doNotAdjustPagination) {
      return;
    }
    adjustPagination(news.pages);
  }

  function initListeners() {
    paginationSelectEl.addEventListener('change', () => {
      displayLastNews({
        page: paginationSelectEl.value,
        doNotAdjustPagination: true,
      });
    });

    sectionSelectEl.addEventListener('change', () => {
      displayLastNews();
    });
  }

  function init() {
    displayLastNews();
    initListeners();
  }

  return {
    init,
  };
})();

newsModule.init();
