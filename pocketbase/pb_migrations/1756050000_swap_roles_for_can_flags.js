// @ts-check
/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // 1. Update users collection: add can_submit, can_validate fields and update createRule
  const users = app.findCollectionByNameOrId("_pb_users_auth_");
  
  users.fields.add(new BoolField({
    "hidden": false,
    "id": "bool206404565",
    "name": "can_submit",
    "presentable": false,
    "required": false,
    "system": false,
  }));
  users.fields.add(new BoolField({
    "hidden": false,
    "id": "bool4038485558",
    "name": "can_validate",
    "presentable": false,
    "required": false,
    "system": false,
  }));
  users.createRule = "@request.context = \"oauth2\" && can_validate = false"

  app.save(users);

  // 2. Update quests collection rules
  const quests = app.findCollectionByNameOrId("pbc_2945261690");
  quests.createRule = undefined;
  quests.deleteRule = undefined;
  quests.updateRule = undefined;
  app.save(quests);

  // 3. Update submissions collection rules
  const submissions = app.findCollectionByNameOrId("pbc_2516444177");
  submissions.createRule = "@request.auth.can_submit = true \n&&\nsubmitter.id = @request.auth.id";
  submissions.deleteRule = "@request.auth.can_submit = true &&\nsubmitter.id = @request.auth.id";
  submissions.listRule = "@request.auth.can_validate = true\n||\nsubmitter.id = @request.auth.id";
  submissions.updateRule = "@request.auth.can_submit = true &&\nsubmitter.id = @request.auth.id && \n@request.body.submitter:isset = false";
  submissions.viewRule = "@request.auth.can_validate = true\n||\nsubmitter.id = @request.auth.id";
  app.save(submissions);

  // 4. Update validations collection rules
  const validations = app.findCollectionByNameOrId("pbc_3910611636");
  validations.createRule = "submission.submitter.can_validate = true";
  validations.deleteRule = "submission.submitter.can_validate = true";
  validations.listRule = "@request.auth.can_validate = true\n||\nsubmission.submitter.id = @request.auth.id";
  validations.updateRule = "submission.submitter.can_validate = true";
  validations.viewRule = "@request.auth.can_validate = true\n||\nsubmission.submitter.id = @request.auth.id";
  app.save(validations);

  // 5. Update leaderboard view SQL
  const leaderboard = app.findCollectionByNameOrId("pbc_3780747097");
  leaderboard.viewQuery = "SELECT \n    u.id as id,\n    u.id as user,\n    u.name as name,\n    CAST(SUM(vq.success) AS INT) AS total_solved,\n    CAST((ROW_NUMBER() OVER(ORDER BY SUM(vq.success) DESC)) AS INT) as rank\nFROM users AS u\n    LEFT JOIN validated_quests AS vq ON vq.submitter = u.id AND vq.success\nWHERE u.can_submit\nGROUP BY u.id\nORDER BY rank,\n    name ASC;";
  app.save(leaderboard);

  // 6. Remove roles field from users collection
  users.fields.removeById("select1466534506");  
  app.save(users);
});
