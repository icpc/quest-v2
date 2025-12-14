// @ts-check
/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  if (app.isDev()) {
    return;
  }

  const settings = app.settings();
  settings.meta.hideControls = true;

  const S3_ENABLED = $os.getenv("S3_ENABLED").toLowerCase().trim();
  if (S3_ENABLED == "true" || S3_ENABLED == "1") {
    settings.s3.enabled = true;
    settings.s3.endpoint = $os.getenv("S3_ENDPOINT");
    settings.s3.bucket = $os.getenv("S3_BUCKET");
    settings.s3.region = $os.getenv("S3_REGION");
    settings.s3.accessKey = $os.getenv("S3_ACCESS_KEY");
    settings.s3.secret = $os.getenv("S3_SECRET");
  }

  settings.trustedProxy.headers = ["X-Forwarded-For"];

  settings.backups.cron = "0 * * * *"; // every hour
  settings.backups.cronMaxKeep = 10;
  
  app.save(settings);
});
