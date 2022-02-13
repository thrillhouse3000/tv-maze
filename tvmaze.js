/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

async function getShows(qStr){
  let res = await axios.get('https://api.tvmaze.com/search/shows', {params:{q: qStr}});
  let shows = []
  for(let entry of res.data) {
    shows.push({id: entry.show.id, name: entry.show.name, summary: entry.show.summary, episodesUrl: entry.show.url, image: entry.show.image ? entry.show.image.original : 'https://tinyurl.com/tv-missing'})
  }
  return shows;
}

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img src=${show.image} class='card-img-top'>
           <div class="card-body">
             <h5 class="card-title text-center">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
           <button class='btn btn-primary' data-toggle="modal" data-target="#episodeModal">Episodes</button>
         </div>
       </div>
      `);
    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();
  let query = $("#search-query").val();
  if (!query) return;
  $("#episodes-area").hide();
  let shows = await getShows(query);
  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above

async function getEpisodes(id) {
  const res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = [];
  for(let ep of res.data) {
    episodes.push({id: ep.id, name: ep.name, season: ep.season, number: ep.number})
  }
  return episodes
}

function populateEpisodes(episodes){
  $('.modal-body').empty();
  for(let ep of episodes){
    $('.modal-body').append($(`<p><b>${ep.name}</b> (season ${ep.season}, episode ${ep.number})</p>`))
  }
}

$('#shows-list').on('click', 'button', async function handleEpisodes(evt) {
  evt.preventDefault();
  const {showId} = evt.target.parentElement.dataset
  const episodes = await getEpisodes(showId);
  populateEpisodes(episodes)
})
