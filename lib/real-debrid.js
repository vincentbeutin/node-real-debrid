var request = require('request');
var url = require('url');
var fs = require('fs');
var progress = require('request-progress');
var humanize = require('humanize');

var connect = function(user, password, callback) {
    var connectOptions = {
        url: 'http://real-debrid.fr/ajax/login.php?user=' + user + '&pass=' + password + '&captcha_challenge=&captcha_answer=&time=' + (new Date().getTime()),
        jar: true,
        followAllRedirects: true,
        encoding: 'utf-8'
    };

    request(connectOptions, function (error, response, body) {
        if (!error && response.statusCode == 200 && JSON.parse(body).error == 0) {
            callback(true);
        }else if(JSON.parse(body).error > 0){
            callback(JSON.parse(body).message);
        }
        else if(error){
            callback(error);
        }
    });
}

var debrid = function(user, password, link, callback) {
    var debridOptions = {
        url: 'http://real-debrid.fr/ajax/unrestrict.php?link=' + link + '&password=&remote=1&time=' + (new Date().getTime()),
        jar: true,
        followAllRedirects: true,
        encoding: 'utf-8',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13'
        }
    };

    connect(user, password, function(response){
        if(response === true){
            request(debridOptions, function (error, response, body) {
                if (!error && response.statusCode == 200 && JSON.parse(body).error == 0) {
                    callback ({link: JSON.parse(body).main_link, name: url.parse(JSON.parse(body).main_link).pathname.split('/').pop()}, null);
                }else{
                    callback (null, JSON.parse(body).message);
                }
            });
        }else{
            callback(null, response);
        }
    });
}

var download = function(link, path, callback) {

    var file_name = url.parse(link).pathname.split('/').pop();
    var lastBytesWriting = '';

    progress(request(link), {
        throttle: 2000,
        delay: 1000
    })
        .on('progress', function (state) {

            var chunkSize = state.received - lastBytesWriting;

            //var speedMbps = (((chunkSize / 1024).toFixed(2)) / 1024).toFixed(2);

            lastBytesWriting = state.received;

            callback({progress: {percent:state.percent, mbps: humanize.filesize(chunkSize), totalSize: humanize.filesize(state.total), bytesWriting: humanize.filesize(state.received)}});
        })
        .on('error', function (err) {
            callback(err);
        })
        .pipe(fs.createWriteStream(path + file_name))
        .on('error', function (err) {
            callback(err);
        })
        .on('close', function (err) {
            callback('end');
        })
}



exports.debrid = debrid;
exports.download = download;
