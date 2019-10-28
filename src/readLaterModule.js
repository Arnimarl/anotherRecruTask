
const readLaterModule = (function(){

  let listOfNewsToRead = [
    {
      title: "what to read later?",
      url: "https://www.google.com"
    }
  ];

  function getReadLaterNews() {
    // get z LS
    return listOfNewsToRead;
  }

  function removeFromReadLater(index) {
    // remove z LS
    listOfNewsToRead.splice(index, 1);

    renderReadLaterSection();
  }

  function addToReadLater(el) {
    // z data- na btn do LS
    const news = {
      title: el.dataset.title,
      url: el.dataset.url,
    }
    listOfNewsToRead.push(news);
    
    renderReadLaterSection();
  }

  function renderReadLaterSection() {
    const newsForLater = getReadLaterNews();

    const readLaterList = document.querySelector(".readLaterList");
    const readLaterElTemplate = document.querySelectorAll(".readLaterItem")[0].cloneNode(true);

    readLaterList.innerHTML = "";

    newsForLater.forEach((singleNews, index) => {
      const newsEl = readLaterElTemplate.cloneNode(true);

      newsEl.querySelector(".readLaterItem-title").innerHTML = singleNews.title;
      newsEl.querySelector(".buttonRead").setAttribute("href", singleNews.url);
      newsEl.querySelector(".buttonRmv").addEventListener("click", () => {
        removeFromReadLater(index);
      });
      readLaterList.appendChild(newsEl);
    });
  }

  function setListeners() {
    document.querySelectorAll(".singleNews").forEach((newsEl) => {
      newsEl.querySelector(".readLaterBtn").addEventListener("click", (e) => {
        addToReadLater(e.target);
      })
    })
  }

  function init() {
    renderReadLaterSection();
  }

  return {
    init,
    setListeners
  }

})();

export default readLaterModule;