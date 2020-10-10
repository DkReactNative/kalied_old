class Myfunctions {
  //Get success message
  static successResponse(
    message = "",
    resp,
    requser,
    status = 1,
    statuscode = 200
  ) {
    let response = {};
    (response.status = status),
      (response.message = message),
      (response.statuscode = statuscode),
      (response.response = resp ? resp : "");
    return response;
  }
  //get error message
  static failResponse(message, error, statuscode = 400) {
    let response = {};
    return (response = {
      success: 0,
      message: message,
      statuscode: statuscode,
      error: error,
    });
  }
}

module.exports = Myfunctions;
