const AWS = require("aws-sdk");
const { sendResponse } = require("../common");

const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
  try {
    // Se obtienen los parámetros necesarios para la actualización del usuario del body de la request
    const { email, first_name, last_name, age } = JSON.parse(event.body);

    // Se obtienen el ID del UserPool de cognito de las variables de entorno
    const { user_pool_id } = process.env;

    // Se establecen los parámetros necesarios para la modificación del usuario
    const params = {
      UserPoolId: user_pool_id,
      Username: email,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "custom:first_name",
          Value: first_name,
        },
        {
          Name: "custom:last_name",
          Value: last_name,
        },
        {
          Name: "custom:age",
          Value: age,
        },
      ],
    };

    // Invocación de función propia de AWS-SDK para modificar los atributos de un usuario
    await cognito.adminUpdateUserAttributes(params).promise();

    return sendResponse(200, { message: "User update successful" });
  } catch (error) {
    const message = error.message ? error.message : "Internal server error";
    return sendResponse(500, { message });
  }
};
