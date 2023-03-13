import NetInfo from '@react-native-community/netinfo';
import Axios from 'axios';
import {errorMessage} from '_utils/errorMessages';

let source = null;
// let baseUrl = 'http://10.0.2.2:8080';
let baseUrl = 'http://jubranapi.us-east-1.elasticbeanstalk.com';

async function api(path, data, method) {
  source = Axios.CancelToken.source();

  const options = {
    method,
    url: baseUrl + path,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...(data && {data: JSON.stringify(data)}),
  };
  console.log('hooooooooooo:' + baseUrl + path);
  return NetInfo.fetch().then(state => {
    if (state.isConnected) {
      return Axios(options)
        .then(response => {
          return response;
        })
        .catch(error => {
          if (Axios.isCancel(error)) {
            console.log(error); // API CANCELED
          } else if (error.response) {
            return Promise.reject({
              //     message: error.response.data ? error.response.data : '',
              //     status: error.response.status,
              ...error.response.data,
            });
          }
        });
    }
    return Promise.reject({
      message: errorMessage.networkError,
      status: 0,
    });
  });
}

function cancelApi() {
  source && source.cancel();
}

export {api, cancelApi};
