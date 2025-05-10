/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3910611636")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role ?= \"managers\"\n||\n@request.auth.role ?= \"validators\"",
    "deleteRule": "@request.auth.role ?= \"managers\"\n||\n@request.auth.role ?= \"validators\"",
    "listRule": "@request.auth.role ?= \"managers\"\n||\n@request.auth.role ?= \"validators\"\n||\nsubmission.submitter = @request.auth.id",
    "updateRule": "@request.auth.role ?= \"managers\"\n||\n@request.auth.role ?= \"validators\"",
    "viewRule": "@request.auth.role ?= \"managers\"\n||\n@request.auth.role ?= \"validators\"\n||\nsubmission.submitter = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3910611636")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.user.groups ?= \"managers\"\n||\n@request.auth.user.groups ?= \"validators\"",
    "deleteRule": "@request.auth.user.groups ?= \"managers\"\n||\n@request.auth.user.groups ?= \"validators\"",
    "listRule": "@request.auth.user.groups ?= \"managers\"\n||\n@request.auth.user.groups ?= \"validators\"\n||\nsubmission.submitter = @request.auth.id",
    "updateRule": "@request.auth.user.groups ?= \"managers\"\n||\n@request.auth.user.groups ?= \"validators\"",
    "viewRule": "@request.auth.user.groups ?= \"managers\"\n||\n@request.auth.user.groups ?= \"validators\"\n||\nsubmission.submitter = @request.auth.id"
  }, collection)

  return app.save(collection)
})
