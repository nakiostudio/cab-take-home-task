const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/form", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
  res.end(
    JSON.stringify({
      title: "New Sandbox",
      fields: [
        {
          id: "new-sandbox-name",
          label: "Sandbox name",
          type: "text-field",
          is_mandatory: true,
          default: null,
          metadata: null,
        },
        {
          id: "new-sandbox-description",
          label: "Description",
          type: "text-area",
          is_mandatory: true,
          default: null,
          metadata: null,
        },
        {
          id: "new-sandbox-template",
          label: "Template",
          type: "option-set",
          is_mandatory: true,
          default: "react",
          metadata: {
            options: [
              { id: "react", label: "React.js" },
              { id: "vue", label: "Vue.js" },
              { id: "express", label: "Express.js" },
            ],
          },
        },
        {
          id: "new-sandbox-tags",
          label: "Tags",
          type: "text-field",
          is_mandatory: false,
          default: null,
          metadata: null,
        },
      ],
      action: {
        label: "Create Sandbox",
        path: "/api/sandbox",
      },
    })
  );
});

const broadcastError = (res, message) => {
  res.end(
    JSON.stringify({
      status: "ERROR",
      message: message,
    })
  );
};

app.post("/api/sandbox", (req, res) => {
  const parameters = req.body;
  res.setHeader("Content-Type", "application/json");

  if (!parameters["fields"] || !Array.isArray(parameters["fields"])) {
    return broadcastError(
      res,
      "Fields parameter couldn't be found or is not an array."
    );
  }

  const paramIds = new Set();
  var errorMessage = undefined;

  parameters["fields"].forEach((field) => {
    if (!field["id"] || !field["value"]) {
      errorMessage = "Field id or value couldn't be found";
    }
    paramIds.add(field["id"]);
  });

  if (errorMessage) {
    return broadcastError(res, errorMessage);
  }

  if (!paramIds.has("new-sandbox-name")) {
    return broadcastError(res, "Field new-sandbox-name is missing");
  }

  if (!paramIds.has("new-sandbox-description")) {
    return broadcastError(res, "Field new-sandbox-description is missing");
  }

  if (!paramIds.has("new-sandbox-template")) {
    return broadcastError(res, "Field new-sandbox-template is missing");
  }

  res.end(
    JSON.stringify({
      status: "OK",
      message: null,
    })
  );
});

module.exports = app;
