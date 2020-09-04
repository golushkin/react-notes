import axios from 'axios'

export function get_data_from_links(note) {
  return Promise.allSettled(note.links.map(link => req_to_link(link.link)))
    .then(results => {
      note.links = results.map((result, i) => {
        if (result.status === "fulfilled") {
          let domparser = new DOMParser()
          let doc = domparser.parseFromString(result.value.data, 'text/html')
          let title = doc.querySelector('meta[property="og:title"]').getAttribute('content')
          let image = doc.querySelector('meta[property="og:image"]').getAttribute('content')
          return { ...note.links[i], title, image }
        }
        if (result.status === "rejected") {
          return note.links[i]
        }
      })

      return note
    });
}


function req_to_link(link) {
  return axios({
    method: 'get',
    url: 'https://cors-anywhere.herokuapp.com/' + link,
  })
}