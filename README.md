# Transportes galmiche

Pagina web para la publicidad e informacion de la empresa transportes galmiche

La pagina esta contruida a trasves de la estructura que proporciona firebase, ya que en dicha plataforma de servicios en la nube se esta alojando el proyecto, y consumiendo los servicios web que brinda, la apliacion se compone de un frontend con html, css y javascript y de un backend desarrollado con javascript utilizando el framework de express.

## Desarrollo de frontend

El fronten esta alojado en la carpeta public y utiliza una estructura basica de archivos, con su carpeta de imagenes, paginas, scripts y styles

Se consume la api de backend a traves del cliente de axios

## Desarrollo del backend

El backend de la aplicacion esta desarrollado en el lenguaje de programacion de javascript utilizando el framework de express, e incorporando varias librerias para poder lograr el objetivo. La estructura del este se basa en routers y services, teniendo las siguientes carpetas:

- Configs
- Middlewares
- Models
- Routers
- Schema
- Services
- Utils
- Validations

### Estructura de la base de datos

La base de datos que se esta incorporando es la proporcionada por firebase "firestore databse", basa en documentos por lo tanto es una base de datos no sql, la cual contiene los siguientes documentos:

- Usuarios
- Vacantes

#### Contendio de los documentos

**Usuarios**

- nombre_user
- apellido_p_user
- apellido_m_user
- direccion_user
- correo_user
- password_user
- tipo_user
- access_to_user
- recovery_code_user
- activo_user

**Vacantes**

- puesto_vacante
- requisitos_vacante
- disponible_vacante

