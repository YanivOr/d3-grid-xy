class Container {
  constructor({ name, x, y, width, height, data }) {
    this.xAxis = null;
    this.yAxis = null;
    this.xPositions = null;
    this.yPositions = null;

    this.xPositionH = 20;

    this.name = name;
    this.initX = x;
    this.initY = y;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.data = data;

    this.setContainer(this.data);
    this.renderAll();
  }

  setContainer(data) {
    xScale = d3.scaleBand().domain(data.keys()).range([0, this.width]);
    this.xAxis = d3.axisBottom(xScale).tickSize(this.height).tickFormat("");

    yScale = d3.scaleBand().domain(data.keys()).range([this.height, 0]);
    this.yAxis = d3.axisLeft(yScale).tickSize(this.width).tickFormat("");

    const extent = [
      [0, 0],
      [this.width, this.height],
    ];

    // Main container
    main = d3
      .select("#main")
      .append("svg")
      .attr("class", "container")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("x", this.x)
      .attr("y", this.y)
      .call(
        d3
          .zoom()
          .scaleExtent([1, 100])
          .translateExtent(extent)
          .extent(extent)
          .on("zoom", (event) => {
            this.renderAll(event);
          })
      );

    // Main rect
    main
      .append("rect")
      .attr("class", "main-rect")
      .attr("width", this.width)
      .attr("height", this.height);

    // X axis
    main
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, 0)`)
      .call(this.xAxis);

    // Y axis
    main
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${this.width}, 0)`)
      .call(this.yAxis);

    // X positions
    this.xPositions = main
      .append("g")
      .attr("transform", `translate(0, 20)`)
      .attr("class", "xPositions");

    // Y positions
    this.yPositions = main
      .append("g")
      .attr("transform", `translate(5, 0)`)
      .attr("class", "yPositions");

    // Main rect
    main
      .append("rect")
      .attr("class", "wrapper-rect")
      .attr("width", this.width)
      .attr("height", this.height);
  }

  // Ticks Attributes
  setTicksAttributes(data) {
    main
      .selectAll(".tick")
      .data(data)
      .attr("pos", (_, i) => i);
  }

  // X Positions
  setXPositions(data, step = 1) {
    this.xPositions
      .selectAll(".xPositions .xPosition")
      .data(data)
      .join("text")
      .attr("width", xScale.bandwidth())
      .attr("height", this.xPositionH)
      .attr("x", (_, i) => xScale(i) + xScale.bandwidth() / 2 - 5)
      .attr("y", 0)
      .attr("class", "xPosition")
      .text((_, i) => (i % step === 0 ? i : ""));
  }

  // Y Positions
  setYPositions(data, step = 1) {
    this.yPositions
      .selectAll(".yPositions .yPosition")
      .data(data)
      .join("text")
      .attr("width", this.yPositionH)
      .attr("height", yScale.bandwidth())
      .attr("x", 0)
      .attr("y", (_, i) => yScale(i) + yScale.bandwidth() / 2 - 5)
      .attr("class", "yPosition")
      .text((_, i) => (i % step === 0 ? i : ""));
  }

  renderAll(event) {
    if (event) {
      xScale.range([0, this.width].map((d) => event.transform.applyX(d)));
      yScale.range([this.height, 0].map((d) => event.transform.applyY(d)));
    }

    main.selectAll(".x-axis").call(this.xAxis);
    main.selectAll(".y-axis").call(this.yAxis);

    this.setTicksAttributes(this.data);

    // Base Positions
    if (xScale.bandwidth() <= 2) {
      this.setXPositions(this.data, 100);
      this.setYPositions(this.data, 100);
    } else if (xScale.bandwidth() >= 2 && xScale.bandwidth() <= 5) {
      this.setXPositions(this.data, 50);
      this.setYPositions(this.data, 50);
    } else if (xScale.bandwidth() >= 5 && xScale.bandwidth() <= 10) {
      this.setXPositions(this.data, 25);
      this.setYPositions(this.data, 25);
    } else if (xScale.bandwidth() >= 10 && xScale.bandwidth() <= 20) {
      this.setXPositions(this.data, 15);
      this.setYPositions(this.data, 15);
    } else if (xScale.bandwidth() >= 20 && xScale.bandwidth() <= 30) {
      this.setXPositions(this.data, 5);
      this.setYPositions(this.data, 5);
    } else if (xScale.bandwidth() >= 30 && xScale.bandwidth() <= 40) {
      this.setXPositions(this.data, 2);
      this.setYPositions(this.data, 2);
    } else {
      this.setXPositions(this.data, 1);
      this.setYPositions(this.data, 1);
    }

    /** /
     * /*
    const encodedSVGString =
      "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB3aWR0aD0iMzcwIiBoZWlnaHQ9IjQwMCIgc3R5bGU9InNoYXBlLXJlbmRlcmluZzpnZW9tZXRyaWNQcmVjaXNpb247IHRleHQtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgaW1hZ2UtcmVuZGVyaW5nOm9wdGltaXplUXVhbGl0eTsgZmlsbC1ydWxlOmV2ZW5vZGQiIHZpZXdCb3g9IjAgMCA4MDAwIDExMzE0IiBpZD0ic3ZnMiIgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzIGlkPSJkZWZzNCI+CiAgICA8c3R5bGUgdHlwZT0idGV4dC9jc3MiIGlkPSJzdHlsZTYiPgogICAKICAgIC5zdHIxIHtzdHJva2U6IzgzODI4MTtzdHJva2Utd2lkdGg6M30KICAgIC5zdHIwIHtzdHJva2U6IzFGMUExNztzdHJva2Utd2lkdGg6M30KICAgIC5zdHIyIHtzdHJva2U6I0MwQTA2MjtzdHJva2Utd2lkdGg6MjE1O3N0cm9rZS1saW5lam9pbjpyb3VuZH0KICAgIC5maWw4IHtmaWxsOm5vbmV9CiAgICAuZmlsMyB7ZmlsbDojMUYxQTE3fQogICAgLmZpbDcge2ZpbGw6IzRENDk0OH0KICAgIC5maWwwIHtmaWxsOiNGRkZGRkZ9CiAgICAuZmlsNCB7ZmlsbDojRkZGRkZGfQogICAgLmZpbDEwIHtmaWxsOiNEN0M2QTN9CiAgICAuZmlsMTMge2ZpbGw6I0Q3QzdBNH0KICAgIC5maWwxNSB7ZmlsbDojRDhDN0E1fQogICAgLmZpbDE3IHtmaWxsOiNEOEM4QTZ9CiAgICAuZmlsMTkge2ZpbGw6I0Q4QzhBN30KICAgIC5maWwyMSB7ZmlsbDojREFDOUE4fQogICAgLmZpbDIzIHtmaWxsOiNEQUNBQTl9CiAgICAuZmlsMjUge2ZpbGw6I0RCQ0FBQX0KICAgIC5maWwyNyB7ZmlsbDojREJDQ0FCfQogICAgLmZpbDI5IHtmaWxsOiNEQkNDQUN9CiAgICAuZmlsMzEge2ZpbGw6I0REQ0RBRH0KICAgIC5maWwzMyB7ZmlsbDojRERDREFFfQogICAgLmZpbDM1IHtmaWxsOiNERUNGQUZ9CiAgICAuZmlsMzcge2ZpbGw6I0RFRDBCMn0KICAgIC5maWw0MCB7ZmlsbDojRTBEMkI0fQogICAgLmZpbDQzIHtmaWxsOiNFMUQ0QjZ9CiAgICAuZmlsNDUge2ZpbGw6I0UxRDRCN30KICAgIC5maWw0NyB7ZmlsbDojRTFENUI4fQogICAgLmZpbDQ4IHtmaWxsOiNFM0Q2QkF9CiAgICAuZmlsNTAge2ZpbGw6I0UzRDZCQn0KICAgIC5maWw1MiB7ZmlsbDojRTREOEJDfQogICAgLmZpbDU0IHtmaWxsOiNFNEQ4QkR9CiAgICAuZmlsNTMge2ZpbGw6I0U1RDlCRX0KICAgIC5maWw1MSB7ZmlsbDojRTZEQUJGfQogICAgLmZpbDQ5IHtmaWxsOiNFNkRCQzF9CiAgICAuZmlsNDYge2ZpbGw6I0U4RERDM30KICAgIC5maWw0NCB7ZmlsbDojRThERUM1fQogICAgLmZpbDQyIHtmaWxsOiNFOURFQzZ9CiAgICAuZmlsNDEge2ZpbGw6I0VBREZDOH0KICAgIC5maWwzOSB7ZmlsbDojRUJFMUM5fQogICAgLmZpbDM4IHtmaWxsOiNFQkUyQ0N9CiAgICAuZmlsMzYge2ZpbGw6I0VERTRDRX0KICAgIC5maWwzNCB7ZmlsbDojRUZFNkQxfQogICAgLmZpbDgwIHtmaWxsOiNFRkYwRUR9CiAgICAuZmlsMzIge2ZpbGw6I0YwRTdENH0KICAgIC5maWwzMCB7ZmlsbDojRjJFOUQ4fQogICAgLmZpbDI4IHtmaWxsOiNGMkVDREN9CiAgICAuZmlsMjYge2ZpbGw6I0YzRUVERn0KICAgIC5maWwyNCB7ZmlsbDojRjVFRkUyfQogICAgLmZpbDIyIHtmaWxsOiNGNkYxRTZ9CiAgICAuZmlsMjAge2ZpbGw6I0Y4RjNFOX0KICAgIC5maWwxOCB7ZmlsbDojRjhGNUVEfQogICAgLmZpbDE2IHtmaWxsOiNGOUY3RjB9CiAgICAuZmlsMTQge2ZpbGw6I0ZCRjlGNH0KICAgIC5maWwxMiB7ZmlsbDojRkNGQkY3fQogICAgLmZpbDExIHtmaWxsOiNGRUZDRkJ9CiAgICAuZmlsOSB7ZmlsbDojRkZGRkZGfQogICAgLmZpbDIge2ZpbGw6dXJsKCNpZDIpfQogICAgLmZpbDYge2ZpbGw6dXJsKCNpZDMpfQogICAgLmZpbDEge2ZpbGw6dXJsKCNpZDQpfQogICAgLmZpbDUge2ZpbGw6dXJsKCNpZDUpfQogICAgLmZpbDczIHtmaWxsOnVybCgjaWQ2KX0KICAgIC5maWw1OSB7ZmlsbDp1cmwoI2lkNyl9CiAgICAuZmlsNjAge2ZpbGw6dXJsKCNpZDgpfQogICAgLmZpbDY3IHtmaWxsOnVybCgjaWQ5KX0KICAgIC5maWw2MSB7ZmlsbDp1cmwoI2lkMTApfQogICAgLmZpbDcxIHtmaWxsOnVybCgjaWQxMSl9CiAgICAuZmlsNjQge2ZpbGw6dXJsKCNpZDEyKX0KICAgIC5maWw1NiB7ZmlsbDp1cmwoI2lkMTMpfQogICAgLmZpbDU3IHtmaWxsOnVybCgjaWQxNCl9CiAgICAuZmlsNjMge2ZpbGw6dXJsKCNpZDE1KX0KICAgIC5maWw1NSB7ZmlsbDp1cmwoI2lkMTYpfQogICAgLmZpbDc5IHtmaWxsOnVybCgjaWQxNyl9CiAgICAuZmlsNjgge2ZpbGw6dXJsKCNpZDE4KX0KICAgIC5maWw3NiB7ZmlsbDp1cmwoI2lkMTkpfQogICAgLmZpbDc4IHtmaWxsOnVybCgjaWQyMCl9CiAgICAuZmlsNjIge2ZpbGw6dXJsKCNpZDIxKX0KICAgIC5maWw1OCB7ZmlsbDp1cmwoI2lkMjIpfQogICAgLmZpbDY1IHtmaWxsOnVybCgjaWQyMyl9CiAgICAuZmlsNzIge2ZpbGw6dXJsKCNpZDI0KX0KICAgIC5maWw2NiB7ZmlsbDp1cmwoI2lkMjUpfQogICAgLmZpbDc0IHtmaWxsOnVybCgjaWQyNil9CiAgICAuZmlsNzcge2ZpbGw6dXJsKCNpZDI3KX0KICAgIC5maWw3NSB7ZmlsbDp1cmwoI2lkMjgpfQogICAgLmZpbDcwIHtmaWxsOnVybCgjaWQyOSl9CiAgICAuZmlsNjkge2ZpbGw6dXJsKCNpZDMwKX0KICAgCiAgPC9zdHlsZT4KICAgIDxzdHlsZSBpZD0ic3R5bGUxNDcyIiB0eXBlPSJ0ZXh0L2NzcyI+CiAgIAogICAgLmZpbDAge2ZpbGw6IzAwMDAwMH0KICAgCiAgPC9zdHlsZT4KICA8L2RlZnM+CiAgPHBhdGggc3R5bGU9ImZpbGw6IG5vbmU7IHN0cm9rZTogcmdiKDAsIDAsIDApOyBzdHJva2Utd2lkdGg6IDMxLjMxNDU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgc3Ryb2tlLW9wYWNpdHk6IDE7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IiBkPSJNIDMwMTQuMzk0IDIzOTEuMDMzIEMgMzAxNC4zOTQgMjM5MS4wMzMgMzgxLjM0MSA4OTMyLjkwMSAxMzcuNjE4IDk2ODYuOTIxIEMgLTE0NC44MjggMTA1NjAuNzMxIDQ4My44ODEgMTEyODIuMTM4IDExNDIuNDI0IDExMjczLjQ5IEMgMzM1My4xNCAxMTI0NC40NjQgNjA5MS4xOTUgMTEyMDQuMzE0IDY4NTUuNzg5IDExMjA0LjMxNCBDIDc2MjAuMzggMTEyMDQuMzE0IDgxOTIuMTkyIDEwMzkxLjcxMyA3ODE5LjM4MSA5NTE5LjI5NiBDIDc1MzIuNDcyIDg4NDcuOTEgNTA2MC42MSAyMzkxLjAzMyA1MDYwLjYxIDIzOTEuMDMzIEMgNTA2MC42MSAyMzkxLjAzMyA1MDQxLjUxMiAxOTQ5LjE0MiA1MDYwLjYxIDQzMC41MjkgQyA1MzM4LjkyMSA0MzAuNTI5IDUzMTEuNDk3IDQxLjQwMiA1MDYwLjYxIDQxLjQwMiBDIDQ1MzIuNTQ3IDQxLjQwMiAzNzYyLjg1OSA0MS40MDIgMzAxNC4zOTQgNDEuNDAyIEMgMjY5Ni42NDcgNDEuNDAyIDI3MTcuNjU3IDQzMC41MjkgMzAxNC4zOTQgNDMwLjUyOSBDIDMwMTQuMzk0IDEyNzcuOTU3IDMwMTQuMzk0IDIzOTEuMDMzIDMwMTQuMzk0IDIzOTEuMDMzIFoiIGlkPSJwYXRoMzkwOC0zIi8+Cjwvc3ZnPg==";
  */

    /* Erlenmeyer Flask
    main
      .selectAll(".erlenmeyer-flask")
      .data([0])
      .join("svg:image")
      .attr("class", "erlenmeyer-flask")
      .attr("width", xScale.bandwidth() * 100)
      .attr("height", yScale.bandwidth() * 100)
      .attr("x", () => xScale(200))
      .attr("y", () => yScale(800))
      .attr("href", "data:image/svg+xml;base64," + encodedSVGString);
    /**/
  }
}
