// import { notification } from 'antd';
import { useState, useLayoutEffect } from 'react';
import jwtDecode from 'jwt-decode'
import { PAGE_LIMIT } from '../common/constants'

// export const errorNotification = (serverErrors) => {
//   if (serverErrors && serverErrors.message) {
//     notification.error({
//       message: 'Error',
//       description: serverErrors.message
//     });
//   } else {
//     notification.error({
//       message: 'Error',
//       description: 'Some Error Occurred'
//     });
//   }
// };

// export const successNotification = (apiResponse) => {
//   notification.success({
//     message: 'Success',
//     description: apiResponse && apiResponse.message
//   });
// };

// export const onFinishFailed = errorInfo => {
//   notification.error({
//     message: 'Error',
//     description: errorInfo.errorFields[0].errors,
//   });
// };

// export const useWindowSize = () => {
//   const [size, setSize] = useState([0, 0]);
//   useLayoutEffect(() => {
//     function updateSize() {
//       setSize([window.innerWidth, window.innerHeight]);
//     }
//     window.addEventListener('resize', updateSize);
//     updateSize();
//     return () => window.removeEventListener('resize', updateSize);
//   }, []);
//   return size;
// }

export const jwtTokenDecode = () => {
  const decodedToken = jwtDecode(localStorage.token);
  return decodedToken;
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export const makeQueryParamterString = (paramsDictionary) => {
  let params = null;
  Object.keys(paramsDictionary).forEach(key => {
    if (paramsDictionary[key] === undefined || paramsDictionary[key] === '' || paramsDictionary[key] === null) {
      delete paramsDictionary[key];
    }
  });

  if (isEmpty(paramsDictionary)) {
    params = `?page=1&limit=${PAGE_LIMIT}`
  }
  else {
    params = '?'
    Object.keys(paramsDictionary).forEach((key, index) => {
      index === 0 ? params += key + '=' + paramsDictionary[key] : params += '&' + key + '=' + paramsDictionary[key]
    });
  }

  return params;
}

export function ConvertToCommaSplitArray(list, fieldId) {
  var temp = []
  for (var i in list) {
    temp.push(list[i][fieldId])
  }
  return temp
}

export function ProcessDataInArray(lst, fieldName = "Id") {
  var tempLst = []
  for (var i in lst) {
    tempLst[lst[i][fieldName]] = lst[i]
  }
  return tempLst;
}