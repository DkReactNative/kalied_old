const User = require("./../../model/usersModel");
const Myfunction = require("./../../helper/myfunctions");
const Cards = require("./../../model/cardModel");
const Emailtemplates = require("./../../model/emailTempleteModel");
const bcrypt = require("bcryptjs");
const adminHelper = require("./../../helper/adminHelper");
const jwt = require("jsonwebtoken");
const appConfig = require("./../../config/app");
const mongoose = require("mongoose");
const formidable = require("formidable");
const mailSend = require("./../../helper/mailer");
const { base64encode, base64decode } = require("nodejs-base64");
const ObjectId = mongoose.Types.ObjectId;
const niv = require("node-input-validator");
const { Validator } = niv;
const fs = require("fs");

//const ISODate = mongoose.Types.ISODate;
const moment = require("moment");
var paypal = require("paypal-rest-sdk");
var uuid = require("node-uuid");
var curl = require("curlrequest");
const { response } = require("express");
var request = require("request");
const projectDetailModel = require("../../model/projectDetailModel");

let clientId =
  "AZuZM8X6GUVSCiJzoLiUortfubGvzv9Wr_9HUd7bi4ntsYT9KEiQU1dJugfC3YjHTlrykg8yTbO19vwD";
let clientSecret =
  "ENsmeMgnJXROwj3-zXUF0E8nvhY2jLmpAI97KS9vKwNqRCY7vbom8NQ3AJB4RhjBnHyk7zRg4QJaEiVH";

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: clientId,
  client_secret: clientSecret,
  headers: {
    custom: "header",
  },
});

const index = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    let userId = req.user._id;
    // token = req.params.paypalToken;

    Cards.find(
      { user_id: ObjectId(userId), payment_reference_type: 1 },
      function (err, card) {
        if (err)
          return res.send(Myfunction.failResponse("Something went wrong", err));

        // if (card.length == 0)
        //   return res.send(Myfunction.failResponse("Card not found", {}));

        Cards.find(
          { user_id: ObjectId(userId), payment_reference_type: 2 },
          function (err, refCard) {
            if (err)
              return res.send(
                Myfunction.failResponse("Something went wrong", err)
              );

            if (refCard.length == 0 && card.length == 0)
              return res.send(Myfunction.failResponse("Card not found", {}));

            return res.send(
              Myfunction.successResponse("data", {
                cards: card,
                referenceCard: refCard,
              })
            );
          }
        );
      }
    );

    // Cards.findOne({ user_id: ObjectId(userId) }, function (err, card) {
    //   if (err)
    //     return res.send(Myfunction.failResponse("Something went wrong", err));

    //   if (!card) return res.send(Myfunction.failResponse("Card not found", {}));

    //   var options = {
    //     method: "GET",
    //     url:
    //       "https://api.sandbox.paypal.com/v1/vault/credit-cards?external_customer_id=" +
    //       card.paypal_customer_id,
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "Bearer " + token,
    //     },
    //   };

    //   curl.request(options, (error, response) => {
    //     if (err)
    //       return res.send(
    //         Myfunction.failResponse("Something went wrong.", error)
    //       );

    //     let item = JSON.parse(response);
    //     let details = {
    //       item: item,
    //       default_card: card.card_id,
    //     };
    //     return res.send(Myfunction.successResponse("data", details, req.user));
    //   });
    // });
  });
};

const getToken = function (req, res) {
  request.post(
    {
      uri: "https://api.sandbox.paypal.com/v1/oauth2/token",
      headers: {
        Accept: "application/json",
        "Accept-Language": "en_US",
        "content-type": "application/x-www-form-urlencoded",
      },
      auth: {
        user: clientId,
        pass: clientSecret,
        // 'sendImmediately': false
      },
      form: {
        grant_type: "client_credentials",
      },
    },
    function (error, response, body) {
      let token = JSON.parse(body);
      return res.send(Myfunction.successResponse("data", token.access_token));
    }
  );
};

// var options = {
//   method: "POST",
//   url: "https://api.sandbox.paypal.com/v1/oauth2/token",
//   headers: {
//     Accept: "application/json",
//     "Accept-Language": "en_US",
//   },
//   auth: {
//     username: clientId,
//     password: clientSecret,
//   },
//   form: {
//     grant_type: "client_credentials",
//   },
// };

// curl.request(options, (error, response) => {
//   if (error)
//     return res.send(Myfunction.failResponse("Something went wrong.", error));

//   return res.send(Myfunction.successResponse("data", response));
// });

// const index = function (req, res) {
//   var form = new formidable.IncomingForm();
//   form.parse(req, async function (err, fields) {
//     Cards.find({ user_id: ObjectId(req.user._id) }, function (err, result) {
//       if (err) {
//         return res.send(Myfunction.failResponse("Something went wrong", err));
//       } else {
//         let response = {};
//         result = JSON.parse(JSON.stringify(result));
//         let defaultss = result.filter((item) => {
//           if (item.is_primary == 1) {
//             return true;
//           }
//         });
//         response.defaultCard =
//           defaultss.length > 0 && defaultss[0]._id ? defaultss[0]._id : "";
//         response.cardlist = result;
//         return res.send(Myfunction.successResponse("data", response, req.user));
//       }
//     });
//   });
// };

const addcard = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    let { last_card_numbers, card_id, type } = fields;
    if (err) {
      return res.send(Myfunction.failResponse("Something went wrong", err));
    }

    let full_name = fields.full_name;
    let name = full_name.split(" ");

    var card_data = {
      type: fields.type,
      number: fields.number,
      expire_month: fields.expire_month,
      expire_year: fields.expire_year,
      cvv2: fields.cvv,
      first_name: name[0],
      last_name: name.length > 0 ? name[name.length - 1] : "",
    };

    Cards.findOne({ user_id: ObjectId(req.user._id) }, function (err, isCard) {
      if (!err && isCard && isCard.customer_id) {
        card_data["external_customer_id"] = isCard.customer_id;
      } else {
        card_data["external_customer_id"] = uuid.v4();
      }
      paypal.creditCard.create(card_data, function (error, credit_card) {
        if (error) {
          console.log("error: ", error);
          let errorMessage =
            error.response.details && error.response.details.length > 0
              ? "Please check your card " + error.response.details[0].field
              : "Something went wrong";
          return res.send(Myfunction.failResponse(errorMessage, error));
        } else {
          let card = new Cards({
            user_id: req.user._id,
            payment_reference: credit_card.id,
            payment_reference_type: 1,
            is_default: fields.is_default == "true" ? true : false,
            type: credit_card.type,
            number: credit_card.number,
            expire_month: credit_card.expire_month,
            expire_year: credit_card.expire_year,
            first_name: credit_card.first_name,
            last_name: credit_card.last_name,
            customer_id: credit_card.external_customer_id,
          });

          card.save(function (err, cardSaved) {
            if (err)
              return res.send(
                Myfunction.failResponse("Something went wrong", err)
              );
            return res.send(
              Myfunction.successResponse("Card saved successfully", cardSaved)
            );
          });

          // Cards.findOne(
          //   {
          //     user_id: ObjectId(req.user._id),
          //   },
          //   function (error, cardData) {
          //     if (!error && cardData) {
          //       Cards.updateOne(
          //         {
          //           user_id: ObjectId(req.user._id),
          //         },
          //         {
          //           $set: { modified: new Date() },
          //         },
          //         function (err, added) {
          //           if (err)
          //             return res.send(
          //               Myfunction.failResponse("Something went wrong", err)
          //             );
          //           return res.send(
          //             Myfunction.successResponse("Card saved succefully", added)
          //           );
          //         }
          //       );
          //     } else {
          //       let card = new Cards({
          //         card_id: credit_card.id,
          //         user_id: ObjectId(req.user._id),
          //         paypal_customer_id: credit_card.external_customer_id,
          //       });
          //       card.save((err, result) => {
          //         if (err) {
          //           return res.send(
          //             Myfunction.failResponse("Something went wrong", err)
          //           );
          //         } else {
          //           return res.send(
          //             Myfunction.successResponse(
          //               "Card saved succefully",
          //               result
          //             )
          //           );
          //         }
          //       });
          //     }
          //   }
          // );
        }
      });
    });
  });
};

const addCardReference = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    let { last_card_numbers, card_id, type } = fields;
    console.log("fields: ", fields);
    if (err) {
      return res.send(Myfunction.failResponse("Something went wrong", err));
    }

    let external_customer_id = "";

    Cards.findOne({ user_id: ObjectId(req.user._id) }, function (err, isCard) {
      if (err)
        return res.send(Myfunction.failResponse("Something went wrong", err));

      if (!err && isCard && isCard.customer_id) {
        external_customer_id = isCard.customer_id;
      } else {
        external_customer_id = uuid.v4();
      }

      console.log("previousCard: ", isCard);

      // paypal.creditCard.create(card_data, function (error, credit_card) {
      //   if (error) {
      //     console.log("error: ", error);
      //     let errorMessage =
      //       error.response.details && error.response.details.length > 0
      //         ? "Please check your card " + error.response.details[0].field
      //         : "Something went wrong";
      //     return res.send(Myfunction.failResponse(errorMessage, error));
      //   } else {

      let card = new Cards({
        user_id: req.user._id,
        payment_reference: fields.payer_id,
        payment_reference_type: 2,
        is_default: fields.is_default == "true" ? true : false,
        customer_id: external_customer_id,
        email: fields.email,
      });

      card.save(function (err, cardSaved) {
        if (err)
          return res.send(Myfunction.failResponse("Something went wrong", err));
        return res.send(
          Myfunction.successResponse("Card saved successfully", cardSaved)
        );
      });
    });
  });
};

const setdefaultCard = function (req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req, async function (err, fields) {
    if (err) {
      return res.send(Myfunction.failResponse("Something went wrong", err));
    }

    let userId = req.user._id ? req.user._id : "",
      card_id = fields.card_id ? fields.card_id : "";

    Cards.updateMany(
      { user_id: ObjectId(userId) },
      { $set: { is_default: false } },
      function (error, updated) {
        if (error)
          return res.send(
            Myfunction.failResponse("Something went wrong.", error)
          );

        if (updated) {
          Cards.updateOne(
            { _id: ObjectId(card_id) },
            { $set: { is_default: true } },
            function (err, updated) {
              if (err)
                return res.send(
                  Myfunction.failResponse("Something went wrong.", error)
                );

              return res.send(
                Myfunction.successResponse("Card successfully default marked.")
              );
            }
          );
        }
      }
    );
    // if (!card_id) {
    //   return res.send(Myfunction.failResponse("Bad request."));
    // }
    // Cards.updateOne(
    //   { is_primary: 1 },
    //   {
    //     $set: {
    //       is_primary: 0,
    //     },
    //   },
    //   function (errs, result) {
    //     if (errs) {
    //       return res.send(
    //         Myfunction.failResponse("Something went wrong", errs)
    //       );
    //     }
    //     if (result) {
    //       Cards.updateOne(
    //         { _id: ObjectId(card_id) },
    //         {
    //           $set: {
    //             is_primary: 1,
    //           },
    //         },
    //         function (err, saved) {
    //           if (errs) {
    //             return res.send(
    //               Myfunction.failResponse("Something went wrong", errs)
    //             );
    //           }
    //           return res.send(
    //             Myfunction.successResponse("Set default successfully.")
    //           );
    //         }
    //       );
    //     }
    //   }
    // );
  });
};

const makePayment = function (req, res) {
  console.log("params: ", req.body);
  let token = req.body.token ? req.body.token : "",
    card_id = req.body.card_id ? req.body.card_id : "",
    customer_id = req.body.customer_id ? req.body.customer_id : "",
    amount = req.body.amount ? req.body.amount : "",
    project_id = req.body.project_id ? req.body.project_id : "";

  console.log("body: ", req.body);

  var cardData = {
    intent: "sale",
    payer: {
      payment_method: "credit_card",
      funding_instruments: [
        {
          credit_card_token: {
            credit_card_id: card_id,
            external_customer_id: customer_id,
          },
        },
      ],
    },
    transactions: [
      {
        amount: {
          total: amount,
          currency: "USD",
        },
        description: "This is the payment transaction description.",
      },
    ],
  };

  paypal.payment.create(cardData, function (error, payment) {
    if (error) {
      console.log(error);
    } else {
      //console.log(payment);
      console.log("payment done ----------   ", JSON.stringify(payment));
      projectDetailModel.updateOne(
        { _id: ObjectId(project_id) },
        { $set: { projectPaymentStatus: "Completed" } },
        (error, updated) => {
          if (error)
            return res.send(
              Myfunction.failResponse("Something went wrong.", error)
            );

          if (!error && !updated)
            return res.send(
              Myfunction.failResponse(
                "Project could not updated but payment done.",
                error
              )
            );

          return res.send(
            Myfunction.successResponse("Payment successfully done", payment)
          );

          // return res.json({
          //   status: true,
          //   messagePaymentSUccess: "",
          // });
        }
      );
    }
  });

  // request.post(
  //   {
  //     uri: "https://api.sandbox.paypal.com/v1/payments/payment",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token,
  //     },
  //     data: {
  //       intent: "sale",
  //       payer: {
  //         payment_method: "credit_card",
  //         funding_instruments: [
  //           {
  //             credit_card_token: {
  //               credit_card_id: card_id,
  //               external_customer_id: customer_id,
  //             },
  //           },
  //         ],
  //       },
  //       transactions: [
  //         {
  //           amount: {
  //             total: amount,
  //             currency: "USD",
  //           },
  //           description: "Payment by vaulted credit card.",
  //         },
  //       ],
  //     },
  //   },
  //   function (error, response, body) {
  //     let token = JSON.parse(body);
  //     console.log("reponse ----- : ", token);
  //     return res.send(Myfunction.successResponse("data", token.access_token));
  //   }
  // );

  // var options = {
  //   method: "GET",
  //   url: "https://api.sandbox.paypal.com/v1/payments/payment",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: "Bearer " + token,
  //   },
  //   data: {
  //     intent: "sale",
  //     payer: {
  //       payment_method: "credit_card",
  //       funding_instruments: [
  //         {
  //           credit_card_token: {
  //             credit_card_id: card_id,
  //             external_customer_id: customer_id,
  //           },
  //         },
  //       ],
  //     },
  //     transactions: [
  //       {
  //         amount: {
  //           total: amount,
  //           currency: "USD",
  //         },
  //         description: "Payment by vaulted credit card.",
  //       },
  //     ],
  //   },
  // };

  // curl.request(options, (error, response) => {
  //   if (error) {
  //     console.log("error::: ", error);
  //     return res.send(Myfunction.failResponse("Something went wrong.", error));
  //   }

  //   let item = JSON.parse(response);
  //   console.log("item -=-------=-=-=: ", item);
  //   return res.send(Myfunction.successResponse("data", item));
  // });
};

const getPendingPaymentProjects = function (req, res) {
  let user_id = req.user._id;

  projectDetailModel.aggregate(
    [
      {
        $match: {
          user_id: ObjectId(user_id),
          projectAssignedStatus: 1,
          $or: [
            { projectPaymentStatus: "Pending" },
            { projectPaymentStatus: "Completed" },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "freelancer_id",
          foreignField: "_id",
          as: "freelancer_data",
        },
      },
    ],
    (err, data) => {
      if (err)
        return res.send(Myfunction.failResponse("Something went wrong", err));

      if (!err && data.length == 0)
        return res.send(Myfunction.failResponse("No Project Found", {}));

      return res.send(Myfunction.successResponse("Data", data));
    }
  );
};

const getDefaultCard = function (req, res) {
  let user_id = req.user._id;

  Cards.findOne({ user_id: ObjectId(user_id), is_default: true }, function (
    err,
    data
  ) {
    if (err)
      return res.send(Myfunction.failResponse("Something went wrong.", err));

    if (!err && !data)
      return res.send(Myfunction.failResponse("No card found", {}));

    return res.send(Myfunction.successResponse("Card", data));
  });
};

// const makePayment = function (req, res) {
//   let payer_id = req.body.payer_id
//       ? { payer_id: req.body.payer_id }
//       : { payer_id: "" },
//     redirect_url = req.body.redirect_url ? req.body.redirect_url : "",
//     cancel_url = req.body.cancel_url ? req.body.cancel_url : "";

//   console.log("body: ", req.body);

//   var payReq = JSON.stringify({
//     intent: "sale",
//     payer: {
//       payment_method: "paypal",
//     },
//     redirect_urls: {
//       return_url: redirect_url,
//       cancel_url: cancel_url,
//     },
//     transactions: [
//       {
//         amount: {
//           total: "10",
//           currency: "USD",
//         },
//         description: "This is the payment transaction description.",
//       },
//     ],
//   });

//   paypal.payment.create(payReq, function (error, payment) {
//     if (error) {
//       console.error(JSON.stringify(error));
//     } else {
//       console.log("paymentId: ", payment.id);
//       console.log("payer_id: ", payer_id);
//       paypal.payment.execute(payment.id, payer_id, function (err, paymentDone) {
//         if (err) {
//           console.error("errorrrrr: ", JSON.stringify(err));
//         } else {
//           if (paymentDone.state == "approved") {
//             // Redirect the customer to links['approval_url'].href
//             res.send(Myfunction.successResponse("data", paymentDone));
//           } else {
//             // console.error("no redirect URI present");
//             res.send(Myfunction.failResponse("Something went wrong", err));
//           }

//           // if (payment.state == "approved") {
//           //   console.log("payment completed successfully");
//           // } else {
//           //   console.log("payment not successful");
//           // }
//         }
//       });
//       // Capture HATEOAS links
//       // payment.links.forEach(function (linkObj) {
//       //   links[linkObj.rel] = {
//       //     href: linkObj.href,
//       //     method: linkObj.method,
//       //   };
//       // });

//       // console.log("payment ------ : ", payment);
//       // console.log("links =======: ", links);

//       // if (links.hasOwnProperty("approval_url")) {
//       //   // Redirect the customer to links['approval_url'].href
//       //   res.send(
//       //     Myfunction.successResponse("data", links["approval_url"].href)
//       //   );
//       // } else {
//       //   // console.error("no redirect URI present");
//       //   res.send(Myfunction.failResponse("Something went wrong", error));
//       // }
//     }
//   });
// };

module.exports = {
  index,
  getToken,
  addcard,
  addCardReference,
  setdefaultCard,
  makePayment,
  getPendingPaymentProjects,
  getDefaultCard,
};
