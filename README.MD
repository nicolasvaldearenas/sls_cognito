#Despliegue

sls deploy

#Endpoints disponibles

{{host}}/user/signup
Crea un usuario nuevo

{{host}}/user/login
Permite hacer logearse con el usuario creado. En la response viene el Token necesario para autorizar la request en los dos endpoints siguientes

{{host}}/user/update
Permite editar la información de un usuario

{{host}}/user/delete
Permite eliminar un usuario de Cognito

#Postman
En el directorio /postman del proyecto se incluye el archivo "sls-cognito.postman_collection.json" el cual es una colección que debe importarse en la aplicación Postman para realizar las pruebas

##Consideraciones para realizar las pruebas

- La colección de Postman contiene una variable llamada host, la misma debe ser cambiada por la url del stage de ApiGateway de la API generada por el despliegue

- Para que las peticiones de update y delete de usuarios sean autorizadas, debe copiarse el Token devuelto en la response de login y pegarse en la sección de Authorization de la request, habiendo seleccionado Bearer Token previamente como tipo de autenticación

- Las estructuras de los bodies necesarios para cada request ya se encuentran en la request de postman correspondiente
