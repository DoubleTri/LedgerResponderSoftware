const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
var schedule = require('node-schedule');
var CronJob = require('cron').CronJob;
var fs = require('fs');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloworld = functions.https.onCall((data, context) => {

    const emailAddresses = data.recipients
    const output = `
      <h2>WCTRT Email</h2>
      <h5>This is an email from ${data.name} to ${data.recipients}</h5>
      <p>${data.message}</p>
    `
  // ** IF USING DELAYED OR SCHEDULED EMAIL, use below const
    //const delayedDate = new Date(2018, 0, 9, 13, 56, 0);
  
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
          user: '***', // generated ethereal user
          pass: '***'  // generated ethereal password
      },
      tls:{
        rejectUnauthorized: false
      }
  });
  
  // setup email data with unicode symbols
  let mailOptions = data.attachment ? 
    {
      from: '"WCTRT.org" <doubletriangle880@gmail.com>', // sender address
      to: data.group, // list of receivers
      replyTo: data.sender,
      subject: data.subject,
      attachments: [{
        filename: data.attachment.fileName,
        path: data.attachment.path
      }],
      html: output // html body
    }
    :
    {
      from: '"WCTRT.org" <***>', // sender address
      to: data.group, // list of receivers
      replyTo: data.sender,
      subject: data.subject,
      html: output // html body
    };
  
  // send mail with defined transport object
  
  // ** IF USING DELAYED OR SCHEDULED EMAIL, 'unlock' the below wrapper function
  // and the above 'delayedDate' const.
  
  //var j = schedule.scheduleJob(delayedDate, function () {
    //console.log('Delayed Email has been sent.');
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        return true
    });
  
  //});
  
    //console.log(output),
    return;
  })

  exports.equipment = functions.https.onCall((data, context) => {
    // var nextCal = data.dateMs + data.intervalMs;
    // console.log('equipment added success: ' + data.equipment + ' ' +  data.date + ' ' + data.interval + ' ' + data.contact + ' ' + data.dateMs +' ' +  data.intervalMs )
    // console.log('next calibration: ' + new Date(nextCal))
    // console.log('reminder email sent on: ' + new Date(nextCal - 604800000)) 
    // add one week = 604800000 ms

    data.obj.map(test)

    function test(item){
      console.log(item.equipment)

      var nextCal = item.dateMs + item.intervalMs;
      const emailAddresses = data.recipients
      const output = `
        <h2>WCTRT Email</h2>
        <h5>This is an email from LedgerHazMat to ${item.contact}</h5>
        <p>This is a reminder that ${item.equipment} is due for calibration on ${item.date}</p>
        <p>Please <a href='http://localhost:3000/equipment' target='_blank'>click here</a> to report calibration complete</p>
      `
    // ** IF USING DELAYED OR SCHEDULED EMAIL, use below const
      const delay = item.dateMs - 86280000
      console.log(new Date(delay).toJSON())
      console.log(new Date(delay).toLocaleTimeString())
      console.log(new Date(delay).getUTCFullYear()+', '+ new Date(delay).getUTCMonth()+', '+ new Date(delay).getUTCDate()+', '+ new Date(delay).getUTCHours()+', '+ new Date(delay).getUTCMinutes()+', '+ 0)
     
    
      let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'doubletriangle880@gmail.com', // generated ethereal user
            pass: 'engine72'  // generated ethereal password
        },
        tls:{
          rejectUnauthorized: false
        }
    });
    
    // setup email data with unicode symbols
    let mailOptions =  {
        from: '"WCTRT.org" <doubletriangle880@gmail.com>', // sender address
        to: item.contact, // list of receivers
        subject: `${item.equipment} Calibration Due`,
        html: output // html body
      }
    
    // send mail with defined transport object
    
    // ** IF USING DELAYED OR SCHEDULED EMAIL, 'unlock' the below wrapper function
    // and the above 'delayedDate' or 'var rule' const.

      var job = new CronJob(new Date(delay), () => {
        console.log('initial email sent on' + Date.now())

        var jobTwo = new CronJob('0 * * ? * *', () => {
          console.log('email sent....')
        }, () => {
          console.log('emails stopped')
        },
          true, /* Start the job right now */
          'America/Detroit' /* Time zone of this job. */
        );

      }, () => {
        console.log('stopped')
      },
        true, /* Start the job right now */
        'America/Detroit' /* Time zone of this job. */
      );
    
    // var j = schedule.scheduleJob(delayedDate, () => {
      // console.log('Initial email sent')
      // schedule.scheduleJob(rule, () => {
      //   console.log('Delayed Email has been sent.')

        // transporter.sendMail(mailOptions, (error, info) => {
        //   if (error) {
        //       return console.log(error);
        //   }
        //    return true
        //  });
        // });
    //});
    
      //console.log(output),
      return;

    }
  })


