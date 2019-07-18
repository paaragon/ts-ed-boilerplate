const literals = {
    // AuthCtrl
    FALTAN_PARAMETROS: 'Faltan parametros',
    CREDENCIALES_INCORRECTAS: 'Credenciales incorrectas',
    // UsersCtrl
    CREATE_USER_MISSING_PARAMS: 'Faltan parámetros para crear el usuario (nombre, apellidos, username, password)',
    UPDATE_USER_INSUFICENT_PRIVILEGES: 'Permisos insuficientes para modificar este usuario',
    UPDATE_USER_ROL_INSUFICENT_PRIVILEGES: 'Permisos insuficientes para modificar el rol del usuario',
    CHANGE_PASSWORD_WRONG_REPEAT: 'La nueva contraseña no coincide en la repetición',
    CURRENT_PASSWORD_INCORRECT: 'La contraseña actual no es correcta',
    DELETING_SELF_USER: 'El usuario que se quiere eliminar es el mismo con el que se realiza la petición',
    // AuthMiddleware
    MISSING_TOKEN: 'No se encuentra un token',
    // AuthService
    NOT_VALID_ROL: 'Rol no valido',
    TOKEN_VERIFY_ERROR: 'Error al verificar el token',
    // RestCtrl
    RESOURCE_NOT_FOUND: 'Recurso no encontrado',
    OPERATOR_NOT_FOUND: 'Operador no encontrado',
    ORDER_FIELD_NOT_FOUND: 'Campo de ordenación no encontrado',
    COLUMN_NOT_FOUND: 'No se encuentra la columna',
    UPDATE_DATA_NOT_FOUND: 'No se han encontrado datos para actualizar el recurso',
    CREATE_DATA_NOT_FOUND: 'No se han encontrado datos para crear el recurso',
    FILTERS_FORMAT_EXCEPTION: 'Formato del filtro incorrecto',
    ORDERS_FORMAT_EXCEPTION: 'Formato de la ordenación incorrecto',
    BRACKET_QUERY_WRONG_FORMAT: 'Formato de los parametros "bracket params" incorrecto'
};

export default literals;