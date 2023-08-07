window.onload = function() {
  const shiori_id = 'UCgnfPPb9JI3e9A4cXHnWbyg'; // Channel ID

  // Fetch arguments
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-APIKEY': 'b6025236-fd84-447d-a72d-52cbde851e04'
    },
    body:
      '{"sort":"newest", "lang":["en","ja"],"target":["stream"],"conditions":[],"vch":["' +
      shiori_id +
      '"],"org":["Hololive"],"comment":[],"paginated":true,"offset":0,"limit":5}'
  };

  // Helper function to check if shiori is live in the fetched data
  function isshioriLive(data) {
    return data.items.some((item) => item.status === 'live' && item.channel.id === shiori_id);
  }

  // Helper function to get the first live stream index
  function getFirstLiveStreamIndex(data) {
    return data.items.findIndex((item) => item.status === 'live');
  }

  // Fetch data from the Holodex API
  fetch('https://holodex.net/api/v2/search/videoSearch', options)
    .then((response) => response.json())
    .then((data) => {
      let liveStreamIndex = getFirstLiveStreamIndex(data);

      if (isshioriLive(data)) {
        // shiori is live
        handleLiveStream(data.items[liveStreamIndex]);
      } else {
        // shiori is not live, find the last stream
        let pastStreamIndex = data.items.findIndex((item) => item.status !== 'upcoming');
        handlePastStream(data.items[pastStreamIndex]);
      }
    })
    .catch((error) => {
      console.error('Error fetching data from the API:', error);
    });
};

function handleLiveStream(liveStream) {
  document.getElementById('result').innerHTML = `<img id="happy" src="assets/happy.png">`;

  const isshiori = liveStream.channel.id === shiori_id;
  document.getElementById('status').innerHTML = isshiori ? 'shiori IS LIVE' : 'shiori IS HERE';

  displayStreamInfo(liveStream.channel.id, liveStream.title, liveStream.id, isshiori);
}

function handlePastStream(pastStream) {
  const lastStreamDate = new Date(pastStream.available_at);
  htmlTimer();
  startTimer(correctTime(lastStreamDate, pastStream.duration));
  getRandomImage();
}

function displayStreamInfo(channelId, title, videoId, isshiori) {
  // Fetch stream info of the channel shiori is streaming/featured on
  fetch(
    `https://www.googleapis.com/youtube/v3/activities?part=snippet,contentDetails&maxResults=2&channelId=${channelId}&type=upload&key=YOUR_YOUTUBE_API_KEY`
  )
    .then((response) => response.json())
    .then((data) => {
      const streamThumbnail = isshiori ? data.items[0].snippet.thumbnails.maxres.url : data.items[1].snippet.thumbnails.maxres.url;
      document.getElementById('live').innerHTML = `<img class="thumb" style="width: 131px; height: 99px; justify-content: left;" src="${streamThumbnail}">`;
      document.getElementById('live').innerHTML += `<a href="https://www.youtube.com/watch?v=${videoId}">${title}`;
    })
    .catch((error) => {
      console.error('Error fetching stream info:', error);
    });

  // Adding the little silly live text in the top right
  const live = document.getElementById('live');
  const icon = document.createElement('div');
  icon.setAttribute('id', 'live-icon');
  const svg = document.createElement('svg');
  const g = document.createElement('g');
  g.setAttribute('fill', 'white');
  const path = document.createElement('path');
  path.setAttribute(
    'd',
    'M9 8.00004C9 8.55004 8.55 9.00004 8 9.00004C7.45 9.00004 7 8.55004 7 8.00004C7 7.45004 7.45 7.00004 8 7.00004C8.55 7.00004 9 7.45004 9 8.00004ZM10.11 10.13L10.82 10.84C11.55 10.11 12 9.11004 12 8.00004C12 6.89004 11.55 5.89004 10.82 5.16004L10.11 5.87004C10.66 6.42004 11 7.17004 11 8.00004C11 8.83004 10.66 9.58004 10.11 10.13ZM5.18 10.84L5.89 10.13C5.34 9.58004 5 8.83004 5 8.00004C5 7.17004 5.34 6.42004 5.89 5.87004L5.18 5.16004C4.45 5.89004 4 6.89004 4 8.00004C4 9.11004 4.45 10.11 5.18 10.84ZM12.23 12.25L12.94 12.96C14.21 11.69 15 9.94004 15 8.00004C15 6.06004 14.21 4.31004 12.94 3.04004L12.23 3.75004C13.32 4.84004 14 6.34004 14 8.00004C14 9.66004 13.32 11.16 12.23 12.25ZM3.06 12.96L3.77 12.25C2.68 11.16 2 9.66004 2 8.00004C2 6.34004 2.68 4.84004 3.77 3.75004L3.06 3.04004C1.79 4.31004 1 6.06004 1 8.00004C1 9.94004 1.79 11.69 3.06 12.96Z'
  );
  const liveText = document.createElement('p');
  liveText.setAttribute('id', 'live-text');
  liveText.textContent = 'LIVE';

  live.appendChild(icon);
  icon.appendChild(svg);
  svg.appendChild(g);
  g.appendChild(path);
  live.appendChild(liveText);
}

function startTimer(lastStreamDate) {
  // Set up a timer to update the countdown every second
  setInterval(function() {
    // Calculate the difference between the current time and the date and time of the last stream
    const timeDifference = Date.now() - lastStreamDate.getTime();
    // Calculate the number of days, hours, minutes, and seconds
    const secondsInADay = 60 * 60 * 1000 * 24;
    const secondsInAHour = 60 * 60 * 1000;
    const days = Math.floor(timeDifference / secondsInADay);
    const hours = Math.floor((timeDifference % secondsInADay) / secondsInAHour);
    const mins = Math.floor((timeDifference % secondsInAHour) / (60 * 1000));
    const secs = Math.floor((timeDifference % (60 * 1000)) / 1000);
    // Update the countdown elements on the page with the updated values
    document.getElementById('days').innerHTML = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerHTML = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerHTML = mins < 10 ? '0' + mins : mins;
    document.getElementById('seconds').innerHTML = secs < 10 ? '0' + secs : secs;
  }, 1000);
}

function correctTime(oldDate, duration) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  oldDate.setHours(oldDate.getHours() + hours);
  oldDate.setMinutes(oldDate.getMinutes() + minutes);
  oldDate.setSeconds(oldDate.getSeconds() + seconds);

  return oldDate;
}

function htmlTimer() {
  // BEAUTIFUL way to add all these elements! (I hate it)
  const countupDiv = document.getElementById('countup1');
  countupDiv.innerHTML += '<span>It\'s been </span>';
  countupDiv.innerHTML += '<strong><span id="days">00</span>';
  countupDiv.innerHTML += '<strong><span> days </span>';
  countupDiv.innerHTML += '<strong><span id="hours">00</span>';
  countupDiv.innerHTML += '<strong><span> hours </span>';
  countupDiv.innerHTML += '<strong><span id="minutes">00</span>';
  countupDiv.innerHTML += '<strong><span> minutes </span>';
  countupDiv.innerHTML += '<strong><span id="seconds">00</span>';
  countupDiv.innerHTML += '<strong><span> seconds </span>';
  countupDiv.innerHTML += '<span>since last stream</span>';
}


