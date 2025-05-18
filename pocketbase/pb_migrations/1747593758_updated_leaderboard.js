/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3780747097")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT u.id AS id,\n    (ROW_NUMBER() OVER()) AS rank,\n    u.name AS name,\n    COUNT(vs.submission) AS total_solved\nFROM users AS u\n    LEFT JOIN validated_submissions AS vs ON vs.submitter = u.id\n    AND vs.success = TRUE\nWHERE EXISTS (\n        SELECT 1\n        FROM json_each(u.role)\n        WHERE value = 'submitter'\n    )\nGROUP BY u.id\nORDER BY total_solved DESC;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_BxkQ")

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "json2289690853",
    "maxSize": 1,
    "name": "rank",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_KlKy",
    "max": 255,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3780747097")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  u.id               AS id,\n  u.name             AS name,\n  COUNT(vs.submission) AS total_solved\nFROM users AS u\nLEFT JOIN validated_submissions AS vs\n  ON vs.submitter = u.id\n  AND vs.success = TRUE\nGROUP BY u.id\nORDER BY total_solved DESC;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_BxkQ",
    "max": 255,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("json2289690853")

  // remove field
  collection.fields.removeById("_clone_KlKy")

  return app.save(collection)
})
