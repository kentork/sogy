const axios = require('axios');
const locations = require('./locations.json')


exports.ask = (location, date) => {
  const code = locations[location]

  if (code === undefined)
    return Promise.reject(new Error(`Parameter error: Can not find ${location} from a location list`))

  return axios.get(
    'http://weather.livedoor.com/forecast/webservice/json/v1', { params: { city: code } }
  )
  .then(response => {
    if(response.status == 200) {
      return response.data.description
    } else {
      return Promise.reject(new Error(`Request error: response error code`))
    }
  })
}
