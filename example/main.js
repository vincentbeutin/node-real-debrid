var realdebrid = require('../lib/real-debrid');


/*
 * Debrid a link
 */

realdebrid.debrid('user', 'mdp', 'http://link', function(response, error){
    if(response){
        console.log('Response: '+ response.link);

        /*
         * Download
         */
        realdebrid.download(response.link, 'videos/' + response.name, function(response){

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


