const controller = require("../controllers/psalm");
const { rootUrl } = require("../utility/constants");
const { auth, uploadPrayerMedia } = require("../utility/global");

module.exports = (app) => {
  app.post(
    rootUrl("psalm"),
    uploadPrayerMedia.fields([{ name: "photo", maxCount: 1 }, { name: "audio", maxCount: 1 }]),
    controller.create
  );
  app.post(rootUrl("psalms"), controller.findAll);
  app.post(rootUrl("psalm_findAllAdmin"), controller.findAllAdmin);
  app.post(rootUrl("updateAll"), controller.updateAll);
  app.post(rootUrl("psalm_by_id"), controller.findById);
  app.delete(rootUrl("psalm/:id"), controller.delete);
 
  app.post(
    rootUrl("psalm_update"),
    uploadPrayerMedia.fields([{ name: "photo", maxCount: 1 }, { name: "audio", maxCount: 1 }]),
    controller.update
  );
};