/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2400855954")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT s.id AS id,\n    s.quest AS quest,\n    s.id AS submission,\n    s.submitter AS submitter,\n    v.id AS validation,\n    v.success AS success,\n    (\n        CASE\n            WHEN v.success = TRUE THEN 'CORRECT'\n            WHEN v.success = FALSE THEN 'WRONG'\n            ELSE 'PENDING'\n        END\n    ) as status\nFROM submissions AS s\n    JOIN quests AS q ON q.id = s.quest\n    LEFT JOIN validations AS v ON v.submission = s.id\nWHERE q.visible = TRUE\nGROUP BY s.id;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_4sfH")

  // remove field
  collection.fields.removeById("_clone_Kdt5")

  // remove field
  collection.fields.removeById("_clone_jdAG")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2945261690",
    "hidden": false,
    "id": "_clone_tju4",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "quest",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_efVe",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "submitter",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_hUGO",
    "name": "success",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2400855954")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT s.id AS id,\n    s.quest AS quest,\n    s.id AS submission,\n    s.submitter AS submitter,\n    v.id AS validation,\n    v.success AS success,\n    (\n        CASE\n            WHEN v.success = TRUE THEN 'CORRECT'\n            WHEN v.success = FALSE THEN 'WRONG'\n            ELSE 'PENDING'\n        END\n    ) as status\nFROM submissions AS s\n    LEFT JOIN validations AS v ON v.submission = s.id\nGROUP BY s.id;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2945261690",
    "hidden": false,
    "id": "_clone_4sfH",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "quest",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_Kdt5",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "submitter",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_jdAG",
    "name": "success",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // remove field
  collection.fields.removeById("_clone_tju4")

  // remove field
  collection.fields.removeById("_clone_efVe")

  // remove field
  collection.fields.removeById("_clone_hUGO")

  return app.save(collection)
})
