/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2516444177")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "file1542800728",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "attachment",
    "presentable": false,
    "protected": true,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2516444177")

  // update field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "file1542800728",
    "maxSelect": 99,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "attachments",
    "presentable": false,
    "protected": true,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
})
