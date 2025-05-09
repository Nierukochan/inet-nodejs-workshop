const sendResponse = (res, statusCode = 200, message = 'success', data = null) => {
  return res.status(statusCode).json({
      status: statusCode,
      message: message,
      data: data,
  })
}

module.exports = { sendResponse }


