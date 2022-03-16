export const fetchVendor = () => {
    const vendorInfo = localStorage.getItem('vendor') ? JSON.parse(localStorage.getItem('vendor')) : localStorage.clear();
    return vendorInfo;
}