'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var AccessSchema = new Schema({
  Prefix: String,
  Suffix:String,
  Call_FirstName:String,
  Call_Surname:String,
  Call_MiddleName:String,
  Branch:String,
  MobileNumber:Number,
  Category:String,
  DepositSlipNo:String,
  EnrolmentNo:String,
  Sex:String,
  AmountRemitted:String,
  resolved:{type:Boolean,default: false},
  dataType:String,
  OrderIdOrderId:String,
  PaymentType:String,
  Fullname:String,
  deleted:Boolean
});

module.exports = mongoose.model('Access', AccessSchema, 'AccessData');

