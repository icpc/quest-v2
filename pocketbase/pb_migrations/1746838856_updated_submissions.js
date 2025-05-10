/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2516444177")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role ?= \"managers\"\n|| \n(\n  @request.auth.role ?= \"submitters\" &&\n  submitter = @request.auth.id\n)",
    "deleteRule": "@request.auth.role ?= \"managers\"\n||\n(\n  @request.auth.role ?= \"submitters\" &&\n  submitter = @request.auth.id\n)",
    "listRule": "@request.auth.role ?= \"managers\"\n||\n@request.auth.role ?= \"validators\"\n||\nsubmitter = @request.auth.id",
    "updateRule": "@request.auth.role ?= \"managers\"\n||\n(\n  @request.auth.role ?= \"submitters\" &&\n  submitter = @request.auth.id && \n  @request.body.submitter:isset = false\n)",
    "viewRule": "@request.auth.role ?= \"managers\"\n||\n@request.auth.role ?= \"validators\"\n||\nsubmitter = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2516444177")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.user.groups ?= \"managers\"\n|| \n(\n  @request.auth.user.groups ?= \"submitters\" &&\n  submitter = @request.auth.id\n)",
    "deleteRule": "@request.auth.user.groups ?= \"managers\"\n||\n(\n  @request.auth.user.groups ?= \"submitters\" &&\n  submitter = @request.auth.id\n)",
    "listRule": "@request.auth.user.groups ?= \"managers\"\n||\n@request.auth.user.groups ?= \"validators\"\n||\nsubmitter = @request.auth.id",
    "updateRule": "@request.auth.user.groups ?= \"managers\"\n||\n(\n  @request.auth.user.groups ?= \"submitters\" &&\n  submitter = @request.auth.id && \n  @request.body.submitter:isset = false\n)",
    "viewRule": "@request.auth.user.groups ?= \"managers\"\n||\n@request.auth.user.groups ?= \"validators\"\n||\nsubmitter = @request.auth.id"
  }, collection)

  return app.save(collection)
})
