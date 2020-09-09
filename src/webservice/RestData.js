import axios from 'axios'

export function get_data_from_links(links) {
  return Promise.allSettled(links.map(link => req_to_link(link.link)))
    .then(results => {
      let links_res = results.map((result, i) => {
        if (result.status === "fulfilled") {
          let domparser = new DOMParser()
          let doc = domparser.parseFromString(result.value.data, 'text/html')
          let title = doc.querySelector('meta[property="og:title"]').getAttribute('content')
          let image = doc.querySelector('meta[property="og:image"]').getAttribute('content')
          return { ...links[i], title, image }
        }
        if (result.status === "rejected") {
          return links[i]
        }
      })

      return Promise.resolve(links_res)
    });
}


function req_to_link(link) {
  return axios({
    method: 'get',
    url: 'https://cors-anywhere.herokuapp.com/' + link,
    headers:{
      Cookie: 'SameSite=None; Secure'
    }
  })
}