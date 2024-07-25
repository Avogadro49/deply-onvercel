function courseResource(course) {
  return {
    id: course._id,
    title: course.title,
    tuition: course.tuition,
    description: course.description,
    bootcamp: course.bootcamp,
  };
}

module.exports = courseResource;
