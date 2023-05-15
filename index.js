const waitForElement = (selector) => {
  return new Promise((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      return resolve(element);
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};

const onElementTextChange = async (selector, initialize, callback) => {
  const element = await waitForElement(selector);
  initialize();
  let text = element.textContent;
  callback(text);
  const observer = new MutationObserver(() => {
    if (element.textContent !== text) {
      text = element.textContent;
      callback(text);
    }
  });

  observer.observe(element, {
    childList: true,
    subtree: true,
    characterData: true,
  });
};

const createVideoInfo = () => {
  const container = document.createElement("div");
  container.classList.add("fixyoutube-info-container");

  const viewsContainer = document.createElement("span");
  viewsContainer.classList.add("fixyoutube-views");

  const separator = document.createElement("span");
  separator.classList.add("fixyoutube-separator");
  separator.textContent = "•";

  const dateContainer = document.createElement("span");
  dateContainer.classList.add("fixyoutube-date");

  container.appendChild(viewsContainer);
  container.appendChild(separator);
  container.appendChild(dateContainer);

  const aboveTheFold = document.querySelector("#above-the-fold");
  const topRow = document.querySelector("#top-row");

  aboveTheFold.insertBefore(container, topRow);
};

onElementTextChange("#description #tooltip", createVideoInfo, (text) => {
  const [views, date] = text?.trim().split(" • ");
  const viewsContainer = document.querySelector(".fixyoutube-views");
  const dateContainer = document.querySelector(".fixyoutube-date");
  viewsContainer.textContent = views;
  dateContainer.textContent = date;
});
