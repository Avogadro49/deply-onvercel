const mongoose = require("mongoose");

const BootCampSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Your Name"],
      unique: true,
      trim: true,
      maxLength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Please Add Description"],
      maxLength: [500, "Name can not be more than 50 characters"],
    },
    website: {
      type: String,
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
        "Please use valid URl",
      ],
    },
    phone: {
      type: String,
      maxLength: [20, "Phone number can not be more than 20 numbers"],
    },
    email: {
      type: String,
      match: [
        /^(?!\.)[a-zA-Z0-9._%+-]+(?!\..*)@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?<!\.)$/,
        "Please add a valid Email",
      ],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    location: {
      type: {
        type: String,
        enum: [
          "Frontend Development",
          "Backend Development",
          "Fullstack Development",
          "DevOps",
          "Data Science",
          "Machine Learning",
          "Mobile Development",
          "Game Development",
          "other",
        ],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    averageRating: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating can not be more than 10"],
    },
    averageCost: Number,
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    housing: {
      type: Boolean,
      default: false,
    },
    jobAssistance: {
      type: Boolean,
      default: false,
    },
    jobGuarantee: {
      type: Boolean,
      default: false,
    },
    acceptGi: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      // required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Cascade delete courses when a bootcamp is deleted
// BootCampSchema.pre("remove", async function (next) {
//   console.log(`Courses being removed from bootcamp ${this._id}`);
//   await this.model("Course".deleteMany({ bootcamp: this._id }));
//   next();
// });
BootCampSchema.pre("findOneAndDelete", async function (next) {
  const bootcamp = await this.model.findOne(this.getQuery());
  if (bootcamp) {
    await bootcamp.model("Course").deleteMany({ bootcamp: bootcamp._id });
    console.log(`Courses being Deleted at id: ${bootcamp._id}`);
  }
  next();
});

//Reverse populate with virtuals
BootCampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

module.exports = mongoose.model("Bootcamp", BootCampSchema);
