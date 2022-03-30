export const fetchVendor = () => {
  const vendorInfo =
    localStorage.getItem("vendor") !== null
      ? JSON.parse(localStorage.getItem("vendor"))
      : localStorage.clear();
  return vendorInfo;
};
