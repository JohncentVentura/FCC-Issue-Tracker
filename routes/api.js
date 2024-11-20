"use strict";

const IssueModel = require("../models").Issue;
const ProjectModel = require("../models").Project;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async (req, res) => {
      let projectName = req.params.project;
      try {
        const project = await ProjectModel.findOne({ name: projectName });
        if (!project) {
          res.json({ error: `Project ${projectName} not found` });
          return;
        } else {
          const issues = await IssueModel.find({
            projectId: project._id,
            //req.query gets everything after the "?" in URL
            ...req.query,
          });
          if (!issues) {
            res.json({ error: "No issues found" });
            return;
          }
          res.json(issues);
          return;
        }
      } catch (err) {
        res.json({ error: `could not get`, _id: _id });
      }
    })

    .post(async (req, res) => {
      let projectName = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;
      if (!issue_title || !issue_text || !created_by) {
        res.json({
          error: "Missing required fields: issue_title, issue_text, created_by",
        });
        return;
      }
      try {
        let projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          projectModel = new ProjectModel({ name: projectName });
          projectModel = await projectModel.save();
        }
        const issueModel = new IssueModel({
          projectId: projectModel._id,
          issue_title: issue_title || "",
          issue_text: issue_text || "",
          created_on: new Date(),
          updated_on: new Date(),
          created_by: created_by || "",
          assigned_to: assigned_to || "",
          open: true,
          status_text: status_text || "",
        });
        const issue = await issueModel.save();
      } catch (err) {
        res.json({ error: `Project ${projectName} not found` });
        return;
      }
    })

    .put(async (req, res) => {
      let projectName = req.params.project;
      const {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open,
      } = req.body;
      if (!_id) {
        res.json({ error: "Missing required field: _id" });
        return;
      }
      if (
        !issue_title &&
        !issue_text &&
        !created_by &&
        !assigned_to &&
        !status_text &&
        !open
      ) {
        res.json({ error: "No update field(s) sent", _id: _id });
        return;
      }

      try{
        const projectModel = await ProjectModel.findOne({ name: projectName });
        if(!projectModel) {
          throw new Error(`Project ${projectName} not found`);
        }
        let issue = await IssueModel.findByIdAndUpdate(_id, {
          ...req.body,
          updated_on: new Date(),
        });
        await issue.save();
        res.json({result: "successfully updated", _id: _id});
      } catch (err) {
        res.json({ error: "could not update", _id: _id });
      }
    })

    .delete(function (req, res) {
      let projectName = req.params.project;
      
    });
};
