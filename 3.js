function script() {
  const list = document.getElementById("images-list");
  const form = document.getElementById("search-form");
  const url = "https://pixabay.com/api/";
  const bottom = document.getElementById("bottom-scoll");
  let q = "";
  let perPage = 20;
  let page = 1;
  const key = "key=17465253-0821dd3262e9e1e80d86057ab";
  const imageType = "image_type=photo";
  let isObserverActive = false;
  let options = {
    rootMargin: "0px",
    threshold: 1.0,
  };

  const lightboxInstances = [];

  const callback = ((delay = 1000) => {
    let prevTime = Date.now();
    return () => {
      const now = Date.now();
      const canStart = now - prevTime > delay;
      prevTime = now;
      if (isObserverActive && canStart) {
        return onSubmit();
      }
    };
  })();

  let observer = new IntersectionObserver(callback, options);
  observer.observe(bottom);

  const fetchStream = (stream) => {
    return new Promise((resolve) => {
      const reader = stream.getReader();
      let result = [];
      let receivedLength = 0;
      reader.read().then(function processText({ done, value }) {
        if (done) {
          resolve({ chunks: result, length: receivedLength });
          return;
        }

        receivedLength += value.length;
        result.push(value);

        return reader.read().then(processText);
      });
    });
  };

  const joinArray = (chunks, receivedLength) => {
    let chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for (let chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }
    return chunksAll;
  };

  const decode = (chunksAll) => {
    return new TextDecoder("utf-8").decode(chunksAll);
  };

  const parse = (json) => {
    return JSON.parse(json);
  };

  const createLightboxInstance = (container) => {
    return basicLightbox.create(container);
  };

  const showLightbox = (lightboxInstance) => {
    return function show() {
      return lightboxInstance.show();
    };
  };

  const createLargeImageContainer = (url) => {
    const img = document.createElement("img");
    const div = document.createElement("div");
    img.setAttribute("src", url);
    img.setAttribute("data-source", url);
    div.appendChild(img);
    return div;
  };

  const getParams = (q) =>
    `?${key}&${imageType}&perPage=${perPage}&page=${page}${q ? `&q=${q}` : ""}`;

  const appendLightboxListener = ({ largeImageURL, img }) => {
    const largeImageContainer = createLargeImageContainer(largeImageURL);
    const lightboxInstance = createLightboxInstance(largeImageContainer);
    const showLightboxCallback = showLightbox(lightboxInstance);

    lightboxInstances.push(showLightboxCallback);

    img.addEventListener("click", showLightboxCallback);
  };

  const onLastImageLoaded = () =>
    setTimeout(() => (isObserverActive = true), 50);

  const appendImages = (imageUrls) =>
    imageUrls.forEach(({ webformatURL, largeImageURL }, index) => {
      const li = document.createElement("li");
      const img = document.createElement("img");
      img.setAttribute("src", webformatURL);
      img.setAttribute("data-source", largeImageURL);
      appendLightboxListener({ largeImageURL, img });
      li.appendChild(img);
      list.appendChild(li);
      if (index === imageUrls.length - 1) {
        img.addEventListener("load", onLastImageLoaded);
      }
    });

  const onSubmit = async (evt) => {
    if (evt) {
      evt.preventDefault();
    }
    const keyText = form.firstElementChild.value;
    if (q !== keyText) {
      isObserverActive = false;
      q = keyText;
      page = 1;
      clearList(list);
    }
    const resp = await fetch(`${url}${getParams(keyText)}`, {
      method: "GET",
    });
    const { chunks, length } = await fetchStream(resp.body);
    const result = parse(decode(joinArray(chunks, length)));
    const imageUrls = result.hits;
    appendImages(imageUrls);
    page += 1;
  };

  form.addEventListener("submit", onSubmit);

  const clearList = (list) => {
    while (list.firstElementChild) {
      const imgElement = list.lastElementChild.querySelector("img");
      imgElement.removeEventListener(
        "click",
        lightboxInstances[lightboxInstances.length - 1]
      );
      imgElement.removeEventListener("load", onLastImageLoaded);
      lightboxInstances.pop();
      list.removeChild(list.lastElementChild);
    }
  };
}

document.addEventListener("DOMContentLoaded", script, false);
