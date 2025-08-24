/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2945261690")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\"\n&&\nvisible = true",
    "viewRule": "@request.auth.id != \"\"\n&&\nvisible = true"
  }, collection)

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "bool2058414169",
    "name": "visible",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool206404565",
    "name": "can_submit",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
