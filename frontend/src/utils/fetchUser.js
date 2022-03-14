export const fetchUser = () => {
    const userInfo = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
    return userInfo;
}

export const fetchVendor = () => {
    const vendorInfo = localStorage.getItem('vendor') !== 'undefined' ? JSON.parse(localStorage.getItem('vendor')) : localStorage.clear();
    return vendorInfo;
}