/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // 1. Update users collection: add can_submit, can_validate fields and update createRule
  const users = app.findCollectionByNameOrId("_pb_users_auth_");
  unmarshal({
    "createRule": "@request.context = \"oauth2\" && @request.auth.can_validate = false"
  }, users);
  
  users.fields.add(users.fields.length, new Field({
    "hidden": false,
    "id": "bool206404565",
    "name": "can_submit",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }));
  users.fields.add(users.fields.length, new Field({
    "hidden": false,
    "id": "bool4038485558",
    "name": "can_validate",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }));
  collection.fields.removeById("select1466534506")
  app.save(users);

  // 2. Update quests collection rules
  const quests = app.findCollectionByNameOrId("pbc_2945261690");
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "updateRule": null
  }, quests);
  app.save(quests);

  // 3. Update submissions collection rules
  const submissions = app.findCollectionByNameOrId("pbc_2516444177");
  unmarshal({
    "createRule": "@request.auth.can_submit = true \n&&\nsubmitter.id = @request.auth.id",
    "deleteRule": "@request.auth.can_submit = true &&\nsubmitter.id = @request.auth.id",
    "listRule": "@request.auth.can_validate = true\n||\nsubmitter.id = @request.auth.id",
    "updateRule": "@request.auth.can_submit = true &&\nsubmitter.id = @request.auth.id && \n@request.body.submitter:isset = false",
    "viewRule": "@request.auth.can_validate = true\n||\nsubmitter.id = @request.auth.id"
  }, submissions);
  app.save(submissions);

  // 4. Update validations collection rules
  const validations = app.findCollectionByNameOrId("pbc_3910611636");
  unmarshal({
    "createRule": "submission.submitter.can_validate = true",
    "deleteRule": "submission.submitter.can_validate = true",
    "listRule": "@request.auth.can_validate = true\n||\nsubmission.submitter.id = @request.auth.id",
    "updateRule": "submission.submitter.can_validate = true",
    "viewRule": "@request.auth.can_validate = true\n||\nsubmission.submitter.id = @request.auth.id"
  }, validations);
  app.save(validations);

  // 5. Update leaderboard view SQL
  const leaderboard = app.findCollectionByNameOrId("pbc_3780747097");
  unmarshal({
    "viewQuery": "SELECT \n    u.id as id,\n    u.id as user,\n    u.name as name,\n    CAST(SUM(vq.success) AS INT) AS total_solved,\n    CAST((ROW_NUMBER() OVER(ORDER BY SUM(vq.success) DESC)) AS INT) as rank\nFROM users AS u\n    LEFT JOIN validated_quests AS vq ON vq.submitter = u.id AND vq.success\nWHERE u.can_validate\nGROUP BY u.id\nORDER BY rank,\n    name ASC;"
  }, leaderboard);
  app.save(leaderboard);
});
