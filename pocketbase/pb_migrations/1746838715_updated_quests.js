/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2945261690")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.groups ?= \"manager\"",
    "deleteRule": "@request.auth.groups ?= \"manager\"",
    "updateRule": "@request.auth.groups ?= \"manager\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2945261690")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.role ?= \"manager\"",
    "deleteRule": "@request.auth.role ?= \"manager\"",
    "updateRule": "@request.auth.role ?= \"manager\""
  }, collection)

  return app.save(collection)
})
