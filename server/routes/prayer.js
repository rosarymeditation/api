const controller = require("../controllers/prayer");
const { rootUrl } = require("../utility/constants");
const { auth, uploadPrayerMedia } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("prayer"),uploadPrayerMedia.fields([{ name: "photo", maxCount: 1 }, { name: "audio", maxCount: 1 }]), controller.create);
  app.post(rootUrl("prayers"), controller.findAll);
  app.post(rootUrl("prayers_admin"), controller.findAllAdmin);
  app.post(rootUrl("prayer_by_id"), controller.findById);
  app.delete(rootUrl("prayer/:id"), controller.delete);
  app.post(
    rootUrl("prayer_update"),
   uploadPrayerMedia.fields([{ name: "photo", maxCount: 1 }, { name: "audio", maxCount: 1 }]),

    controller.update
  );
};
