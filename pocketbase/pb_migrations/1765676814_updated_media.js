/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2708086759")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file1781309708",
    "maxSelect": 1,
    "maxSize": 100000000,
    "mimeTypes": [],
    "name": "media",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "100x100",
      "400x400",
      "800x800",
      "1200x1200"
    ],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2708086759")

  // update field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "file1781309708",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "media",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [
      "100x100",
      "400x400",
      "800x800",
      "1200x1200"
    ],
    "type": "file"
  }))

  return app.save(collection)
})
