const controller = require("../controllers/saint");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("saint"), upload.single("photo"), controller.create);
  app.post(rootUrl("checkIfSaintExist"), controller.checkIfExist);
  //checkIfExist
  // app.post(rootUrl("likeFeed"), auth, controller.like);
  // app.post(rootUrl("sendMessage"), controller.sendMessage);
  // app.post(rootUrl("userFeeds"), auth, controller.findByUser);
  app.post(rootUrl("findSaint"), controller.saint);
  // app.post(rootUrl("allFeeds"), controller.findAll);
  // app.post(rootUrl("allFeedsAdmin"), controller.findAllAdmin);
  // app.delete(rootUrl("feed/:id"), auth, controller.delete);
  // app.patch(
  //   rootUrl("feed/:id"),
  //   upload.single("photo"),
  //   auth,
  //   controller.update
  // );

  //   app.get(rootUrl("categories"), controller.findAll);

  //   app.post(rootUrl("categoriesByPopular"), controller.findByPopular);
  //   app.post(rootUrl("findCategorySearch"), controller.findCategorySearch);
  //   app.post(rootUrl("categoriesByShop"), controller.findByShop);
  //   app.post(rootUrl("findCategoryByShopUrl"), controller.findCategoryByShopUrl);
  //   //findCategoryByShopUrl
  //   app.post(
  //     rootUrl("allCategoriesForMobile"),
  //     controller.findAllCategoriesForMobile
  //   );

  //   app.get(rootUrl("categoriesLighter"), controller.findAllLighter);

  //   app.get(rootUrl("category/display"), controller.display);

  //   app.get(rootUrl("category/:id"), controller.findPk);

  //   app.patch(rootUrl("category/:id"), controller.update);

  //   app.delete(rootUrl("category/:id"), controller.delete);
};
