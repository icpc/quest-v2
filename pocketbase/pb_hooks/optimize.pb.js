/// <reference path="../pb_data/types.d.ts" />

cronAdd("sqlite_optimize", "0 0 * * *", () => {
  try {
    $app.db().newQuery("ANALYZE; PRAGMA optimize;").execute();
    console.log("[sqlite_optimize] with 0x10002 done");
  } catch (e) {
    console.log("[sqlite_optimize] error:", String(e));
  }
});
