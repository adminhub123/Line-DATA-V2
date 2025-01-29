// src/utils/pocketbaseCompat.js
const formatResponse = (data) => {
    return {
      code: 200,
      message: "",
      data: data
    };
  };
  
  const formatError = (code, message) => {
    return {
      code: code,
      message: message,
      data: {}
    };
  };