'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var pRef = require('../../components/tools/pRef');

var InvoiceSchema = new Schema({
    code    : {
        type: String,
        unique:true,
        default: pRef()
    },
    invoiceAmount : { type: Number, default: 0 },
    invoiceDate     : {
        type: Date,
        default: Date.now
    },
    webpay: { type: Boolean, default: false },
    bankpay: { type: Boolean, default: false },
    finalized: { type: Boolean, default: false },
    paymentSuccessful: { type: Boolean, default: false },
    responseGotten: { type: Boolean, default: false },
    successTextSent: { type: Boolean, default: false },
    successMailSent: { type: Boolean, default: false },
    accountsCreated: { type: Boolean, default: false },
    isDirect: { type: Boolean, default: false },
    lastModified: {
        type: Date,
        default: Date.now
    },
    TransactionRef:  { type:String, default: "" },
    PaymentRef:  { type:String, default: "" },
    PaymentGateway:  { type:String, default: "" },
    Status:  { type:String, default: "" },
    ResponseCode:  { type:String, default: "" },
    ResponseDescription:  { type:String, default: "" },
    DateTime:  { type:String, default: "" },
    Amount:  { type:String, default: 0 },
    AmountDiscrepancyCode:  { type:String, default: "" },
    bankAccount:  { type:String, default: "" },
    bankDeposit:  { type:String, default: 0 },
    bankDatePaid:  { type:String, default: "" },
    bankBranch:  { type:String, default: "" },
    bankTeller:  { type:String, default: "" },
    statusConfirmed: { type: Boolean, default: false },
    _group : { type: Schema.Types.ObjectId, ref: 'User' },
    registrations : [{ type: Schema.Types.ObjectId, ref: 'Registration' }],
    fastTracked: {
      type: Boolean,
      default: false
    },
    fastTrackTime: Date
  });

InvoiceSchema.statics.pRef = pRef;

module.exports = mongoose.model('Invoice', InvoiceSchema);
