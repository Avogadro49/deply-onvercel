//? @desc Get All Boot camps
//? @route GET /api/v1/bootcamps
//? @access Public
//? @action index
exports.getBootCamps = (req, res, next) => {
  res.status(200).json({ success: "true", message: "Show all boot camps" });
};

//? @desc Get single Boot camp
//? @route GET /api/v1/bootcamps/:id
//? @access Public
//? @action index
exports.getBootCamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: "true", message: `get boot camp ${req.params.id}` });
};

//? @desc store single  Boot camp
//? @route POST /api/v1/bootcamps/:id
//? @access Public
//? @action store
exports.createBootCamp = (req, res, next) => {
  res.status(201).json({ success: "true", message: "Create new boot camp" });
};

//? @desc create single  Boot camps
//? @route PUT /api/v1/bootcamps/:id
//? @access Private
//? @action update
exports.updateBootCamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: "true", message: `Update boot camp ${req.params.id}` });
};

//? @desc create single  Boot camps
//? @route PUT /api/v1/bootcamps/:id
//? @access Private
//? @action delete
exports.deleteBootCamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: "true", message: `delete boot camp ${req.params.id}` });
};
