const jwt = require("jsonwebtoken");

// auth User
exports.auth = async (req, res, next) => {
  try {
    let header = req.header("Authorization");

    if (!header) {
      return res.status(500).send({
        status: "failed",
        message: "Access Failed",
      });
    }
    const token = header.replace("Bearer ", "");
    const secretKey = "iniRahasiabanget";
    const verifed = jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return res.send({
          status: "failed",
          message: "user not verified",
        });
      } else {
        return decoded;
      }
    });

    req.idUser = verifed.id;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Sign Up Invalid",
    });
  }
};

// exports.authHouse = async (req, res, next) => {
//   try {
//     let header = req.header("Authorization");

//     if (!header) {
//       return res.status(500).send({
//         status: "failed",
//         message: "Access Failed",
//       });
//     }
//     const token = header.replace("Bearer ", "");
//     const secretKey = "iniRahasiabanget";
//     const verifed = jwt.verify(token, secretKey, (error, decoded) => {
//       if (error) {
//         return res.send({
//           status: "failed",
//           message: "user not verified",
//         });
//       } else {
//         return decoded;
//       }
//     });

//     req.idHouse = verifed.id;

//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       status: "failed",
//       message: "Add House Invalid",
//     });
//   }
// };
