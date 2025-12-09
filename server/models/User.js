const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImagePath: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    bookingList: {
            type: Array,
            default: [],
        },

        spaceList: {
            type: Array,
            default:[],
        }
        ,
        otp: {
          type: String,
          select: false,
          default: null,
        },
        otpExpiry: {
          type: Date,
          default: null,
        },
        otpRequestedAt: {
          type: Date,
          select: false,
          default: null,
        },
        // Fields used for password reset flow
        resetOtp: {
          type: String,
          select: false,
          default: null,
        },
        resetOtpExpiry: {
          type: Date,
          default: null,
        },
        resetOtpRequestedAt: {
          type: Date,
          select: false,
          default: null,
        },
        isVerified: {
          type: Boolean,
          default: false,
        }
        },
    {timestamps:true}
)

const User= mongoose.model("User", UserSchema)
module.exports=User