/**
@author: Sajan Paul,
@since:  2019-12-07,
@description : Rest API Wrapper
*/
export function http(url, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = (event) => {
        if (xhr.readyState === xhr.OPENED) {
            // loader(30);
        }
        else if (xhr.readyState === xhr.HEADERS_RECEIVED) {
            // loader(40);
        }
        else if (xhr.readyState === xhr.LOADING) {
        }
        else if (xhr.readyState === xhr.DONE) {
            // loader(100);
        }
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
            if (xhr.status === 200) {
                callback(true, JSON.parse(xhr.response));
            }
            else {
                callback(false, xhr);
            }
        }
    };
    xhr.onprogress = (event) => {
        if (event.lengthComputable) {
            var percentComplete = event.loaded / event.total * 60;
            console.log(percentComplete);
            // loader(Math.floor(percentComplete) + 40)
        }
        else {
            // loader(60);
        }
    };
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}
//# sourceMappingURL=http.js.map