// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
const {dialogflow} = require('actions-on-google');  
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const firebaseAdmin = require('firebase-admin');

firebaseAdmin.initializeApp(functions.config().firebase);

const userInfo = firebaseAdmin.database().ref('/userInfo');

const app = dialogflow ({debug:true});


app.intent('lucky number', (conv, {color}) => {
  var luckyNum = color.length *35;
  var datetime = new Date();
  conv.ask (`Your lucky number is ${luckyNum}, what is your id?`);
  console.log(conv.user);
  userInfo.push().set({
    luckyNumber: luckyNum,
    dateTime: ''+datetime+''
  });
});

app.intent('get data', (conv,{userId})=>{
  // var id=userId;
  var luckynum = 0;
  console.log(userId);
  return userInfo.once('value').then(snapshot => {
    console.log(snapshot);
      // var count = 0;
      snapshot.forEach(users => {
        // console.log(`Çheck data within for`);
          // console.log(users);
          var user = users.val();
          if(userId == user.userId)
             luckynum = user.luckyNumber;
            
      });

      console.log(luckynum);
      conv.ask(`Your lucky number is ${luckynum}`);
    
    
  })
  .catch(error =>{
    console.log('Érror');
    console.log(error);
  })
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);