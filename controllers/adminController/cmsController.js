const { error, success } = require("../../service_response/userApiResponse");
const {
  HomeBanner,
  About,
  TermsAndConditions,
  PrivacyPolicy,
} = require("../../models/adminModels/cmsSchema");

// Adding Slides
exports.addSlide = async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res
      .status(201)
      .json(error("Please upload Banner Image", res.statusCode));
  }
  if (!description) {
    return res
      .status(201)
      .json(error("Please upload Banner Image", res.statusCode));
  }
  if (req.files.length == 0) {
    return res
      .status(201)
      .json(error("Please upload Banner Image", res.statusCode));
  }
  try {
    const counter = (await HomeBanner.find().count()) + 1;
    // console.log(counter);
    const banner = req.files[0].path;
    const add = new HomeBanner({
      slide: `Slide${counter}`,
      title: title,
      description: description,
      banner: banner,
    });
    // add.$inc("slideNum",1)
    await add.save();
    res
      .status(201)
      .json(success(res.statusCode, "Slide one added Successfully", add));
  } catch (err) {
    console.log(err);
    res.status(201).json(error("Error in adding Slide One", res.statusCode));
  }
};

// Edit Slides
exports.editSlide = async (req, res) => {
  const { slide, title, description } = req.body;
  if (!title) {
    return res
      .status(201)
      .json(error("Please upload Banner Image", res.statusCode));
  }
  if (!description) {
    return res
      .status(201)
      .json(error("Please upload Banner Image", res.statusCode));
  }
  if (req.files.length == 0) {
    return res
      .status(201)
      .json(error("Please upload Banner Image", res.statusCode));
  }
  try {
    const edit = await HomeBanner.findById(req.params._id);
    edit.title = title;
    edit.description = description;
    edit.banner = `${req.files[0].destination.replace("/public/images")}/${
      req.files[0].filename
    }`;
    await edit.save();
    res
      .status(201)
      .json(success(res.statusCode, "Slide Modified Successfully", edit));
  } catch (err) {
    console.log(err);
    res.status(201).json(error("Error in modifying Slide One", res.statusCode));
  }
};

// Delete Slides except slide 1
exports.deleteSlide = async (req, res) => {
  try {
    const deleteSlide = await HomeBanner.findById(req.params._id);
    if (deleteSlide.slide == "Slide1") {
      return res
        .status(201)
        .json(error("You are not allowed to delete Slide 1", res.statusCode));
    }
    await deleteSlide.delete()
    res
      .status(201)
      .json(success(res.statusCode, "Deletion Successful", deleteSlide));
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Error in slide deletion", res.statusCode));
  }
};

//Get all the slides
exports.getAllSlides = async (req, res) => {
  try {
    const slides = await HomeBanner.find();
    res.status(201).json(success(res.statusCode, "Slides", slides));
  } catch (err) {
    console.log(err);
    res.status(401).json(error("Error in fetching Slides", res.statusCode));
  }
};

// Adding -> About Us
exports.addAbout = async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res
      .status(201)
      .json(error("Please provide about us content", res.statusCode));
  }
  try {
    const add = new About({
      description: description,
    });
    const added = await add.save();
    res
      .status(201)
      .json(success(res.statusCode, `"About Us" added successfully`, added));
  } catch (err) {
    console.log(err);
    res.status(401).json(error(`Error in adding "About Us"`, res.statusCode));
  }
};

// Edit about Us
exports.editAbout = async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res
      .status(201)
      .json(error("Please provide About Us", res.statusCode));
  }
  try {
    const edit = await About.findOne({ title: "AboutUs" });
    // console.log(edit);
    edit.description = description;
    await edit.save();
    res
      .status(201)
      .json(success(res.statusCode, "Modified Successfully", edit));
  } catch (err) {
    console.log(err);
    res.status(401).json(error(`Error -> "About US"`));
  }
};

// Adding -> Terms and Conditions
exports.addTnC = async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res
      .status(201)
      .json(error("Please provide about us content", res.statusCode));
  }
  try {
    const add = new TermsAndConditions({
      description: description,
    });
    const added = await add.save();
    res
      .status(201)
      .json(success(res.statusCode, `"About Us" added successfully`, added));
  } catch (err) {
    console.log(err);
    res.status(401).json(error(`Error in adding "About Us"`, res.statusCode));
  }
};

// Edit terms and Condition
exports.editTnC = async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res
      .status(201)
      .json(error("Please provide About Us", res.statusCode));
  }
  try {
    const edit = await TermsAndConditions.findOne({ title: "TnC" });
    // console.log(edit);
    edit.description = description;
    await edit.save();
    res
      .status(201)
      .json(success(res.statusCode, "Modified Successfully", edit));
  } catch (err) {
    console.log(err);
    res.status(401).json(error(`Error -> "Terms and Conditions"`));
  }
};

// Adding -> Privacy Policy
exports.addPrivacyPolicy = async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res
      .status(201)
      .json(error("Please provide Privacy Policy content", res.statusCode));
  }
  try {
    const add = new PrivacyPolicy({
      description: description,
    });
    const added = await add.save();
    res
      .status(201)
      .json(
        success(res.statusCode, `"Privacy Policy" added successfully`, added)
      );
  } catch (err) {
    console.log(err);
    res
      .status(401)
      .json(error(`Error in adding "Privacy Policy"`, res.statusCode));
  }
};

// Edit Privacy Policy
exports.editPrivacyPolicy = async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res
      .status(201)
      .json(error("Please provide Privacy Policy", res.statusCode));
  }
  try {
    const edit = await PrivacyPolicy.findOne({ title: "PrivacyPolicy" });
    // console.log(edit);
    edit.description = description;
    await edit.save();
    res
      .status(201)
      .json(success(res.statusCode, "Modified Successfully", edit));
  } catch (err) {
    console.log(err);
    res.status(401).json(error(`Error -> "Privacy Policy"`));
  }
};
