/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "_clone_ueS3",
        "max": 255,
        "min": 0,
        "name": "name",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "number2631629756",
        "max": null,
        "min": null,
        "name": "total_solved",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      }
    ],
    "id": "pbc_3780747097",
    "indexes": [],
    "listRule": null,
    "name": "leaderboard",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT\n  u.id               AS id,\n  u.name             AS name,\n  COUNT(vs.submission) AS total_solved\nFROM users AS u\nLEFT JOIN validated_submissions AS vs\n  ON vs.submitter = u.id\n  AND vs.success = TRUE\nGROUP BY u.id\nORDER BY total_solved DESC;",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3780747097");

  return app.delete(collection);
})
