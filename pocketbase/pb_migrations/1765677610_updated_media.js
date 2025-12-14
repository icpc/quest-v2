/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2708086759")

  // update field
  collection.fields.addAt(0, new Field({
    "autogeneratePattern": "[a-z0-9]{15}",
    "hidden": false,
    "id": "text3208210256",
    "max": 15,
    "min": 1,
    "name": "id",
    "pattern": "^[a-z0-9_]+$",
    "presentable": false,
    "primaryKey": true,
    "required": true,
    "system": true,
    "type": "text"
  }))

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
      "100x100f",
      "400x400f",
      "800x800f",
      "1200x1200f"
    ],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2708086759")

  // update field
  collection.fields.addAt(0, new Field({
    "autogeneratePattern": "[a-z0-9]{15}",
    "hidden": false,
    "id": "text3208210256",
    "max": 15,
    "min": 1,
    "name": "id",
    "pattern": "^[a-z0-9]+$",
    "presentable": false,
    "primaryKey": true,
    "required": true,
    "system": true,
    "type": "text"
  }))

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
})
