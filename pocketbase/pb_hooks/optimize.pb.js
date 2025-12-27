/// <reference path="../pb_data/types.d.ts" />

cronAdd("sqlite_optimize", "0 * * * *", () => {
  try {
    $app.db().newQuery("PRAGMA optimize=0x10002").execute();
    console.log("[sqlite_optimize] with 0x10002 done");
  } catch (e) {
    console.log("[sqlite_optimize] error:", String(e));
  }
});
