//creating token and saving in cookie
// exports.sendTokenUser = (user, token, statusCode, res )=>{
   
//     //  const token = token;

//      const options = {
//          expires: new Date(
//              Date.now() + process.env.COOKIE_EXPIRE * 24* 60*60*1000
//          ),
//          httpOnly: true
//      }

//      res.cookie('token', token, options);

//      res.status(statusCode).cookie('token',token,options).json({
//          success: true,
//          user,
//          token
//      })

   
//  }

// exports.sendTokenUser = (user, token, statusCode, res) => {
//   console.log('Inside sendTokenUser');
//   console.log('typeof res:', typeof res);                // Should be 'object'
//   console.log('res.constructor.name:', res.constructor.name); // Should be 'ServerResponse'
//   console.log('typeof res.cookie:', typeof res.cookie);  // Should be 'function'
//   console.log('res.headersSent:', res.headersSent);      // Should be false

//   if (typeof res.cookie !== 'function') {
//     console.error('ERROR: res.cookie is not a function inside sendTokenUser');
//     throw new Error('res.cookie is not a function inside sendTokenUser');
//   }

//   const options = {
//     expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production',
//   };

//   res.cookie('token', token, options);

//   res.status(statusCode).json({
//     success: true,
//     user,
//     token,
//   });
// };

const sendToken = (user, token, statusCode, res) => {
  if (typeof res.cookie !== 'function') {
    console.error('ERROR: res.cookie is not a function inside sendTokenUser');
    throw new Error('res.cookie is not a function inside sendTokenUser');
  }

  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  };

  res.cookie('token', token, options);

  res.status(statusCode).json({
    success: true,
    user,
    token,
  });
};

// const sendToken = (user, token, res) => {
//     const options = {
//         expires: new Date(
//             Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
//         ),
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'production'
//     };

//     res.cookie('token', token, options);
// };
//creating token and saving in cookie
const sendAuthToken = (user, token, statusCode, res )=>{
   
    //const token = token;

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24* 60*60*1000
        ),
        httpOnly: true
    }

    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        user,
        token
    })
}

module.exports = sendToken;
