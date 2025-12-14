/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2945261690")

  // update field
  collection.fields.addAt(3, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "editor999008199",
    "maxSize": 100000,
    "name": "text",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2945261690")

  // update field
  collection.fields.addAt(3, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "editor999008199",
    "maxSize": 0,
    "name": "text",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
})
