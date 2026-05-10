// =============================================================================
// WordsAPI key required.
//
// Get a free key (2500 requests/day) at:
//   https://rapidapi.com/dpventures/api/wordsapi
//
// 1. Sign up for a free RapidAPI account
// 2. Subscribe to the WordsAPI "Basic" (free) plan
// 3. Copy your X-RapidAPI-Key from the code snippets on the endpoints page
// 4. Paste it below, replacing YOUR_RAPIDAPI_KEY_HERE
// =============================================================================
const API_KEY = 'YOUR_RAPIDAPI_KEY_HERE';
const API_URL = 'https://wordsapiv1.p.rapidapi.com/words/';


let allWords = [];


async function fetchSynonyms(word) {
  const url = `${API_URL}${word}/synonyms`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_KEY,
      'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);


    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }


    const data = await response.json();


    return data.synonyms || [];
  } catch (error) {
    console.error('Error fetching synonyms:', error);
    alert(`Error: ${error.message}`);
    return [];
  }
}


function generateWordCloud() {
  const word = document.getElementById('wordInput').value.trim();
  if (!word) {
    alert('Please enter a word.');
    return;
  }


  const wordCloudDiv = document.getElementById('wordCloud');
  wordCloudDiv.innerHTML = '<p>Loading...</p>';

  fetchSynonyms(word).then(synonyms => {
    if (synonyms.length === 0) {
      alert('No synonyms found for this word.');
      wordCloudDiv.innerHTML = '';
      return;
    }


    const newWords = [word, ...synonyms].map(d => ({
      text: d,
      size: 20 + Math.random() * 40
    }));


    allWords = [...allWords, ...newWords];


    wordCloudDiv.innerHTML = '';


    const width = 600;
    const height = 400;

    const layout = d3.layout.cloud()
      .size([width, height])
      .words(allWords)
      .padding(5)
      .rotate(() => (Math.random() > 0.5 ? 0 : 90))
      .fontSize(d => d.size)
      .on('end', draw);

    layout.start();

    function draw(words) {
      const svg = d3.select('#wordCloud')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

      svg.selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-size', d => `${d.size}px`)
        .style('fill', () => `hsl(${Math.random() * 360}, 70%, 50%)`) // Random colors
        .attr('text-anchor', 'middle')
        .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
        .text(d => d.text);
    }
  });
}
