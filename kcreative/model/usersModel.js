const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const appConfig = require("./../config/app");
const userSchema = mongoose.Schema({
  name: String,
  first_name: String,
  last_name: String,
  email: {
    type: String,
  },
  companyname: String,
  appearas: String,
  phoneno: String,
  businesstype: Number, //1 for small business // 2 for enterprises
  business_summary: String,
  aboutme: String, // freelancer only
  birthdate: String, //freelancer only
  address: String,
  city: String,
  state: String,
  zipcode: String,
  country: String,
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  travel_distance: { type: Number, default: 0 }, // in meters only
  english_proficiency: { type: Number, default: 1 }, //1 => basic  2 intermediate 3 expert, // freelancer only
  other_language: String, // freelancer only ,
  gender: { type: Number, default: 1 }, // 1=> male 2 => female, // only freelancer
  ethnicity: Array, // 1=> White ,2=> Black 3=>American Indian 4=> Asian 5=>Latino
  orientation: { type: Number, default: 1 }, // 1=> yes 2 => no
  disabilities: { type: Number, default: 1 }, // 1=> yes 2 => no
  availability: { type: Array, default: [] }, // 1=>Weekdays  2=>Evenings  3 =>Weekends
  image: String,
  website: String,
  linkedin_url: String,
  password: String,
  otp: Number,
  device_token: String,
  device_type: String,
  token: String,
  role: Number,
  notification: { type: Number, default: 1 }, // 1=> allow 0 not allow
  status: { type: Number, default: 1 }, //1 => active  0 deleted 2 inactive
  approved: { type: Number, default: 1 },
  profile_setup: { type: Number, default: 0 }, // 1 => profile setup  0=> profile not setup
  current_step: { type: Number, default: 1 }, // 1=> step1,2=>step ,3 => step 3 ,4 => step4 ,5=> step=> 6
  email_confirmed: { type: Number, default: 0 },
  freelancer_type: { type: Number }, // 1 => Graphic designer 2 => Editor
  created: { type: Date, default: Date.now },
  socket_id: { type: String, default: "" },
  travel_distance: { type: Number, default: 0 }, // in meters only
  english_proficiency: { type: Number }, //1 => basic  2 intermediate 3 expert, // freelancer only
  other_language: String, // freelancer only ,
  gender: { type: Number }, // 1=> male 2 => female, // only freelancer
  ethnicity: Array, // 1=> White ,2=> Black 3=>American Indian 4=> Asian 5=>Latino
  orientation: { type: Number }, // 1=> yes 2 => no
  disabilities: { type: Number }, // 1=> yes 2 => no
  availability: { type: Array, default: [] }, // 1=>Weekdays  2=>Evenings  3 =>Weekends
  image: String,
  website: String,
  linkedin_url: String,
  password: String,
  otp: Number,
  device_token: String,
  device_type: String,
  token: String,
  notification: { type: Number, default: 1 }, // 1=> allow 0 not allow
  status: { type: Number, default: 1 }, //1 => active  0 deleted 2 inactive
  approved: { type: Number, default: 1 },
  profile_setup: { type: Number, default: 0 }, // 1 => profile setup  0=> profile not setup
  current_step: { type: Number, default: 0 }, // 0=> welcome 1=> step1,2=>step ,3 => step 3 ,4 => step4 ,5=> step=> 6
  email_confirmed: { type: Number, default: 0 },
  freelancer_type: { type: Number }, // 1 => Graphic designer 2 => Editor
  created: { type: Date, default: Date.now },
});

userSchema.pre("save", function (next) {
  //console.log('dfdfd');
  var user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.hash(user.password, null, null, function (err, hash) {
    user.password = hash;
    user.oldpassword = hash;
    next();
  });
});

userSchema.index({ location: "2dsphere" });

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("Users", userSchema);
