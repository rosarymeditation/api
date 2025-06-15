const controller = require("../controllers/user");
const { rootUrl } = require("../utility/constants");
const { auth, upload } = require("../utility/global");
module.exports = (app) => {
  app.post(rootUrl("sign-up"), controller.signUp);
  app.post(rootUrl("create-role"), controller.createRole);
  app.post(rootUrl("sign-in"), controller.signIn);
  app.post(rootUrl("delete-user"), auth, controller.deleteUser);
  app.post(rootUrl("forgot-password"), controller.sendForgotPasswordCode);
  app.post(rootUrl("change-password"), controller.changePassword);
  app.post(rootUrl("countries"), controller.countrySearch);
  app.post(rootUrl("loginWithOtp"), controller.loginWithOtp);
  app.post(rootUrl("resendEmailOtp"), controller.resendEmailOtp);
  app.post(rootUrl("saveSubscriberEmail"), controller.saveSubscriberEmail);
  app.post(rootUrl("verifyEmailOtp"), controller.verifyEmailOtp);
  app.post(rootUrl("verify-password"), controller.passwordVerification);
  app.post(rootUrl("find-Profile-Data"), controller.findProfileData);
  app.post(
    rootUrl("checkSubscriptionState"),
    controller.checkSubscriptionState
  );
  //checkSubscriptionState
  app.post(
    rootUrl("update-user-profile"),
    auth,
    upload.fields([
      { name: "avatar", maxCount: 1 },
      { name: "banner", maxCount: 1 },
    ]),
    controller.updateProfile
  );
  app.post(rootUrl("userInfo"), auth, controller.findUserInfo);

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
