const AWS = require("aws-sdk");
const { sendResponse } = require("../common");

const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
  try {
    // Se obtienen los parámetros necesarios para la elimnación del usuario del body de la request
    const { email } = JSON.parse(event.body);

    // Se obtiene el ID del UserPool de cognito de las variables de entorno
    const { user_pool_id } = process.env;

    // Se establecen los parámetros necesarios para la eliminación del usuario
    const params = {
      UserPoolId: user_pool_id,
      Username: email,
    };

    // Invocación de función propia de AWS-SDK para eliminar el usuario
    await cognito.adminDeleteUser(params).promise();

    return sendResponse(200, { message: "User delete successful" });
  } catch (error) {
    const message = error.message ? error.message : "Internal server error";
    return sendResponse(500, { message });
  }
};
