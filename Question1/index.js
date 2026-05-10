
const get = async (url) => {
  return new Promise((resolve, reject) => {
    let http = new XMLHttpRequest();


    http.onload = () => {
      if (http.status === 200) {
        try {

          resolve(JSON.parse(http.response));
        } catch (error) {

          reject("Error parsing JSON response");
        }
      } else {

        reject(`HTTP error: ${http.status} - ${http.statusText}`);
      }
    };


    http.onerror = () => {
      reject("Network error: Failed to make the request");
    };


    http.open("GET", url);
    http.send();
  });
};

const renderChart = (data) => {
  const width = 800;
  const height = 400;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 50;
  const marginLeft = 60;


  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");


  const populationValues = data.map((d) => d.population);
  const yMin = d3.min(populationValues);
  const yMax = d3.max(populationValues);


  const padding = (yMax - yMin) * 0.1;
  const yDomain = [yMin - padding, yMax + padding];


  const x = d3.scaleLinear()
    .domain(d3.extent(data, (d) => d.year))
    .range([marginLeft, width - marginRight]);


  const y = d3.scaleLinear()
    .domain(yDomain)
    .range([height - marginBottom, marginTop]);


  const line = d3.line()
    .x((d) => x(d.year))
    .y((d) => y(d.population));


  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickFormat(d3.format("d")));


  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(height / 40))
    .call((g) => g.select(".domain").remove())
    .call((g) => g.selectAll(".tick line").clone()
      .attr("x2", width - marginLeft - marginRight)
      .attr("stroke-opacity", 0.1))
    .call((g) => g.append("text")
      .attr("x", -marginLeft)
      .attr("y", 10)
      .attr("fill", "currentColor")
      .attr("text-anchor", "start")
      .text("↑ Population"));


  svg.append("path")
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1.5)
    .attr("d", line(data));
};


const onSuccess = (data) => {
  const processedData = data.number.map((d) => ({
    year: +d.Year,
    population: +d.Population,
  }));


  renderChart(processedData);
};


const doIt = async () => {
  const populationUrl = "data/data.json";
  try {
    let res = await get(populationUrl);
    onSuccess(res);
  } catch (error) {
    console.error("Error fetching or processing data:", error);
    $("div#content").html("Failed to load data. Please try again later.");
  }
};


window.onload = () => {
  doIt();
};
