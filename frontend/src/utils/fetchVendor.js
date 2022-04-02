export const fetchVendor = () => {
  // const vendorInfo =
  //   localStorage.getItem("vendor") !== null
  //     ? JSON.parse(localStorage.getItem("vendor"))
  //     : localStorage.clear();
  // return vendorInfo;

  if(localStorage.getItem("vendor") !== null) {
    return JSON.parse(localStorage.getItem("vendor"))
  }
  else if(localStorage.getItem("user") == null) {
  return localStorage.clear();
  }

};
