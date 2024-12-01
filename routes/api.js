"use strict";

const { Issue } = require("../database/models");

const IssueModel = require("../database/models").Issue;
const ProjectModel = require("../database/models").Project;

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(async (req, res) => {
      let projectName = req.params.project;

      try {
        const projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          res.json({ error: `!projectName ${projectName}` });
          return;
        } else {
          const issueModel = await IssueModel.find({
            projectId: projectModel._id,
            //req.query gets ... (everything) after the "?" in URL
            ...req.query,
          });
          if (!issueModel) {
            res.json({ error: `!issueModel ${issueModel}` });
            return;
          }
          res.json(issueModel);
          return;
        }
      } catch (err) {
        res.json({ error: `!_id ${_id}` });
      }
    })

    .post(async (req, res) => {
      let projectName = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text } =
        req.body;

      if (!issue_title || !issue_text || !created_by) {
        res.json({ error: "required field(s) missing" });
        return;
      }

      try {
        let projectModel = await ProjectModel.findOne({ name: projectName });

        //Create a projectModel if it doesn't exist
        if (!projectModel) {
          projectModel = new ProjectModel({ name: projectName });
          projectModel = await projectModel.save();
        }

        //Create a issueModel if it doesn't exist
        let issueModel = new IssueModel({
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

        issueModel = await issueModel.save();
        res.json(issueModel);
      } catch (err) {
        res.json({ error: `!projectName ${projectName}` });
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

      if (!_id || _id === "") {
        res.json({ error: "missing _id" });
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
        res.json({ error: "no update field(s) sent", _id: _id });
        return;
      }

      try {
        const projectModel = await ProjectModel.findOne({ name: projectName });

        if (!projectModel) {
          throw new Error(`!projectName ${projectName}`);
        }

        let issue = await IssueModel.findByIdAndUpdate(_id, {
          ...req.body,
          updated_on: new Date(),
        });

        await issue.save();
        res.json({ result: "successfully updated", _id: _id });
      } catch (err) {
        res.json({ error: "could not update", _id: _id });
      }
    })

    .delete(async (req, res) => {
      let projectName = req.params.project;
      const { _id } = req.body;

      if (!_id) {
        res.json({ error: 'missing _id' });
        return;
      }

      try {
        const projectModel = await ProjectModel.findOne({ name: projectName });
        if (!projectModel) {
          throw new Error(`!projectName ${projectName}`);
        }

        const issue = await IssueModel.findByIdAndDelete(_id);
        console.log(`issue `, issue._id,`: `,issue);
        res.json({ result: 'successfully deleted', '_id': _id });
      } catch (error) {
        res.json({ error: 'could not delete', '_id': _id });
      }
    });
};
