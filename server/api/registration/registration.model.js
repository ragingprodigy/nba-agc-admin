'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('../user/user.model');

var pRef = require('../../components/tools/pRef');

var RegistrationSchema = new Schema({


    registrationCode : String,
    member: { type:String, default: 0 },
    user : { type: Schema.Types.ObjectId, ref: 'User' },
    _staff_ : { type: Schema.Types.ObjectId, ref: 'Auth' },
    owner : { type: Schema.Types.ObjectId, ref: 'User' },
    sponsor : { type: Schema.Types.ObjectId, ref: 'Sponsor' },
    prefix: { type:String, default: "" },
    firstName:  { type:String, default: "" },
    middleName:  { type:String, default: "" },
    surname:  { type:String, default: "" },
    suffix:  { type:String, default: "" },
    email:  { type:String, default: "", lowercase: true },
    phone:  { type:String, default: "" },
    mobile:  { type:String, default: "" },
    gender:  { type:String, default: "" },
    address:  { type:String, default: "" },
    company:  { type:String, default: "" },
    designation:  { type:String, default: "" },
    court:  { type:String, default: "" },
    state:  { type:String, default: "" },
    division:  { type:String, default: "" },
    branch:  { type:String, default: "" },
    nbaId:  { type:String, default: "" },
    material:  { type:String, default: "onsite" },
    tagPrinted: {
        type: Boolean,
        default: false
    },
    yearCalled: {
        type: String,
        default: 1960
    },
    regCode: {
        type:String,
        unique: true,
        default: pRef()
    },
    registrationType: {
        type:String,
        default: "legalPractitioner"
    },
    group:  {
        san: { type: Boolean, default: false },
        ag: { type: Boolean, default: false },
        bencher: { type: Boolean, default: false }
    },
    conferenceFee: {
        type: Number,
        default: 0
    },
    formFilled: {
        type: Boolean,
        default: false
    },
    completed: {
        type: Boolean,
        default: false
    },
    webpay: {
        type: Boolean,
        default: false
    },
    bankpay: {
        type: Boolean,
        default: false
    },
    paymentSuccessful: {
        type: Boolean,
        default: false
    },
    isGroup: {
        type: Boolean,
        default: false
    },
    isDirect: {
        type: Boolean,
        default: false
    },
    successMailSent: {
        type: Boolean,
        default: false
    },
    successTextSent: {
        type: Boolean,
        default: false
    },
    accountCreated: {
        type: Boolean,
        default: false
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    country:  { type:String, default: "" },
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
    international: { type: Boolean, default: false },
    responseGotten: { type: Boolean, default: false },
    certPrinted: { type: Boolean, default: false },
    _uploaded: { type: Boolean, default: false },
    _uploadTime: Date
});

RegistrationSchema.statics.pRef = pRef;

RegistrationSchema.pre('save', function(next){
    this.lastModified = new Date();
    next();
});

module.exports = mongoose.model('Registration', RegistrationSchema);
