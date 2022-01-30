// import { notification } from 'antd';
import { useState, useLayoutEffect } from "react";
import jwtDecode from "jwt-decode";
import { PAGE_LIMIT } from "../common/constants";

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
};

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export const makeQueryParamterString = (paramsDictionary) => {
  let params = null;
  Object.keys(paramsDictionary).forEach((key) => {
    if (
      paramsDictionary[key] === undefined ||
      paramsDictionary[key] === "" ||
      paramsDictionary[key] === null
    ) {
      delete paramsDictionary[key];
    }
  });

  if (isEmpty(paramsDictionary)) {
    params = `?page=1&limit=${PAGE_LIMIT}`;
  } else {
    params = "?";
    Object.keys(paramsDictionary).forEach((key, index) => {
      index === 0
        ? (params += key + "=" + paramsDictionary[key])
        : (params += "&" + key + "=" + paramsDictionary[key]);
    });
  }

  return params;
};

export function ConvertToCommaSplitArray(list, fieldId) {
  let temp = [];
  for (let i in list) {
    temp.push(list[i][fieldId]);
  }
  return temp;
}

export function ProcessDataInArray(lst, fieldName = "Id") {
  let tempLst = [];
  for (let i in lst) {
    tempLst[lst[i][fieldName]] = lst[i];
  }
  return tempLst;
}

export const numberWithCommas = (num) => {
  if (num == 0) {
    return "0";
  }
  if (num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};

export const convertDateFormate = (date, formateType = 1) => {
  let tempDate = new Date(date);
  if (formateType == 1) {
    return `${tempDate.getFullYear()}-${
      tempDate.getMonth() + 1
    }-${tempDate.getDate()}`;
  } else {
    return `${tempDate.getDate()}-${
      tempDate.getMonth() + 1
    }-${tempDate.getFullYear()}`;
  }
};

export const getUrlQuerySearchParam = (filterType, startDate, endDate) => {
  let query = "";
  let current = new Date();
  let to = convertDateFormate(new Date());

  if (filterType) {
    if (filterType === "one-week") {
      let from = convertDateFormate(current.setDate(current.getDate() - 7));
      query = `startDate=${from}&endDate=${to}`;
    }
    if (filterType === "one-month") {
      let from = convertDateFormate(current.setMonth(current.getMonth() - 1));
      query = `startDate=${from}&endDate=${to}`;
    }
    if (filterType === "custom") {
      query = `startDate=${startDate}&endDate=${endDate}`;
    }
  }
  return query;
};

export const scrollToDiv = (id) => {
  if (document.getElementById(id)) document.getElementById(id).scrollIntoView();
};

export const ConvertToCurrency = (amount, converTo, USDRate = 0) => {
  let convertedAmount =
    converTo === "PKR"
      ? parseFloat(amount) * parseFloat(USDRate)
      : parseFloat(amount) / parseFloat(USDRate);
  return convertedAmount.toFixed(2).replace(/[.,]00$/, "");
};

export const ExportToCVS = (titles, data, fileName = "list") => {
  /*
   * Convert our data to CSV string
   */
  let CSVString = prepCSVRow(titles, titles.length, "");
  CSVString = prepCSVRow(data, titles.length, CSVString);

  /*
   * Make CSV downloadable
   */
  let downloadLink = document.createElement("a");
  let blob = new Blob(["\ufeff", CSVString]);
  let url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = `${fileName}.csv`;

  /*
   * Actually download CSV
   */
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

const prepCSVRow = (arr, columnCount, initial) => {
  let row = ""; // this will hold data
  let delimeter = ","; // data slice separator, in excel it's `;`, in usual CSv it's `,`
  let newLine = "\r\n"; // newline separator for CSV row

  /*
   * Convert [1,2,3,4] into [[1,2], [3,4]] while count is 2
   * @param _arr {Array} - the actual array to split
   * @param _count {Number} - the amount to split
   * return {Array} - splitted array
   */
  function splitArray(_arr, _count) {
    let splitted = [];
    let result = [];
    _arr.forEach(function (item, idx) {
      if ((idx + 1) % _count === 0) {
        splitted.push(item);
        result.push(splitted);
        splitted = [];
      } else {
        splitted.push(item);
      }
    });
    return result;
  }
  let plainArr = splitArray(arr, columnCount);
  // don't know how to explain this
  // you just have to like follow the code
  // and you understand, it's pretty simple
  // it converts `['a', 'b', 'c']` to `a,b,c` string
  plainArr.forEach(function (arrItem) {
    arrItem.forEach(function (item, idx) {
      row += item + (idx + 1 === arrItem.length ? "" : delimeter);
    });
    row += newLine;
  });
  return initial + row;
};

export const convertArrayToString = (
  list,
  separator = ", ",
  fieldName = ""
) => {
  let str = "";

  // list of objects
  if (fieldName) {
    for (let i in list) {
      str += str
        ? `${separator} ${list[i][fieldName]}`
        : `${list[i][fieldName]}`;
    }
  }
  // list of strings/integers
  else {
    for (let i in list) {
      str += str ? `${separator}${list[i]}` : `${list[i]}`;
    }
  }
  return str;
};
