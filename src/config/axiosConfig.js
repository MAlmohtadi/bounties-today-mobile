var axios = require('axios');

const AxiosUtil = axios.create({
  // .. where we make our configurations
  baseURL: 'http://161.35.218.173:8080/all-mart-api/',
  /* other custom settings */
});

// Where you would set stuff like your 'Authorization' header, etc ...
// instance.defaults.headers.common['Authorization'] = 'AUTH TOKEN FROM INSTANCE';

// Also add/ configure interceptors && all the other cool stuff
const setAuthToken = (token) => {
  if (token) {
    AxiosUtil.defaults.headers.common.Authorization = token;
  } else {
    delete AxiosUtil.defaults.headers.common.Authorization;
  }
};

// instance.interceptors.request...

export {AxiosUtil, setAuthToken};
