function script() {
  const input = document.querySelector(".js-input");
  const boxes = document.getElementById("boxes");
  let width = 30;
  let height = 30;

  const generateRandomColor = () => {
    var o = Math.round,
      r = Math.random,
      s = 255;
    return (
      "rgba(" +
      o(r() * s) +
      "," +
      o(r() * s) +
      "," +
      o(r() * s) +
      "," +
      r().toFixed(1) +
      ")"
    );
  };

  const onCreate = () => {
    for (let i = 0; i < input.value; i++) {
      const element = document.createElement("div");
      randomColor = generateRandomColor();
      element.style.cssText = `width:${width}px; height:${height}px; background-color:${randomColor}`;
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
