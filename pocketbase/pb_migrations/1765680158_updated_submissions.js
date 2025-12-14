/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2516444177")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE INDEX `idx_HoQ4Jmkzsr` ON `submissions` (`submitter`)",
      "CREATE INDEX `idx_nExu5riZ7j` ON `submissions` (`quest`)",
      "CREATE INDEX `idx_w67UBRZYXV` ON `submissions` (\n  `quest`,\n  `submitter`\n)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2516444177")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
