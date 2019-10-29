const readLaterModule = (function() {
  let readLaterElTemplate;

  function getReadLaterNews() {
    let listOfNewsToRead = JSON.parse(localStorage.getItem("listOfNewsToRead")) || [];

    return listOfNewsToRead;
  }

  function removeFromReadLater(index) {
    let listOfNewsToRead = getReadLaterNews();
    
    listOfNewsToRead.splice(index, 1);
    localStorage.setItem("listOfNewsToRead", JSON.stringify(listOfNewsToRead));

    renderReadLaterSection();
  }

  function addToReadLater(el) {
    let listOfNewsToRead = getReadLaterNews();

    const news = {
      title: el.dataset.title,
      url: el.dataset.url,
    }

    listOfNewsToRead.push(news);
    localStorage.setItem("listOfNewsToRead", JSON.stringify(listOfNewsToRead));
    
    renderReadLaterSection();
  }

  function renderReadLaterSection() {
    const newsForLater = getReadLaterNews();

    const readLaterList = document.querySelector(".readLaterList");
    if (!readLaterElTemplate) {
      readLaterElTemplate = document.querySelectorAll(".readLaterItem")[0].cloneNode(true);
    }

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