// @ts-check
/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  if (app.isDev()) {
    return;
  }

  const settings = app.settings();
  settings.meta.hideControls = true;

  /* TODO: Parse the string into a boolean */
  const S3_ENABLED = $os.getenv("S3_ENABLED").toLowerCase().trim();
  if (S3_ENABLED == "true" || S3_ENABLED == "1") {
    try {
      const newS3Settings = {
        ...settings.s3,
        enabled: true,
        endpoint: $os.getenv("S3_ENDPOINT"),
        bucket: $os.getenv("S3_BUCKET"),
        region: $os.getenv("S3_REGION"),
        accessKey: $os.getenv("S3_ACCESS_KEY"),
        secret: $os.getenv("S3_SECRET"),
      };
      newS3Settings.validate();
      settings.s3 = newS3Settings;
    } catch (err) {
      console.log(err);
    }
  }
  app.save(settings);
});
