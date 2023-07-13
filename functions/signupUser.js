const AWS = require("aws-sdk");
const { sendResponse } = require("../common");

const cognito = new AWS.CognitoIdentityServiceProvider();

module.exports.handler = async (event) => {
  try {
    // Se obtienen los parámetros necesarios para la creación del usuario del body de la request
    const { email, password, first_name, last_name, age } = JSON.parse(
      event.body
    );

    // Se obtiene el ID del UserPool de usuarios de las variables de entorno
    const { user_pool_id } = process.env;

    /*
     * Se establecen los parámetros necesarios para la creación del usuario
     * UserPoolId: ID del UserPool donde se crearán los usuarios
     * Username: Atributo que será usado como nombre de usuario
     * UserAttributes: Array de atributos del usuario propios de este ŕoyecto, pueden cambiar
     * MessageAction: Acción de mensajería que se realizará al crear el usuariom en este caso SUPPRESS para que no se envíe ningún mail
     */
    const params = {
      UserPoolId: user_pool_id,
      Username: email,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
        {
          Name: "email_verified",
          Value: "true",
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
      MessageAction: "SUPPRESS",
    };

    // Invocación de función de creación de usuario propia de AWS-SDK
    const response = await cognito.adminCreateUser(params).promise();

    // Si el usuario se crea correctamente se setea la contraseña recibida en el body
    // Importante: paramsForSetPass.Permanent: true para que la contraseña seteada no sea temporal
    if (response.User) {
      const paramsForSetPass = {
        Password: password,
        UserPoolId: user_pool_id,
        Username: email,
        Permanent: true,
      };
      await cognito.adminSetUserPassword(paramsForSetPass).promise();
    }
    return sendResponse(200, { message: "User registration successful" });
  } catch (error) {
    const message = error.message ? error.message : "Internal server error";
    return sendResponse(500, { message });
  }
};
