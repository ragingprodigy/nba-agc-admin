/**
 * Edited by Gbenga on 7/19/16.
 */

'use strict';

var sendGrid = require('sendgrid')(process.env.SENDGRID_API_KEY); //added by gbenga to test mail sending
var RegistrationMailError = require('../../api/registration/registration.mail.error.model');
var RegistrationMail = require('../../api/registration/registration.mail.model');

var request = require('request');
var moment = require('moment');


var message = {
  "html": '',
  "subject": '',
  "fromname": 'NBA AGC 2016',
  "from": 'registrations@nba-agc.org',
  "to": [],
  "replyto": 'registrations@nba-agc.org'

};

var sendMessage = function(message, callback) {
  sendGrid.send(message, function (result) {
    callback(result);
  });
};


exports.sendReminderMail = function(email, session, next){

  var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;"><div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="https://nba-agc.org/assets/images/561e82db.banner1.jpg"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2016</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"> </td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">You have registered to attend the session <b>' + session.title + '</b> and it starts in less than two (2) hours.<br><br><p>Start Time: ' + moment(session.start_time).format('HH:mm a') + '.</p><br></td></tr><tr><td height="50"></td></tr><tr><td height="50"></td></tr><tr><td height="30"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#000000;padding-right:10px">For further enquiries, please call Registration Support on <b>08068619570, 08106721947, 09059999693, 09085524199</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="padding-top:10px"><table><tbody><tr><td width="30%"><img style="max-width:100%" src="http://lawpavilion.com/img/official-logo.png"></td><td style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Enquiries and Conference Information </span>  Send emails to: registration@nba-agc.org</td></tr></tbody></table></td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

    var newMessage = message;
    newMessage.html = emailData;
    newMessage.subject = 'Your AGC 2016 Session Starts Soon!';
    newMessage.to= [email];

    sendMessage(newMessage, function(){
        return next();
    });
};

exports.sendReminderSMS = function(phone, session, next) {
    var message = 'The NBA AGC 2016 Session, '+session.title+' starts in less than two hours. It\'s taking place at '+session.venue+' by '+moment(session.start_time).format('HH:mm a');

    request('http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail='+process.env.SMS_OWNER_EMAIL+'&subacct='+process.env.SMS_SUB_ACCOUNT+'&subacctpwd='+process.env.SMS_SUB_ACCOUNT_PASSWORD+'&message='+message+'&sender='+process.env.SMS_SENDER+'&sendto='+phone+'&msgtype='+process.env.SMS_MSG_TYPE, function(error, resp, body) {
        return next();
    });
};

exports.sendBankRegistrationSuccessText = function(registration, next) {
    return next();
    var message = 'Dear '+ registration.firstName +', your NBA AGC 2016 registration has been confirmed! Your registration code is: '+registration.regCode+'-'+registration.conferenceFee;

    request('http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail='+process.env.SMS_OWNER_EMAIL+'&subacct='+process.env.SMS_SUB_ACCOUNT+'&subacctpwd='+process.env.SMS_SUB_ACCOUNT_PASSWORD+'&message='+message+'&sender='+process.env.SMS_SENDER+'&sendto='+registration.mobile+'&msgtype='+process.env.SMS_MSG_TYPE, function(error, resp, body) {

        if (!error && resp.statusCode === 200) {
            var Registration = registration.constructor;
            // Update the Registration to show that the Success Text Has been sent
            Registration.update({_id: registration._id}, { $set: { successTextSent: true} }, function(){
                if (next) { return next(null, body); }
            });

        } else {
            console.log('SMS Error: ', error);
            if (next) { next(error); }
        }

    });
};

exports.sendWebPaySuccessText = function(registration, next) {
    return next();
    var message = 'Dear '+ registration.firstName +', your NBA AGC 2016 registration has been confirmed following receipt of your payment! Your registration code is: '+registration.regCode+'-'+registration.conferenceFee;

    request('http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail='+process.env.SMS_OWNER_EMAIL+'&subacct='+process.env.SMS_SUB_ACCOUNT+'&subacctpwd='+process.env.SMS_SUB_ACCOUNT_PASSWORD+'&message='+message+'&sender='+process.env.SMS_SENDER+'&sendto='+registration.mobile+'&msgtype='+process.env.SMS_MSG_TYPE, function(error, resp, body) {

        if (!error && resp.statusCode === 200) {
            var Registration = registration.constructor;
            // Update the Registration to show that the Success Text Has been sent
            Registration.update({_id: registration._id}, { $set: { successTextSent: true} }, function(){
                if (next) { return next(null, body); }
            });

        } else {
            console.log('SMS Error: ', error);
            if (next) { next(error); }
        }

    });
};

exports.sendWebPaySuccessMail = function(registration, next) {
    var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;"><div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="http://www.nigerianbar.org.ng/images/logo12.png"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2016</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"><b>Dear Registrant</b></td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Your registration for the NBA Annual General Conference 2016 <b>"Democracy And Economic Development"</b> in <b>Port Harcourct</b> from <b>19th - 26th August, 2016</b> has been <b style="color:green;">CONFIRMED</b> following the receipt of your payment.<br><br>Please find below your payment information:<br><br>Registration Code: <b>{{code}}</b><br>Conference Fee: <b>NGN {{fee}}</b><br>Amount Paid: <b>NGN {{amount}}</b><br>Payment reference: <b>{{ref}}</b><br>Transaction Reference: <b>{{txnRef}}</b><br></td></tr><tr><td height="20"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Additional information regarding the Annual General Conference would be sent to you from time to time.</td></tr><tr><td height="50"></td></tr><tr><td height="30"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">For further details and enquiries, please call any of the following - Ayodeji Oni - <b>0803 345 2825</b>; Oti Edah, <b>0806 590 1348</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="padding-top:10px"><table><tbody><tr><td width="30%"><img style="max-width:100%" src="http://lawpavilion.com/img/official-logo.png"></td><td style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Enquiries and Conference Information </span>  Send emails to: support@nba-agc.org and registration@nba-agc.org</td></tr></tbody></table></td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

    var newMessage = message;
    newMessage.html = emailData.replace('{{code}}', (registration.regCode+'-'+registration.conferenceFee)).replace('{{fee}}', registration.conferenceFee).replace('{{amount}}', registration.Amount).replace('{{ref}}', registration.PaymentRef).replace('{{txnRef}}', registration.TransactionRef);

    if (registration.firstName!==undefined) { newMessage.html = newMessage.html.replace('Registrant', registration.firstName); }

    newMessage.subject = 'Registration for NBA AGC Confirmed!';
    newMessage.to[0].email = registration.email;

    sendMessage(newMessage, function(result){

        var Registration = registration.constructor;
        // Update the Registration to show that the Success Mail Has been sent
        Registration.update({_id: registration._id}, { $set: { successMailSent: true} }, function(){
            if (next) { return next(); }
        });

    });
};

exports.sendBankPaySuccessMail = function(registration, next) {
    return next();
    var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;"><div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="http://www.nigerianbar.org.ng/images/logo12.png"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2016</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"><b>Dear Registrant</b></td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Your registration for the NBA Annual General Conference 2016 <b>"Democracy And Economic Development"</b> in <b>Port Harcourct</b> from <b>19th - 26th August, 2016</b> has been <b style="color:green;">CONFIRMED</b> following the receipt of your payment.<br><br>Please find below your payment information:<br><br>Registration Code: <b>{{code}}</b><br>Conference Fee: <b>NGN {{fee}}</b><br>Amount Paid: <b>NGN {{amount}}</b><br>Teller No: <b>{{teller}}</b><br>Payment Date: <b>{{date}}</b><br></td></tr><tr><td height="20"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Additional information regarding the Annual General Conference would be sent to you from time to time.</td></tr><tr><td height="50"></td></tr><tr><td height="30"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">For further details and enquiries, please call any of the following - Ayodeji Oni - <b>0803 345 2825</b>; Oti Edah, <b>0806 590 1348</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="padding-top:10px"><table><tbody><tr><td width="30%"><img style="max-width:100%" src="http://lawpavilion.com/img/official-logo.png"></td><td style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Enquiries and Conference Information </span>  Send emails to: support@nba-agc.org and registration@nba-agc.org</td></tr></tbody></table></td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

    var newMessage = message;
    newMessage.html = emailData.replace('{{code}}', (registration.regCode+'-'+registration.conferenceFee)).replace('{{fee}}', registration.conferenceFee).replace('{{amount}}', registration.bankDeposit).replace('{{teller}}', registration.bankTeller).replace('{{date}}', moment(registration.bankDatePaid).format('ddd, Do MMM YYYY'));

    if (registration.firstName!==undefined) { newMessage.html = newMessage.html.replace('Registrant', registration.firstName); }

    newMessage.subject = 'Registration for NBA AGC Confirmed!';
    newMessage.to[0].email = registration.email;

    sendMessage(newMessage, function(result){

        var Registration = registration.constructor;
        // Update the Registration to show that the Success Mail Has been sent
        Registration.update({_id: registration._id}, { $set: { successMailSent: true} }, function(){
            if (next) { return next(); }
        });

    });
};

exports.sendGroupBankPaySuccessMail = function(invoice, next) {
    var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;"><div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="http://www.nigerianbar.org.ng/images/logo12.png"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2016</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"><b>Congratulations!</b></td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Your registration for the NBA Annual General Conference 2016 <b>"Democracy And Economic Development"</b> in <b>Port Harcourct</b> from <b>19th - 26th August, 2016</b> has been <b style="color:green;">CONFIRMED</b> following the receipt of your payment.<br><br>Please find below your payment information:<br><br>Order ID: <b>{{code}}</b><br>Invoice Amount: <b>NGN {{fee}}</b><br>Amount Paid: <b>NGN {{amount}}</b><br>Teller No: <b>{{teller}}</b><br>Payment Date: <b>{{date}}</b><br>Delegates: <b>{{total}}</b><br><br><hr>{{delegates}}<hr></td></tr><tr><td height="20"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Additional information regarding the Annual General Conference would be sent to you from time to time.</td></tr><tr><td height="50"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">For further details and enquiries, please call any of the following - Ayodeji Oni - <b>0803 345 2825</b>; Oti Edah, <b>0806 590 1348</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="padding-top:10px"><table><tbody><tr><td width="30%"><img style="max-width:100%" src="http://lawpavilion.com/img/official-logo.png"></td><td style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Enquiries and Conference Information </span>  Send emails to: support@nba-agc.org and registration@nba-agc.org</td></tr></tbody></table></td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

    var newMessage = message;

    var delegates = '<ol>';
    for (var i=0; i<invoice.registrations.length; i++) {
        var delegate = invoice.registrations[i];
        delegates += '<li>'+ delegate.prefix + ' ' + delegate.firstName + ' ' + delegate.middleName.substring(0,1) + ' ' + delegate.surname + ' <span style="font-size:small; color: #CCC;">' + delegate.suffix + '</span> ' + ' - <b>' + (delegate.regCode+'-'+delegate.conferenceFee) + '</b>' +'</li>';
    }

    delegates += '</ol>';

    newMessage.html = emailData.replace('{{code}}', (invoice.code+'-'+invoice.invoiceAmount)).replace('{{fee}}', invoice.invoiceAmount).replace('{{amount}}', invoice.bankDeposit).replace('{{teller}}', invoice.bankTeller).replace('{{date}}', moment(invoice.bankDatePaid).format('ddd, Do MMM YYYY')).replace('{{delegates}}', delegates).replace('{{total}}', invoice.registrations.length);

    newMessage.subject = 'Group Registration for NBA AGC Confirmed!';
    newMessage.to[0].email = invoice._group.email;

    sendMessage(newMessage, function(result){

        var Invoice = invoice.constructor;
        // Update the Invoice to show that the Success Mail Has been sent
        Invoice.update({_id: invoice._id}, { $set: { successMailSent: true} }, function(){
            if (next) { return next(); }
        });

    });
};

exports.sendGroupWebPaySuccessMail = function(invoice, next) {
    var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;"><div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="http://www.nigerianbar.org.ng/images/logo12.png"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2016</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"><b>Congratulations!</b></td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Your registration for the NBA Annual General Conference 2016 <b>"Democracy And Economic Development"</b> in <b>Port Harcourct</b> from <b>19th - 26th August, 2016</b> has been <b style="color:green;">CONFIRMED</b> following the receipt of your payment.<br><br>Please find below your payment information:<br><br>Order ID: <b>{{code}}</b><br>Invoice Amount: <b>NGN {{fee}}</b><br>Amount Paid: <b>NGN {{amount}}</b><br>Payment Reference: <b>{{ref}}</b><br>Transaction Reference: <b>{{txnRef}}</b><br>Delegates: <b>{{total}}</b><br><br><hr>{{delegates}}<hr></td></tr><tr><td height="20"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Additional information regarding the Annual General Conference would be sent to you from time to time.</td></tr><tr><td height="50"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">For further details and enquiries, please call any of the following - Ayodeji Oni - <b>0803 345 2825</b>; Oti Edah, <b>0806 590 1348</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="padding-top:10px"><table><tbody><tr><td width="30%"><img style="max-width:100%" src="http://lawpavilion.com/img/official-logo.png"></td><td style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Enquiries and Conference Information </span>  Send emails to: support@nba-agc.org and registration@nba-agc.org</td></tr></tbody></table></td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

    var newMessage = message;

    var delegates = '<ol>';
    for (var i=0; i<invoice.registrations.length; i++) {
        var delegate = invoice.registrations[i];
        delegates += '<li>'+ delegate.prefix + ' ' + delegate.firstName + ' ' + delegate.middleName.substring(0,1) + ' ' + delegate.surname + ' <span style="font-size:small; color: #CCC;">' + delegate.suffix + '</span> ' + ' - <b>' + (delegate.regCode+'-'+delegate.conferenceFee) + '</b>' +'</li>';
    }

    delegates += '</ol>';

    newMessage.html = emailData.replace('{{code}}', (invoice.code+'-'+invoice.invoiceAmount)).replace('{{fee}}', invoice.invoiceAmount).replace('{{amount}}', invoice.Amount).replace('{{ref}}', invoice.PaymentRef).replace('{{txnRef}}', invoice.TransactionRef).replace('{{delegates}}', delegates).replace('{{total}}', invoice.registrations.length);

    newMessage.subject = 'Group Registration for NBA AGC Confirmed!';
    newMessage.to[0].email = invoice._group.email;

    sendMessage(newMessage, function(result){

        var Invoice = invoice.constructor;
        // Update the Invoice to show that the Success Mail Has been sent
        Invoice.update({_id: invoice._id}, { $set: { successMailSent: true} }, function(){
            if (next) { return next(); }
        });

    });
};

exports.sendGroupBankPaySuccessText = function(invoice, next) {
    var message = 'Payment of NGN ' + invoice.invoiceAmount + ' for Invoice Number: '+invoice.code+'-'+invoice.invoiceAmount+' has been received and registration for '+ invoice.registrations.length +' delegate' + (invoice.registrations.length>1?'s':'') + ' is now confirmed!';

    request('http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail='+process.env.SMS_OWNER_EMAIL+'&subacct='+process.env.SMS_SUB_ACCOUNT+'&subacctpwd='+process.env.SMS_SUB_ACCOUNT_PASSWORD+'&message='+message+'&sender='+process.env.SMS_SENDER+'&sendto='+invoice._group.phone+'&msgtype='+process.env.SMS_MSG_TYPE, function(error, resp, body) {

        if (!error && resp.statusCode === 200) {
            var Invoice = invoice.constructor;
            // Update the Invoice to show that the Success Text Has been sent
            Invoice.update({_id: invoice._id}, { $set: { successTextSent: true} }, function(){
                if (next) { return next(null, body); }
            });

        } else {
            console.log('SMS Error: ', error);
            if (next) { next(error); }
        }

    });
};

exports.sendGroupWebPaySuccessText = function(invoice, next) {
    var message = 'Payment of NGN ' + invoice.Amount + ' for Invoice Number: '+invoice.code+'-'+invoice.invoiceAmount+' has been received and registration for '+ invoice.registrations.length +' delegate' + (invoice.registrations.length>1?'s':'') + ' is now confirmed!';

    request('http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail='+process.env.SMS_OWNER_EMAIL+'&subacct='+process.env.SMS_SUB_ACCOUNT+'&subacctpwd='+process.env.SMS_SUB_ACCOUNT_PASSWORD+'&message='+message+'&sender='+process.env.SMS_SENDER+'&sendto='+invoice._group.phone+'&msgtype='+process.env.SMS_MSG_TYPE, function(error, resp, body) {

        if (!error && resp.statusCode === 200) {
            var Invoice = invoice.constructor;
            // Update the Invoice to show that the Success Text Has been sent
            Invoice.update({_id: invoice._id}, { $set: { successTextSent: true} }, function(){
                if (next) { return next(null, body); }
            });

        } else {
            console.log('SMS Error: ', error);
            if (next) { next(error); }
        }

    });
};

exports.sendBankRegistrationSuccessMail = function(registration, next) {
    return next();
    var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;"><div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="http://www.nigerianbar.org.ng/images/logo12.png"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2016</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"><b>Dear Registrant</b></td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Your registration for the NBA Annual General Conference 2016 <b>"Democracy And Economic Development"</b> in <b>Port Harcourct</b> from <b>19th - 26th August, 2016</b> has been <b style="color:green;">CONFIRMED</b>.<br><br>Please find below your payment information:<br><br>Registration Code: <b>{{code}}</b><br>Amount Paid: <b>NGN {{amount}}</b><br>Payment reference: <b>{{ref}}</b><br></td></tr><tr><td height="20"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Additional information regarding the Annual General Conference would be sent to you from time to time.</td></tr><tr><td height="50"></td></tr><tr><td height="30"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">For further details and enquiries, please call any of the following - Ayodeji Oni - <b>0803 345 2825</b>; Oti Edah, <b>0806 590 1348</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="padding-top:10px"><table><tbody><tr><td width="30%"><img style="max-width:100%" src="http://lawpavilion.com/img/official-logo.png"></td><td style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Enquiries and Conference Information </span>  Send emails to: support@nba-agc.org and registration@nba-agc.org</td></tr></tbody></table></td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

    var newMessage = message;
    newMessage.html = emailData.replace('{{code}}', (registration.regCode+'-'+registration.conferenceFee)).replace('{{amount}}', registration.conferenceFee).replace('{{ref}}', registration.bankTeller);

    if (registration.firstName!==undefined) { newMessage.html = newMessage.html.replace('Registrant', registration.firstName); }

    newMessage.subject = 'Registration for NBA AGC Confirmed!';
    newMessage.to[0].email = registration.email;

    sendMessage(newMessage, function(result){

        var Registration = registration.constructor;
        // Update the Registration to show that the Success Text Has been sent
        Registration.update({_id: registration._id}, { $set: { successMailSent: true} }, function(){
            if (next) { return next(); }
        });

    }, function(e) {

        RegistrationMailError.create(e, function(err, rme) {
            if(err) { return next(err); }

            return next();
        });
    });
};

exports.sendReportEmail = function(theMessage, subject, callback) {
    var newMessage = message;
    newMessage.html = theMessage;
    newMessage.subject = subject;
    newMessage.to = [
        { email: 'dapo.omonayajo@gitlimited.com', type: 'to' },
        { email: 'benedicta.moha@lawpavilion.com', type: 'to' },
        { email: 'ope.olugasa@gitlimited.com', type: 'to' },
    ];

    sendMessage(newMessage, function(){
        return callback();
    }, function(e) {
        return callback(e);
    });
};

exports.sendRegistrationTextWithUsername = function(registration, password, username, next) {
    return next();
    var message = 'Dear '+ registration.firstName +', Registration confirmed! Visit https://nba-agc.org/myaccount to login. Username: '+ username +', password: '+ password;

    request('http://www.smslive247.com/http/index.aspx?cmd=sendquickmsg&owneremail='+process.env.SMS_OWNER_EMAIL+'&subacct='+process.env.SMS_SUB_ACCOUNT+'&subacctpwd='+process.env.SMS_SUB_ACCOUNT_PASSWORD+'&message='+message+'&sender='+process.env.SMS_SENDER+'&sendto='+registration.mobile+'&msgtype='+process.env.SMS_MSG_TYPE, function(error, resp, body) {

        if (!error && resp.statusCode === 200) {
            next(null, body);
        } else {
            console.log('SMS Error: ', error);
            next(error);
        }

    });
};

exports.sendWelcomeMailWithUsername = function(registration, password, username, next) {
    return next();
    var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;">    <div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="http://www.nigerianbar.org.ng/images/logo12.png"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2016</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"><b>Dear Registrant</b></td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Thank you for your interest to be part of the NBA Annual General Conference 2016 <b>"Democracy And Economic Development"</b> in <b>Port Harcourct</b> from <b>19th - 26th August, 2016</b>.<br><br>You can now access your Conference Account online here: <a href="https://nba-agc.org/myaccount" style="color: green;">https://nba-agc.org/myaccount</a> using the login details below to access your account:<br><br>Username: <b>{{email}}</b><br>Password: <b>{{password}}</b><br><br></td></tr><tr><td height="20"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Through your account you can print your payment receipt, preview the conference guide and programme, and much more.</td></tr><tr><td height="50"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:25px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#000000;padding-right:10px; text-align: center;"><span style="background: green; padding: 10px; border-radius: 5px;"><a href="https://nba-agc.org/" style="color:#FFFFFF; text-decoration:none;">Go To Conference Portal</a></span></td></tr><tr><td height="50"></td></tr><tr><td height="30"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">For further details and enquiries, please call any of the following - Ayodeji Oni - <b>0803 345 2825</b>; Oti Edah, <b>0806 590 1348</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="padding-top:10px"><table><tbody><tr><td width="30%"><img style="max-width:100%" src="http://lawpavilion.com/img/official-logo.png"></td><td style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Enquiries and Conference Information </span>  Send emails to: support@nba-agc.org and registration@nba-agc.org</td></tr></tbody></table></td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

    var newMessage = message;
    newMessage.html = emailData.replace('{{password}}', password).replace('{{email}}', username);

    if (registration.firstName!==undefined) { newMessage.html = newMessage.html.replace('Registrant', registration.firstName); }

    newMessage.subject = 'Your Login Details for NBA AGC Registration Portal';
    newMessage.to[0].email = registration.email;

    sendMessage(newMessage, function(result){

        var _rm = {
            "email": result[0].email,
            "status": result[0].status,
            "reject_reason": result[0].reject_reason,
            "id": result[0]._id
        };

        RegistrationMail.create(_rm, function(err, rm) {
            if(err) { return next(err); }

            return next(null);
        });

    }, function(e) {

        RegistrationMailError.create(e, function(err, rme) {
            if(err) { return next(err); }

            return next(null);
        });
    });
};

exports.sendBranchCollected = function(repDetails,reg, next){

  var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;"><div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="https://nba-agc.org/assets/images/561e82db.banner1.jpg"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2016</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"> </td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Dear '+reg.firstName+',<br> Your Conference materials have been handed over to your branch representative, below is your branch Representative Details<br>' +
    '<p>Name: ' + repDetails.repName + '.</p>' +
    '<p>Phone: ' + repDetails.repPhone + '.</p>' +
    '<p>Email: ' + repDetails.repEmail + '.</p>' +
    '<p>Time Collected: ' + repDetails.Time + '.</p>' +
    '</td></tr><tr><td height="50"></td></tr><tr><td height="50"></td></tr><tr><td height="30"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#000000;padding-right:10px">For further enquiries, please call Registration Support on <b>08068619570, 08106721947, 09059999693, 09085524199</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="padding-top:10px"><table><tbody><tr><td width="30%"><img style="max-width:100%" src="http://lawpavilion.com/img/official-logo.png"></td><td style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Enquiries and Conference Information </span>  Send emails to: registration@nba-agc.org</td></tr></tbody></table></td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

  var destination = reg.mobile.indexOf("0") == 0 ? reg.mobile.replace(reg.mobile.indexOf("0"),"234") : "234"+reg.mobile;
  var url = 'http://52.206.236.158/mcast_ws_v2/index.php?user='+process.env.MCAST_USERNAME+'&password='+process.env.MCAST_PASSWORD+'&from='+process.env.SMS_FROM+'&to='+destination+'&message='+__message+'&type=json';
  var newMessage = message;
  newMessage.html = emailData;
  newMessage.subject = 'Conference Materials Collected By Branch Rep!';
  newMessage.to= [reg.email];

  request(url, function(error) {
    if (error) { return console.error(error); }
    sendMessage(newMessage, function(){
      if (next) { return next(); }
    });
  });
};

exports.sendIndividualCollected = function(reg, next){

  var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;"><div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="https://nba-agc.org/assets/images/561e82db.banner1.jpg"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2016</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"> </td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Dear '+reg.firstName+',<br> Your have Collected Your Conference materials <br>' +
    '<p>Name: ' + reg.firstName + ' '+reg.surname+'.</p>' +
    '<p>Phone: ' + reg.mobile + '.</p>' +
    '<p>Email: ' + reg.email + '.</p>' +
    '<p>Registration Code ' + reg.registrationCode + '.</p>' +
    '<p>Time Collected: ' + moment(reg.fastTrackTime).format('lll') + '.</p>' +
    '</td></tr><tr><td height="50"></td></tr><tr><td height="50"></td></tr><tr><td height="30"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#000000;padding-right:10px">For further enquiries, please call Registration Support on <b>08068619570, 08106721947, 09059999693, 09085524199</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="padding-top:10px"><table><tbody><tr><td width="30%"><img style="max-width:100%" src="http://lawpavilion.com/img/official-logo.png"></td><td style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Enquiries and Conference Information </span>  Send emails to: registration@nba-agc.org</td></tr></tbody></table></td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';

  var destination = reg.mobile.indexOf("0") == 0 ? reg.mobile.replace(reg.mobile.indexOf("0"),"234") : "234"+reg.mobile;
  var url = 'http://52.206.236.158/mcast_ws_v2/index.php?user='+process.env.MCAST_USERNAME+'&password='+process.env.MCAST_PASSWORD+'&from='+process.env.SMS_FROM+'&to='+destination+'&message='+__message+'&type=json';


  var newMessage = message;
  newMessage.html = emailData;
  newMessage.subject = 'Conference Materials Collected By FastTrack!';
  newMessage.to= [reg.email];
  request(url, function(error) {
    if (error) { return console.error(error); }
    sendMessage(newMessage, function(){
      if (next) { return next(); }
    });
  });
};

exports.sendGroupCollected = function(repDetails,reg, next){

  var emailData = '<div style="margin:0; padding:0; font-family:Segoe UI,Segoe UI,Arial,Sans-Serif;"><div style="margin:0; padding:0;"><div style="max-width:600px; margin: 10px auto 0; background-color: green;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px"><tbody><tr><td colspan="3" height="15"></td></tr><tr><td width="20"></td><td style="text-align: center;"><a href="http://nigerianbar.org.ng"><img src="https://nba-agc.org/assets/images/561e82db.banner1.jpg"></a></td></tr><tr><td colspan="3"><h3 align="left" valign="top" style="line-height:41px;font-size: 28px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: #FFFFFF; text-align:center; margin: 10px auto 0;">NBA Annual General Conference 2016</h3></td></tr><tr><td colspan="3" height="15"></td></tr></tbody></table></div><div style="max-width:600px; margin:0 auto; border-left: 1px solid #CCC; border-right: 1px solid #CCC; border-bottom: 1px solid #CCC; padding-bottom: 20px;"><table width="100%" border="0" cellspacing="0" cellpadding="0" style="display:block; max-width:600px;"><tbody><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:36px;font-size:23px;font-family:Segoe UI Light,Segoe UI,Arial,Sans-Serif;color: green;padding-right:15px;padding-left:0px"> </td></tr></tbody></table></td><td width="40"></td></tr><tr><td colspan="3" height="20"></td></tr><tr><td width="40"></td><td align="left" valign="top"><table width="520" border="0" cellspacing="0" cellpadding="0" style="display:block"><tbody><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;text-align: justify;color:#000000;padding-right:10px">Dear '+reg.firstName+',<br> Your Conference materials have been handed over to your Group representative, below is your group Representative Details<br>' +
    '<p>Phone: ' + repDetails.repPhone + '.</p>' +
    '<p>Email: ' + repDetails.repEmail + '.</p>' +
    '<p>Time Collected: ' + moment(repDetails.Time).format('lll') + '.</p>' +
    '</td></tr><tr><td height="50"></td></tr><tr><td height="50"></td></tr><tr><td height="30"></td></tr><tr><td align="left" valign="top" style="line-height:19px;font-size:15px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#000000;padding-right:10px">For further enquiries, please call Registration Support on <b>08068619570, 08106721947, 09059999693, 09085524199</b>. </td></tr><tr><td height="50" style="border-bottom:1px solid #CCC;"></td></tr><tr><td align="center" valign="top" style="padding-top:10px"><table><tbody><tr><td width="30%"><img style="max-width:100%" src="http://lawpavilion.com/img/official-logo.png"></td><td style="line-height:19px;font-size:12px;font-family: Segoe UI,Segoe UI,Arial,Sans-Serif;color:#4b4b4b;padding-right:10px; text-align:center;"><span style="color: #00CC39; font-weight:bold;">For Enquiries and Conference Information </span>  Send emails to: registration@nba-agc.org</td></tr></tbody></table></td></tr></tbody></table></td><td width="40"></td></tr></tbody></table></div></div></div>';


  var destination = reg.mobile.indexOf("0") == 0 ? reg.mobile.replace(reg.mobile.indexOf("0"),"234") : "234"+reg.mobile;
  var url = 'http://52.206.236.158/mcast_ws_v2/index.php?user='+process.env.MCAST_USERNAME+'&password='+process.env.MCAST_PASSWORD+'&from='+process.env.SMS_FROM+'&to='+destination+'&message='+__message+'&type=json';
  var newMessage = message;
  newMessage.html = emailData;
  newMessage.subject = 'Conference Materials Collected By Group Representative!';
  newMessage.to= [reg.email];

  request(url, function(error) {
    if (error) { return console.error(error); }
    sendMessage(newMessage, function(){
      if (next) { return next(); }
    });
  });
};
