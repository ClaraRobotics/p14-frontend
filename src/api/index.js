import axios from 'axios';


export default axios.create({
  baseURL:
    process.env.ROBOT_ENV === 'production'
      ? 'http://localhost:8082'
      : 'http://localhost:8082',
  // baseURL: 'https://palletizer.mixipedia.org',
  headers: { 'X-API-KEY': 'test' },
});
