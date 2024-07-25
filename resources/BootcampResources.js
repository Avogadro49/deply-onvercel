const Course = require("../models/Course");

function bootCampResource(bootcamp) {
  return {
    id: bootcamp._id,
    name: bootcamp.name,
    email: bootcamp.email,
    createdAt: bootcamp.createdAt,
    averageCost: bootcamp.averageCost,
    description: bootcamp.description,
    courses: bootcamp.courses,
    //? full_name: [bootcamp.name, bootcamp.email].join(" "),
  };
}

module.exports = bootCampResource;
