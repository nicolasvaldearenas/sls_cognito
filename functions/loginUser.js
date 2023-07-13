const AWS = require("aws-sdk");
const { sendResponse } = require("../common");

const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
  try {
    // Se obtienen los parámetros necesarios para el login del usuario del body de la request
    const { email, password } = JSON.parse(event.body);

    // Se obtienen el ID del UserPool y ID del cliente de cognito de las variables de entorno
    const { user_pool_id, client_id } = process.env;

    // Se establecen los parámetros necesarios para el login del usuario
    const params = {
      AuthFlow: "ADMIN_NO_SRP_AUTH",
      UserPoolId: user_pool_id,
      ClientId: client_id,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };

    // Invocación de función de login de usuario propia de AWS-SDK
    const response = await cognito.adminInitiateAuth(params).promise();

    // Si la autenticación es correcta se devuelve el IdToken en la response
    return sendResponse(200, {
      message: "Success",
      token: response.AuthenticationResult.IdToken,
    });
  } catch (error) {
    const message = error.message ? error.message : "Internal server error";
    return sendResponse(500, { message });
  }
};
