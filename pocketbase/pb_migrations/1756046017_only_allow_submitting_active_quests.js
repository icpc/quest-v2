/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2516444177")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.can_submit = true &&\nquest.can_submit = true &&\nsubmitter.id = @request.auth.id"
  }, collection)

  return app.save(collection)
})
