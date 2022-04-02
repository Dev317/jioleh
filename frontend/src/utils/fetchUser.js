export const fetchUser = () => {
    if(localStorage.getItem('user') !== 'undefined') {
        return JSON.parse(localStorage.getItem('user'))
    }
    else if(localStorage.getItem('vendor') == null) {
        return localStorage.clear();
    }
}