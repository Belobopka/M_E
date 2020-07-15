function script() {
  const input = document.querySelector(".js-input");
  const boxes = document.getElementById("boxes");
  let width = 30;
  let height = 30;
  const onCreate = () => {
    for (let i = 0; i < input.value; i++) {
      const element = document.createElement("div");
      element.style.cssText = `width:${width}px; height:${height}px`;
      width = 10 + width;
      height = 10 + width;
      boxes.appendChild(element);
    }
  };

  const onDestroy = () => {
    while (boxes.firstChild) {
      boxes.removeChild(boxes.lastChild);
    }
    width = 30;
    height = 30;
  };
  window.extra = { onCreate, onDestroy };
}

document.addEventListener("DOMContentLoaded", script, false);
