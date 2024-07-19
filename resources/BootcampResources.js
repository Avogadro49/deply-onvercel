function bootCampResource(bootcamp) {
  return {
    id: bootcamp._id,
    name: bootcamp.name,
    email: bootcamp.email,
    createdAt: bootcamp.createdAt,
    full_name: [bootcamp.name, bootcamp.email].join(" "),
  };
}

module.exports = bootCampResource;
