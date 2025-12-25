const Template = require("../models/Template");

exports.createTemplate = async (req, res) => {
  const { name, html, css, previewImage } = req.body;
  const template = await Template.create({ name, html, css, previewImage });
  res.status(201).json(template);
};

exports.getTemplates = async (req, res) => {
  const templates = await Template.find();
  res.json(templates);
};

exports.getTemplate = async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) return res.status(404).json({ error: "Not found" });
  res.json(template);
};

exports.updateTemplate = async (req, res) => {
  const template = await Template.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(template);
};

exports.deleteTemplate = async (req, res) => {
  await Template.findByIdAndDelete(req.params.id);
  res.status(204).send();
};