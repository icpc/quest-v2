/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2769025244")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select4175343705",
    "maxSelect": 2,
    "name": "auth",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "PASSWORD",
      "OIDC"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2769025244")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select4175343705",
    "maxSelect": 1,
    "name": "auth",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "PASSWORD",
      "OIDC"
    ]
  }))

  return app.save(collection)
})
