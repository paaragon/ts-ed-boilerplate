import literals from './literals';
import regexp from '../regexp';

const swaggerlits = {
    // Auth authenticate()
    SWAGGER_AUTH_AUTHENTICATE_SUMMARY: 'Autenticación de usuarios',
    SWAGGER_AUTH_AUTHENTICATE_descRIPTION: 'Obtención de x-token',
    SWAGGER_AUTH_AUTHENTICATE_200_descRIPTION: 'Éxito',
    SWAGGER_AUTH_AUTHENTICATE_400_descRIPTION: `"${literals.FALTAN_PARAMETROS}". Usuario y/o contraseña no presentes en la petición`,
    SWAGGER_AUTH_AUTHENTICATE_401_descRIPTION: `"${literals.CREDENCIALES_INCORRECTAS}". Las credenciales proporcionadas no pertenecen a un usuario registrado en la base de datos`,
    SWAGGER_AUTH_AUTHENTICATE_USERNAME_desc: `Nombre del login del usuario`,
    SWAGGER_AUTH_AUTHENTICATE_PASSWORD_desc: `Contraseña del login del usuario`,
    // Rest getAll()
    SWAGGER_REST_GET_ALL_SUMMARY: 'Obtener recursos',
    SWAGGER_REST_GET_ALL_descRIPTION: 'Los recursos pueden ser paginados, ordenados y filtrados',
    SWAGGER_REST_GET_ALL_200_descRIPTION: 'Éxito',
    SWAGGER_REST_GET_ALL_400_descRIPTION: `"${literals.RESOURCE_NOT_FOUND}" No se encuentra el tipo de recurso`,
    SWAGGER_REST_GET_ALL_404_descRIPTION: `<ul><li>"${literals.FILTERS_FORMAT_EXCEPTION}"</li><li>"${literals.ORDERS_FORMAT_EXCEPTION}"</li><li>"${literals.COLUMN_NOT_FOUND} {field-name}"</li><ul>`,
    SWAGGER_REST_GET_ALL_OBJECT_TYPE_desc: 'Recurso solicitado',
    SWAGGER_REST_GET_ALL_PAGE_desc: 'Número de página',
    SWAGGER_REST_GET_ALL_ELEMENTS_PER_PAGE_desc: 'Número de elementos por página',
    SWAGGER_REST_GET_ALL_ORDERS_desc: `Condiciones de ordenación. <strong>Ejemplo:</strong> <em>[field1:asc][field2:desc]</em>. <strong>RegExp:</strong> <em>${regexp.ordersPattern}</em>`,
    SWAGGER_REST_GET_ALL_FILTERS_desc: `Condiciones de filtrado. <strong>Ejemplo:</strong> <em>[field1:eq:1][field2:like:%un+ejemplo%]</em>. <strong>RegExp:</strong> <em>${regexp.filtersPattern}</em>`,
    // Rest getOne()
    SWAGGER_REST_GET_ONE_SUMMARY: 'Obtener un recurso',
    SWAGGER_REST_GET_ONE_descRIPTION: 'El recurso se identifica por su clave primaria',
    SWAGGER_REST_GET_ONE_200_descRIPTION: 'Éxito',
    SWAGGER_REST_GET_ONE_404_descRIPTION: `"${literals.RESOURCE_NOT_FOUND}" Puede ser debido a que el tipo de recurso (:resource) no sea válido o porque no exista un recurso de ese tipo con el identificador solicitado`,
    SWAGGER_REST_GET_ONE_OBJECT_TYPE_desc: `Recurso solicitado`,
    SWAGGER_REST_GET_ONE_KEY_desc: `Clave primaria del recurso solicitado`,
    // Rest create()
    SWAGGER_REST_CREATE_SUMMARY: 'Crear un nuevo recurso',
    SWAGGER_REST_CREATE_descRIPTION: 'El cuerpo de la petición se compondrá con la estructura del recurso a insertar',
    SWAGGER_REST_CREATE_200_descRIPTION: 'Éxito',
    SWAGGER_REST_CREATE_400_descRIPTION: `"${literals.CREATE_DATA_NOT_FOUND}"`,
    SWAGGER_REST_CREATE_404_descRIPTION: `"${literals.RESOURCE_NOT_FOUND}" No se encuentra el tipo de recurso`,
    SWAGGER_REST_CREATE_OBJECT_TYPE_desc: `Recurso solicitado`,
    SWAGGER_REST_CREATE_BODY_desc: `Representación del recurso a crear`,
    // Rest edit()
    SWAGGER_REST_EDIT_SUMMARY: 'Editar un recurso existente',
    SWAGGER_REST_EDIT_descRIPTION: 'El recurso se identifica por su clave primaria',
    SWAGGER_REST_EDIT_200_descRIPTION: 'Éxito',
    SWAGGER_REST_EDIT_400_descRIPTION: `"${literals.UPDATE_DATA_NOT_FOUND}"`,
    SWAGGER_REST_EDIT_404_descRIPTION: `"${literals.RESOURCE_NOT_FOUND}" No se encuentra el tipo de recurso o el recurso con el id solicitado)`,
    SWAGGER_REST_EDIT_OBJECT_TYPE_desc: `Recurso solicitado`,
    SWAGGER_REST_EDIT_KEY_desc: `Clave primaria del recurso solicitado`,
    SWAGGER_REST_EDIT_BODY_desc: `Representación del recurso a crear`,
    // Rest delete()
    SWAGGER_REST_DELETE_SUMMARY: 'Eliminar un recurso existente',
    SWAGGER_REST_DELETE_descRIPTION: 'El recurso se identifica por su clave primaria',
    SWAGGER_REST_DELETE_200_descRIPTION: 'Éxito',
    SWAGGER_REST_DELETE_404_descRIPTION: `"${literals.RESOURCE_NOT_FOUND}"  No se encuentra el tipo de recurso`,
    SWAGGER_REST_DELETE_OBJECT_TYPE_desc: `Recurso solicitado`,
    SWAGGER_REST_DELETE_KEY_desc: `Clave primaria del recurso solicitado`,
    // Users getAll()
    SWAGGER_USES_GET_ALL_SUMMARY: 'Obtención de todos los usuarios',
    SWAGGER_USES_GET_ALL_descRIPTION: 'Éxito',
};

export default swaggerlits;