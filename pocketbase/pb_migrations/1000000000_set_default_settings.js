/// <reference path="../pb_data/types.d.ts" />
migrate(
  (app) => {
    if (app.isDev()) {
      return; 
    }

    const settings = app.settings();
    settings.meta.hideControls = true;         
    app.save(settings);
  }
);
