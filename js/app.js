const data = [...Array(300).keys()]; // each unit is a millimeter

(() => {
  new Container({
    x: 0,
    y: 0,
    width: 900,
    height: 900,
    data,
  });
})();
