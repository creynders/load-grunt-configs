module.exports = function(){
    var host = 'localhost';
    var port = 9000;
    return {
        options : {
            port       : port,
            livereload : 35729,
            // Change this to '0.0.0.0' to access the server from outside
            hostname   : host
        },
        docs    : {
            options : {
                open : 'http://' + host + ':' + port + '/README.html',
                base : ['.tmp']
            }
        }

    };
};
