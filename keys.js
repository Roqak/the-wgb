// add this file to .gitignore

module.exports = {
    mongodb:{
        dbURI: 'mongodb://localhost/testForAuth'
    }
};
//mongodb://localhost/testForAuth
//mongodb://wgbadmin:wgbadmin1@ds227594.mlab.com:27594/the-wgb


console.time('looper');
var i =0;
while(i < 10000){
    i++;
}
console.timeEnd('looper');