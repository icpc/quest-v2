/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "select1466534506",
    "maxSelect": 3,
    "name": "role",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "submitter",
      "manager",
      "validator"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "select1466534506",
    "maxSelect": 3,
    "name": "groups",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "submitter",
      "manager",
      "validator"
    ]
  }))

  return app.save(collection)
})
