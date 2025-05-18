/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3396442964")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  q.id as id,\n  q.id as quest,\n  COUNT(s.id) AS count,\n  COUNT(v.id) AS total_ac\nFROM quests AS q\nLEFT JOIN submissions AS s\n  ON s.quest = q.id\nLEFT JOIN validations AS v\n  ON v.submission = s.id\n  AND v.success = TRUE\nGROUP BY\n  q.id;\n"
  }, collection)

  // remove field
  collection.fields.removeById("json3127518743")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number3127518743",
    "max": null,
    "min": null,
    "name": "total_ac",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3396442964")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  q.id as id,\n  q.id as quest,\n  COUNT(s.id) AS count,\n  SUM(CASE WHEN v.success THEN 1 ELSE 0 END) AS total_ac\nFROM quests AS q\nLEFT JOIN submissions AS s\n  ON s.quest = q.id\nLEFT JOIN validations AS v\n  ON v.submission = s.id\nGROUP BY\n  q.id;\n"
  }, collection)

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "json3127518743",
    "maxSize": 1,
    "name": "total_ac",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // remove field
  collection.fields.removeById("number3127518743")

  return app.save(collection)
})
