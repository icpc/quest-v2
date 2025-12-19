/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_363396932");

  // update collection data
  unmarshal(
    {
      viewQuery:
        "SELECT\n    s.quest || ':' || s.submitter AS id,\n    s.quest as quest,\n    s.submitter as submitter,\n    CAST((SUM(v.success) > 0) AS BOOL) as success,\n    (\n        CASE\n            WHEN SUM(v.success) > 0 THEN 'CORRECT'\n            WHEN COUNT(s.id) > COUNT(v.id) THEN 'PENDING'\n            ELSE 'WRONG'\n        END\n    ) as status\nFROM submissions AS s\n    LEFT JOIN validations AS v ON v.submission = s.id\nGROUP BY s.quest,\n    s.submitter",
    },
    collection,
  );

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_363396932");

  // update collection data
  unmarshal(
    {
      viewQuery:
        "SELECT \n    (ROW_NUMBER() OVER ()) AS id,\n    s.quest as quest,\n    s.submitter as submitter,\n    CAST((SUM(v.success) > 0) AS BOOL) as success,\n    (\n        CASE\n            WHEN SUM(v.success) > 0 THEN 'CORRECT'\n            WHEN COUNT(s.id) > COUNT(v.id) THEN 'PENDING'\n            ELSE 'WRONG'\n        END\n    ) as status\nFROM submissions AS s\n    LEFT JOIN validations AS v ON v.submission = s.id\nGROUP BY s.quest,\n    s.submitter",
    },
    collection,
  );

  return app.save(collection);
});
