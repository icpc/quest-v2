/// <reference path="../pb_data/types.d.ts" />

onAfterBootstrap(() => {
  cronAdd("sqlite_optimize", "0 * * * *", () => {
    try {
      $app.db().newQuery("PRAGMA optimize").execute();
      console.log("[sqlite_optimize] done");
    } catch (e) {
      console.log("[sqlite_optimize] error:", String(e));
    }
  });
});
