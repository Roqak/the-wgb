// add this file to .gitignore

module.exports = {
    google: {
        clientID:'482458351987-d9seu4j5oa0c1ca7d8iqhc6opc90sjaa.apps.googleusercontent.com',
        clientSecret:'Gn4RGjFH6RsYcoGhq9tWIVJ0'
    },
    mongodb:{
        dbURI: 'mongodb://wgbadmin:wgbadmin1@ds227594.mlab.com:27594/the-wgb'
    }
};
//DEPLOYING TO HEROKU
//https://devcenter.heroku.com/articles/deploying-nodejs
//mongodb://localhost/testForAuth
//mongodb://wgbadmin:wgbadmin1@ds227594.mlab.com:27594/the-wgb


console.time('looper');
var i =0;
while(i < 10000){
    i++;
}
console.timeEnd('looper');