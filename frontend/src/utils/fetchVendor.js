export const fetchVendor = () => {
  if(localStorage.getItem("vendor") !== null) {
    return JSON.parse(localStorage.getItem("vendor"))
  }
  else if(localStorage.getItem("user") == null) {
    return localStorage.clear();
  }
};
