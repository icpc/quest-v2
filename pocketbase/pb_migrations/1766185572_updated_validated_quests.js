/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_363396932")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    (s.quest || ':' || s.submitter) AS id,\n    s.quest as quest,\n    s.submitter as submitter,\n    CAST((SUM(v.success) > 0) AS BOOL) as success,\n    (\n        CASE\n            WHEN SUM(v.success) > 0 THEN 'CORRECT'\n            WHEN COUNT(s.id) > COUNT(v.id) THEN 'PENDING'\n            ELSE 'WRONG'\n        END\n    ) as status\nFROM submissions AS s\n    LEFT JOIN validations AS v ON v.submission = s.id\nGROUP BY s.quest,\n    s.submitter"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_eme5")

  // remove field
  collection.fields.removeById("_clone_Floe")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2945261690",
    "hidden": false,
    "id": "_clone_I9yy",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "quest",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_O330",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "submitter",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_363396932")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    (ROW_NUMBER() OVER ()) AS id,\n    s.quest as quest,\n    s.submitter as submitter,\n    CAST((SUM(v.success) > 0) AS BOOL) as success,\n    (\n        CASE\n            WHEN SUM(v.success) > 0 THEN 'CORRECT'\n            WHEN COUNT(s.id) > COUNT(v.id) THEN 'PENDING'\n            ELSE 'WRONG'\n        END\n    ) as status\nFROM submissions AS s\n    LEFT JOIN validations AS v ON v.submission = s.id\nGROUP BY s.quest,\n    s.submitter"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2945261690",
    "hidden": false,
    "id": "_clone_eme5",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "quest",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_Floe",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "submitter",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("_clone_I9yy")

  // remove field
  collection.fields.removeById("_clone_O330")

  return app.save(collection)
})
