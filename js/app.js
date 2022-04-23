const data = [...Array(1000).keys()];

(() => {
  new Container({
    x: 0,
    y: 0,
    width: 700,
    height: 700,
    data,
  });
})();
