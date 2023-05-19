let head = document.getElementsByTagName("head")[0];
let cookie_script = document.createElement("script");
cookie_script.src = "https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js";
head.appendChild(cookie_script);

function get_cookie(cookie_name) {
    var cookie_value = Cookies.get(cookie_name);

    if (cookie_value == "" || cookie_value === undefined) {
        cookie_value = window.localStorage.getItem(cookie_name);
        try {
            var parsed_value = JSON.parse(cookie_value);
            cookie_value = parsed_value;
        } catch (err) {
            
        }
    }

    return cookie_value;
}

function set_cookie(cookie_name, cookie_value) {
 
    Cookies.set(cookie_name, cookie_value, { expires: 120, path: '' });
    if (typeof cookie_value == "object") {
        var cookie_value = JSON.stringify(cookie_value);
    }
  
    window.localStorage.setItem(cookie_name, cookie_value);
}