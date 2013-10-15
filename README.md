node-real-debrid
================

An easy way to debrid and download file from real-debrid using node.js

Install
------------

    npm install real-debrid


Usage
------------
```javascript
var realdebrid = require('real-debrid');

// DEBRID A LINK

realdebrid.debrid('user', 'mdp', 'http://link', function(response, error){
    if(response){
        console.log('Response: '+ response.link);

        //DOWNLOAD

        realdebrid.download(response.link, 'path/to/download/' + response.name, function(response){

            if (response.progress){
                console.log('progress: ' + response.progress.percent + "% Speed: " + response.progress.mbps + "Mbps " + response.progress.bytesWriting + "/" + response.progress.totalSize);
            }else if (response === 'end'){
                console.log('File downloaded.')
            }else{
                console.log('Error: ' + response);
            }
        });

    }else{
        console.log('Error: ' + error);
    }
});
```
