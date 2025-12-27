/// <reference path="../pb_data/types.d.ts" />

// run after app start
onAfterBootstrap(() => {
  $app.dao().db().newQuery("PRAGMA optimize").execute();
});

// run every hour
cronAdd("pragma_optimize", "0 * * * *", () => {
  $app.dao().db().newQuery("PRAGMA optimize").execute();
});
