// Importar las dependencias
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const salt = bcrypt.genSaltSync(10);
const stripe = require('stripe')('sk_test_51OqKITGl1997KuzQMJdP0omwI7Xrk1X672ueUpm1ncFQVD0GJ9tAWLbyLB6Ydt8wppyb1LaH6BQb3zz2rAVkhMyc00aw7M0F2O');

// Configurar la conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost', // La dirección del servidor MySQL
  user: 'root', // El nombre de usuario de MySQL
  password: '', // La contraseña de MySQL
  database: 'fintech_app' // El nombre de tu base de datos MySQL
});
// Establecer la conexión a la base de datos
connection.connect(err => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos MySQL exitosa');
});
// Crear una instancia de Express
const app = express();

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:8081' }));
// Configurar multer para manejar el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Directorio donde se almacenarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre de archivo único
  }
});


const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.post('/upload', upload.single('foto_usuario'), (req, res) => {
  try {
    const userId = req.body.id;
    if (!userId) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    // Obtener la extensión de la imagen
    const imageExtension = path.extname(req.file.originalname);

    // Construir la ruta de archivo en el servidor
    const imagePath = `uploads/${userId}${imageExtension}`;

    // Mover el archivo a la ruta de archivo en el servidor
    fs.renameSync(req.file.path, imagePath);

    // Actualizar la URL de la imagen en la base de datos
    const updateQuery = 'UPDATE usuarios SET foto_usuario = ? WHERE id = ?';
    connection.query(updateQuery, [imagePath, userId], (err, results) => {
      if (err) {
        console.error('Error al actualizar la URL de la imagen en la base de datos:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      if (results.affectedRows === 0) {
        console.error('No se actualizó ninguna fila en la base de datos');
        return res.status(500).json({ error: 'No se pudo actualizar la URL de la imagen' });
      }
      const serverIP = '192.168.1.69'; // La dirección IP del servidor
const imageUrl = `${req.protocol}://${serverIP}/${imagePath}`;
res.status(200).json({ imageUrl: imageUrl });
    });
  } catch (error) {
    console.error('Error al procesar imagen:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


////// Documentos:

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'documentos_ine/'); // Directorio donde se almacenarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre de archivo único
  }
});

const documentos_ine = multer({ storage: storage2 });
app.use('/documentos_ine', express.static(path.join(__dirname, 'documentos_ine')));
app.post('/documentos_ine', documentos_ine.single('Documento'), (req, res) => {
  try {
    const userId = req.body.id;
    if (!userId) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    // Obtener la extensión de la imagen
    const imageExtension = path.extname(req.file.originalname);

    // Construir la ruta de archivo en el servidor
    const imagePath = `documentos_ine/${userId}${imageExtension}`;

    // Mover el archivo a la ruta de archivo en el servidor
    if (fs.existsSync(imagePath)) {
      const imagePath1 = `documentos_ine/${userId}-1${imageExtension}`;
      fs.renameSync(req.file.path, imagePath1);
    }
    fs.renameSync(req.file.path, imagePath);
    const exito = 1;
    res.status(200).send(exito);
    console.log('se envia exito');
  } catch (error) {
    console.error('Error al procesar imagen:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

const storage3 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'documentos_curp/'); // Directorio donde se almacenarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre de archivo único
  }
});

const documentos_curp = multer({ storage: storage3 });
app.use('/documentos_curp', express.static(path.join(__dirname, 'documentos_curp')));
app.post('/documentos_curp', documentos_curp.single('Documento'), (req, res) => {
  try {
    const userId = req.body.id;
    if (!userId) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    // Obtener la extensión de la imagen
    const imageExtension = path.extname(req.file.originalname);

    // Construir la ruta de archivo en el servidor
    const imagePath = `documentos_curp/${userId}${imageExtension}`;

    // Mover el archivo a la ruta de archivo en el servidor
    fs.renameSync(req.file.path, imagePath);
    const exito = 1;
    res.status(200).send(exito);
    console.log('se envia exito');
  } catch (error) {
    console.error('Error al procesar imagen:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/registro', (req, res) => {
  const { nombre, telefono, correo_electronico, password, codigoAfiliado, numero_afiliado_referente } = req.body;

  // Verificar si el correo ya está registrado
  const correoQuery = 'SELECT COUNT(*) AS count FROM usuarios WHERE correo_electronico = ?';
  connection.query(correoQuery, [correo_electronico], (err, correoResults) => {
    if (err) {
      console.error('Error al realizar la consulta de correo:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }

    const correoCount = correoResults[0].count;
    if (correoCount > 0) {
      // Si el correo ya está registrado, devolver un mensaje de error
      res.status(400).json({ error: 'El correo ya está registrado' });
      return;
    }

    // Verificar el número de veces que se ha registrado el código de afiliado
    const afiliadoQuery = 'SELECT COUNT(*) AS count FROM usuarios WHERE numero_afiliado_referente = ?';
    connection.query(afiliadoQuery, [numero_afiliado_referente], (err, afiliadoResults) => {
      if (err) {
        console.error('Error al realizar la consulta de afiliado:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
        return;
      }

      const afiliadoCount = afiliadoResults[0].count;
      if (afiliadoCount >= 7) {
        // Si el código de afiliado ya está registrado el máximo de veces permitido, devolver un mensaje de error
        res.status(400).json({ error: 'El código de afiliado ya está registrado el máximo de veces permitido' });
        return;
      }
      bcrypt.hash(password, salt, (err, hashedPassword) => {
        if (err) {
          console.error('Error al hashear la contraseña:', err);
          res.status(500).json({ error: 'Error interno del servidor para hashear la contraseña' });
          return;
        }
      
      // Insertar el nuevo usuario en la base de datos
      const insertQuery = 'INSERT INTO usuarios (nombre, telefono, correo_electronico, password, codigo_afiliado, numero_afiliado_referente) VALUES (?, ?, ?, ?, ?, ?)';
      connection.query(insertQuery, [nombre, telefono, correo_electronico, hashedPassword, codigoAfiliado, numero_afiliado_referente], (err, results) => {
        if (err) {
          console.error('Error al insertar usuario:', err);
          res.status(500).json({ error: 'Error interno del servidor para insertar' });
          return;
        }
      });
        // Buscar el ID del usuario recién insertado
        const selectUserIdQuery = 'SELECT id FROM usuarios WHERE correo_electronico = ?';
        connection.query(selectUserIdQuery, [correo_electronico], (err, userIdResults) => {
          if (err) {
            console.error('Error al buscar el ID del usuario:', err);
            res.status(500).json({ error: 'Error interno del servidor al buscar el ID del usuario' });
            return;
          }

          const userId = userIdResults[0].id;

          // Insertar datos predeterminados en la tabla cuentas_bancarias
          const insertCuentaQuery = `
            INSERT INTO cuentas_bancarias
            (id,id_usuario, tipo_cuenta, numero_cuenta, banco, saldo_afiliados, titular_cuenta, numero_tarjeta, nombre_cuenta)
            VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)
          `;
          const defaultCuentaData = {
            id:null,
            id_usuario: userId, // ID del nuevo usuario
            tipo_cuenta: 'sin cuenta',
            numero_cuenta: 'sin número',
            banco: 'sin banco',
            saldo_afiliados: 0,
            titular_cuenta: 'sin nombre',
            numero_tarjeta: 'sin número',
            nombre_cuenta: 'sin nombre'
          };
          connection.query(insertCuentaQuery, [defaultCuentaData.id,defaultCuentaData.id_usuario, defaultCuentaData.tipo_cuenta, defaultCuentaData.numero_cuenta, defaultCuentaData.banco, defaultCuentaData.saldo_afiliados, defaultCuentaData.titular_cuenta, defaultCuentaData.numero_tarjeta, defaultCuentaData.nombre_cuenta], (err, cuentaResults) => {
            if (err) {
              console.error('Error al insertar datos en cuentas_bancarias:', err);
              res.status(500).json({ error: 'Error interno del servidor para insertar datos en cuentas_bancarias' });
              return;
            }

            res.status(201).json({ message: 'Usuario registrado exitosamente' });
          });
        });
      });
    });
  });
});


app.get('/getBlob/:userId', (req, res) => {
  // Realizar la consulta SQL para obtener el BLOB de la base de datos
  const userId = req.params.userId;
  console.log('ID de usuario recibido:', userId); // Registro para verificar el ID del usuario

  connection.query('SELECT foto_usuario FROM usuarios WHERE id = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener el BLOB:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'No se encontró el usuario con el ID proporcionado' });
      return;
    }

    // Devolver el BLOB como respuesta
    const blob = blob.toString(results[0].foto_usuario);
    res.status(200).send(blob);
  });
});

// Ruta para manejar las solicitudes de inicio de sesión
app.post('/login', (req, res) => {
  const { correo_electronico, password } = req.body;
  
  // Realizar la lógica de autenticación con la base de datos aquí
  // Por ejemplo, puedes hacer una consulta a la base de datos para verificar las credenciales
  const query = 'SELECT * FROM usuarios WHERE correo_electronico = ?';
  
  connection.query(query, [correo_electronico], (err, results) => {
    if (err) {
      console.error('Error al realizar la consulta:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    if (results.length === 0) {
      // Si no se encuentra el usuario, devolver un error de credenciales inválidas
      res.status(401).json({ error: 'Credenciales inválidas' });
    } else {
      // Si las credenciales son válidas, verificar la contraseña con bcrypt
      const usuario = results[0]; // Suponiendo que solo se espera un resultado
      const hashedPassword = usuario.password;
      
      bcrypt.compare(password, hashedPassword, (err, isMatch) => {
        if (err) {
          console.error('Error al comparar las contraseñas:', err);
          res.status(500).json({ error: 'Error interno del servidor para comparar las contraseñas' });
          return;
        }

        if (isMatch) {
          // Si las contraseñas coinciden, iniciar sesión exitosamente y enviar los datos del usuario
          const { foto_usuario, ...usuarioSinFoto } = usuario;
          const token = jwt.sign({ usuario: usuarioSinFoto }, 'clave_secreta', { expiresIn: '1h' });
          
          // Verificar si ha pasado más de 15 días desde el último retiro del usuario
          const queryUltimoRetiro = 'SELECT MAX(fecha_inicio) AS ultima_fecha_retiro FROM inversiones WHERE id_usuario = ? AND descripcion = "Retiro de cuenta"';
          connection.query(queryUltimoRetiro, [usuario.id], (err, results) => {
            if (err) {
              console.error('Error al obtener la fecha del último retiro:', err);
              res.status(500).json({ error: 'Error interno del servidor al obtener la fecha del último retiro' });
              return;
            }
            const fechaActual = new Date();
            const diaActual = fechaActual.getDate();
            const fechaCreacionUsuario = new Date(usuario.fecha_creacion);
            console.log('datos de creacion:',usuario.fecha_creacion);
            const mesesTranscurridos = (fechaActual.getFullYear() - fechaCreacionUsuario.getFullYear()) * 12 + fechaActual.getMonth() - fechaCreacionUsuario.getMonth();
            const ultimaFechaRetiro = results[0].ultima_fecha_retiro;
            console.log('Fecha del último retiro:', ultimaFechaRetiro);
            const diasTranscurridos = usuario.fecha_creacion ? Math.floor((new Date() - new Date(usuario.fecha_creacion)) / (1000 * 60 * 60 * 24)) : null;
            console.log('dias de retiro:', diasTranscurridos);
            console.log('dias transcurridos:', diaActual);
            console.log('Meses transcurridos:', mesesTranscurridos);
            let nuevoValorActualizadoSaldo;

            // if (mesesTranscurridos >= 1) {
            //   nuevoValorActualizadoSaldo = 0;
            // } else {
            //   nuevoValorActualizadoSaldo = 1;
            // }
              // < es para que funcione correctamente. > es para que permita actualizar
            if (diaActual>= 1) {
              // Actualizar el campo actualizado_saldo en la tabla usuarios
              console.log('dias para actulizar',diaActual);
              const queryActualizarSaldo = 'UPDATE usuarios SET actualizado_saldo = 0 WHERE id = ?';
              connection.query(queryActualizarSaldo, [usuario.id], (err, results) => {
                if (err) {
                  console.error('Error al actualizar el campo actualizado_saldo:', err);
                  res.status(500).json({ error: 'Error interno del servidor al actualizar el campo actualizado_saldo' });
                  return;
                }
              });
            }else {
              // Actualizar el campo actualizado_saldo en la tabla usuarios
              console.log('dias para actulizar',nuevoValorActualizadoSaldo);
              const queryActualizarSaldo = 'UPDATE usuarios SET actualizado_saldo = 1 WHERE id = ?';
              connection.query(queryActualizarSaldo, [usuario.id], (err, results) => {
                if (err) {
                  console.error('Error al actualizar el campo actualizado_saldo:', err);
                  res.status(500).json({ error: 'Error interno del servidor al actualizar el campo actualizado_saldo' });
                  return;
                }
              });
            }
          });
          res.status(200).json({ message: 'Inicio de sesión exitoso', usuario: usuarioSinFoto, token });
        } else {
          res.status(401).json({ error: 'Credenciales inválidas' });
        }
      });
    }
  });
});


app.post('/autenticacion-biometrica', (req, res) => {
  const { token } = req.body;
  
  // Verificar la autenticidad del token
  jwt.verify(token, 'clave_secreta', (err, decoded) => {
    if (err) {
      console.error('Error al verificar el token:', err);
      res.status(401).json({ error: 'Token inválido' });
    } else {
      // Si el token es válido, recuperar los datos del usuario asociados con el correo electrónico del token
      console.log('datos del decoded',decoded.usuario.correo_electronico);
      console.log('esto imprime token:',token)
      const {correo_electronico} = decoded.usuario.correo_electronico;
      
      // Lógica para recuperar los datos del usuario desde la base de datos
      const query = 'SELECT * FROM usuarios WHERE correo_electronico = ?';
      connection.query(query, [decoded.usuario.correo_electronico], (err, results) => {
        if (err) {
          console.error('Error al recuperar los datos del usuario:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
        } else {
          if (results.length === 0) {
            console.log('esta es la consulta que se esta haciendo',query,correo_electronico,decoded.usuario.correo_electronico);
            console.log('este es el dato que regresa: ',results[0]);
            res.status(404).json({ error: 'Usuario no encontrado' });
          } else {
            
            console.log('datos del usuario decoded: ',decoded);
            const usuarios= decoded.usuario;
            res.status(200).json({ message: 'Autenticación biométrica exitosa', usuarios });
          }
        }
      });
    }
  });
});

app.post('/update-balance', (req, res) => {
  const { usuarioId, codigoAfiliado,porcentaje,porcentaje_afiliado } = req.body;
  console.log('todo',req.body)
  const porcentajeConvertido = porcentaje_afiliado / 100;
  console.log('usuarioId:', usuarioId);
  console.log('codigoAfiliado:', codigoAfiliado);
  console.log('porcentaje_afiliado:', porcentajeConvertido);
  // Array para almacenar los datos de los afiliados
  let datosafiliados = [];

  // Verificar si el usuario tiene afiliados
  const query = 'SELECT COUNT(*) as count FROM usuarios WHERE numero_afiliado_referente = ?';
  connection.query(query, [codigoAfiliado], (err, results) => {
    if (err) {
      console.error('Error al verificar los afiliados:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    const hasAffiliates = results[0].count > 0;
    if (hasAffiliates) {
      // Obtener el saldo de cada afiliado
      const query = 'SELECT id, nombre, saldo FROM usuarios WHERE numero_afiliado_referente = ? AND id != ?';
      connection.query(query, [codigoAfiliado, usuarioId], (err, results) => {
        if (err) {
          console.error('Error al obtener los afiliados:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
          return;
        }

        console.log('Resultados de la consulta SQL:', results);

        let totalAffiliateBalance = 0;

        // Iterar sobre los resultados y guardar los datos de los afiliados en el array
        for (const affiliate of results) {
          totalAffiliateBalance += affiliate.saldo;
          let bono;
          switch (porcentaje_afiliado) {
            case 6:
              bono = affiliate.saldo * 0.06;
              break;
            case 7:
              bono = affiliate.saldo * 0.071;
              break;
            case 9:
              bono = affiliate.saldo * 0.094;
              break;
            default:
              bono = 0;
              break;
          }
          // Crear un objeto para cada afiliado con su id y saldo
          const afiliado = {
            id: affiliate.id,
            nombre: affiliate.nombre,
            saldo: affiliate.saldo,
            bono:bono
          };

          // Agregar el objeto afiliado al array
          datosafiliados.push(afiliado);
        }
        const querybono = 'SELECT saldo FROM usuarios WHERE  id = ?';
connection.query(querybono, [usuarioId], (err, results1) => {
  if (err) {
    console.error('Error al realizar la consulta del bono:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
    return;
  }

  // Ahora, results contendrá el resultado de la consulta
  console.log('Resultado para bono:', results1[0].saldo);
 let saldobono= results1[0].saldo;
        // Calcular el 5% del saldo total de los afiliados
        let affiliateBonus;

if (porcentaje_afiliado === 6) {
  // Si porcentaje_afiliado es igual a 6, multiplica por 0.06
  affiliateBonus = totalAffiliateBalance * 0.06;
} else if(porcentaje_afiliado === 7){
  // Para otros valores de porcentaje_afiliado, multiplica por 0.05
  affiliateBonus = totalAffiliateBalance * 0.071;
}else if(porcentaje_afiliado === 9){
  affiliateBonus = totalAffiliateBalance * 0.094;
}else{
  affiliateBonus=0
}

let bonoplan;

if (porcentaje === 6) {
  bonoplan = saldobono * 0.057;
} else if(porcentaje === 7){
  bonoplan = saldobono * 0.073;
}else if(porcentaje === 8){
  bonoplan = saldobono * 0.084;
}else{
  bonoplan = 0
}
        console.log('porcentaje',porcentaje);
        console.log('esto es lo que sumo',totalAffiliateBalance);
        console.log('esto es el bono de 0.05',affiliateBonus);
        console.log('esto es el bono del plan:',bonoplan);
        const sumabonos= bonoplan+affiliateBonus;
        const factor = Math.pow(10, 2);
        const resultado = Math.round(sumabonos * factor) / factor;
        console.log('Suma:',resultado);
        const updateQuery = `
        UPDATE cuentas_bancarias AS cb
        JOIN usuarios AS u ON cb.id_usuario = u.id
        SET cb.saldo_afiliados = 
            CASE 
                WHEN u.actualizado_saldo = 0 THEN u.saldo + ?  
                ELSE cb.saldo_afiliados
            END
        WHERE u.id = ?;
        `;
        
          console.log('si hay dato que ver',porcentaje);
          connection.query(updateQuery, [resultado, usuarioId], (err, results) => {
          if (err) {
            console.error('Error al actualizar el saldo en cuentas_bancarias:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
          }

          const queryCuenta = `SELECT * FROM cuentas_bancarias WHERE id_usuario = ?`;
          connection.query(queryCuenta, [usuarioId], (error, resultsCuenta) => {
            if (error) {
              console.error('Error al obtener los datos de la cuenta bancaria:', error);
              res.status(500).json({ error: 'Error interno del servidor' });
              return;
            }

            console.log('estos son los datos bancarios:', resultsCuenta);

            // Si no hay datos de cuenta, asignar un valor predeterminado para nombre_cuenta
            const cuenta = resultsCuenta.length > 0 ? resultsCuenta[0] : { nombre_cuenta: 'sin nombre' };
            const querybank = `
              SELECT id, id_usuario, cantidad, descripcion, fecha_inicio
              FROM inversiones
              WHERE id_usuario = ?
              ORDER BY fecha_inicio DESC
            `;

            // Ejecutar la consulta SQL y procesar los resultados
            
            connection.query(querybank, [usuarioId], (err, results1) => {
              if (err) {
                console.error('Error al obtener las inversiones:', err);
                res.status(500).json({ error: 'Error interno del servidor' });
                return;
              }
            
              // Objeto para almacenar las inversiones por fecha
              const inversionesPorFecha = {};

              // Procesar cada inversión y organizarlas por fecha
              results1.forEach(inversion => {
                const fecha = inversion.fecha_inicio.toISOString().split('T')[0];

                if (!inversionesPorFecha[fecha]) {
                  inversionesPorFecha[fecha] = [];
                }

                inversionesPorFecha[fecha].push(inversion);
              });

              //console.log('Resultados de la consulta SQL:', inversionesPorFecha);
              // Ahora tienes las inversiones organizadas por fecha en inversionesPorFecha
              console.log('datos de afiliados:', datosafiliados);
              // Devolver el saldo total de los afiliados, el bono, los datos de los afiliados, las inversiones y los datos de la cuenta bancaria como una respuesta al cliente
              res.status(200).json({ message: 'Saldo actualizado exitosamente', totalAffiliateBalance, affiliateBonus, datosafiliados, inversionesPorFecha, cuenta });
            });
            });
          });
        });
      });
    } else {
      // Si no hay afiliados, devolver un objeto cuenta con nombre_cuenta predeterminado
      const querybank = `
              SELECT id, id_usuario, cantidad, descripcion, fecha_inicio
              FROM inversiones
              WHERE id_usuario = ?
              ORDER BY fecha_inicio DESC
            `;
      const queryCuenta = `SELECT * FROM cuentas_bancarias WHERE id_usuario = ?`;
      connection.query(queryCuenta, [usuarioId], (error, resultsCuenta) => {
        if (error) {
          console.error('Error al obtener los datos de la cuenta bancaria:', error);
          res.status(500).json({ error: 'Error interno del servidor' });
          return;
        }
        connection.query(querybank, [usuarioId], (err, results1) => {
          if (err) {
            console.error('Error al obtener las inversiones:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
          }

          // Objeto para almacenar las inversiones por fecha
          const inversionesPorFecha = {};

          // Procesar cada inversión y organizarlas por fecha
          results1.forEach(inversion => {
            const fecha = inversion.fecha_inicio.toISOString().split('T')[0];

            if (!inversionesPorFecha[fecha]) {
              inversionesPorFecha[fecha] = [];
            }

            inversionesPorFecha[fecha].push(inversion);
          });
        
        console.log('Resultados de la consulta SQL:', inversionesPorFecha);
        console.log('estos son los datos bancarios:', resultsCuenta);

        // Si no hay datos de cuenta, asignar un valor predeterminado para nombre_cuenta
      const cuenta = resultsCuenta.length > 0 ? resultsCuenta[0] : { nombre_cuenta: 'sin nombre' };
      const datosafiliados =[];
      const affiliateBonus=0;
      res.status(200).json({ message: 'No hay afiliados', datosafiliados, cuenta, affiliateBonus,inversionesPorFecha });
      });
    });
    }
  });
});



app.post("/act-datos", (req, res) => {
  const { usuarioId, direccion, telefono, nombre } = req.body;

  // Query para actualizar los datos en la base de datos
  const query = `UPDATE usuarios SET direccion=?, telefono=?, nombre=? WHERE id=?`;

  // Ejecutar la consulta
  connection.query(query, [direccion, telefono, nombre, usuarioId], (error, results) => {
    if (error) {
      console.error("Error al actualizar datos del usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
    console.log("Datos del usuario actualizados correctamente:", results);
    res.status(200).json({ message: "Datos del usuario actualizados correctamente" });
  });
});


app.post("/actualizar_verificado_ine", (req, res) => {
  const { usuarioId, verificadoIne } = req.body;

  // Query para actualizar los datos en la base de datos
  const query = `UPDATE usuarios SET verificado_ine=? WHERE id=?`;

  // Ejecutar la consulta
  connection.query(query, [verificadoIne, usuarioId], (error, results) => {
    if (error) {
      console.error("Error al actualizar datos del usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
    console.log("Datos del usuario verificacion ine exitoso:", results);
    res.status(200).json({ message: "Datos del usuario actualizados correctamente" });
  });
});

app.post("/actualizar_verificado_curp", (req, res) => {
  const { usuarioId, verificadoCurp } = req.body;

  // Query para actualizar los datos en la base de datos
  const query = `UPDATE usuarios SET verificado_curp=? WHERE id=?`;

  // Ejecutar la consulta
  connection.query(query, [verificadoCurp, usuarioId], (error, results) => {
    if (error) {
      console.error("Error al actualizar datos del usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }
    console.log("Datos del usuario verificacion curp exitoso:", results);
    res.status(200).json({ message: "Datos del usuario actualizados correctamente" });
  });
});


app.post("/Act_inversion", (req, res) => {
  const { usuarioId, saldo, fecha_inicio } = req.body;

  // Query para actualizar los datos en la tabla usuarios
  const queryUsuarios = `UPDATE usuarios SET saldo = saldo + ? WHERE id = ?`;
  // Query para actualizar los datos en la tabla cuentas_bancarias
  const queryCuentasBancarias = `UPDATE cuentas_bancarias SET saldo_afiliados = saldo_afiliados + ? WHERE id_usuario = ?`;

  // Ejecutar la consulta para actualizar datos en la tabla usuarios
  connection.query(queryUsuarios, [saldo, usuarioId], (errorUsuarios, resultsUsuarios) => {
    if (errorUsuarios) {
      console.error("Error al actualizar datos del usuario:", errorUsuarios);
      res.status(500).json({ error: "Error interno del servidor" });
      return;
    }

    // Ejecutar la consulta para actualizar datos en la tabla cuentas_bancarias
    connection.query(queryCuentasBancarias, [saldo, usuarioId], (errorCuentasBancarias, resultsCuentasBancarias) => {
      if (errorCuentasBancarias) {
        console.error("Error al actualizar datos en cuentas bancarias:", errorCuentasBancarias);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
      }

      // Si ambas consultas se ejecutan correctamente, enviar una respuesta exitosa
      console.log("Datos actualizados en usuarios:", resultsUsuarios);
      console.log("Datos actualizados en cuentas bancarias:", resultsCuentasBancarias);
      res.status(200).json({ message: "Datos actualizados correctamente en usuarios y cuentas bancarias" });
    });
  });
});


app.post("/Retirar", (req, res) => {
  const { usuarioId, saldo,saldototal,fecha_inicio } = req.body;
  const saldoSinComa = saldo.replace(/,/g, '');
const saldoEntero = parseInt(saldoSinComa, 10);
   console.log('saldo',saldoEntero,'mas saldo total:',saldototal);
  if(saldototal>=saldoEntero){
    const query = `UPDATE usuarios AS u
    JOIN cuentas_bancarias AS cb ON u.id = cb.id_usuario
    SET u.saldo = cb.saldo_afiliados - ?,
        cb.saldo_afiliados = cb.saldo_afiliados - ?
    WHERE u.id = ?`;
    const query1 =`INSERT INTO inversiones (id_usuario, cantidad, descripcion, fecha_inicio) VALUES (?, ?, ?, ?)`;
    // Ejecutar la consulta
    connection.query(query, [saldoEntero, saldoEntero, usuarioId], (error, results) => {
      if (error) {
        console.error("Error al actualizar datos del usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
      }
      const alerta = 1;
      connection.query(query1,[usuarioId,saldoEntero,'Retiro de cuenta',fecha_inicio])
      console.log("Datos del usuario verificacion curp exitoso:", results);
      res.status(200).json({ message: "Datos del usuario actualizados correctamente",alerta});
    });
  }
  // Query para actualizar los datos en la base de datos
});
app.post("/act-datosbanco", (req, res) => {
  const {
    titular_cuenta,numero_tarjeta,banco,nombre_cuenta,numero_cuenta,saldo_afiliados,usuarioId} = req.body;

  // Query para actualizar los datos en la base de datos
  // const query = `UPDATE usuarios SET saldo =? WHERE id = ?`;

  // Ejecutar la consulta
  // connection.query(query,[saldo_afiliados, usuarioId],
  //   (error, results) => {
  //     if (error) {
  //       console.error("Error al actualizar el saldo del usuario:", error);
  //       res.status(500).json({ error: "Error interno del servidor" });
  //       return;
  //     }
  //     console.log("Saldo del usuario actualizado correctamente:", results);

      // Si se actualizó el saldo del usuario correctamente, también se pueden actualizar otros datos de la cuenta bancaria si es necesario
      const updateQuery = `
        UPDATE cuentas_bancarias 
        SET titular_cuenta=?, 
            numero_tarjeta=?, 
            banco=?, 
            nombre_cuenta=?, 
            numero_cuenta=?
        WHERE id_usuario=?`;

      connection.query(
        updateQuery,
        [titular_cuenta, numero_tarjeta, banco, nombre_cuenta, numero_cuenta, usuarioId],
        (error, results) => {
          if (error) {
            console.error("Error al actualizar los datos de la cuenta bancaria:", error);
            res.status(500).json({ error: "Error interno del servidor" });
            return;
          }
          console.log("Datos de la cuenta bancaria actualizados correctamente:", results);
          res.status(200).json({ message: "Datos del usuario y cuenta bancaria actualizados correctamente" });
        }
      );
    //}
  //);
});

app.post("/usuarios", (req, res) => {
  const { usuarioId, } = req.body;
    const query = `SELECT * FROM usuarios WHERE id=?`;

    connection.query(query, usuarioId, (error, results) => {
      if (error) {
        console.error("Error al OBTENER datos del usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
      }
      const data = results[0];
      console.log("datos obtenidos correctamente", data);
      res.status(200).json({ message: "Datos del usuario actualizados correctamente",data});
    });
  
});


const indexRouter = require("../routes/index");
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// app.post('/payment', (req, res) => {
//   const { amount, description, email } = req.body;

//   // Crea el objeto de preferencia de pago
//   const preference = {
//     items: [
//       {
//         title: 'Producto 1',
//         quantity: 1,
//         unit_price: amount,
//       },
//     ],
//     back_urls: {
//       success: 'https://www.tusitio.com/success',
//       failure: 'https://www.tusitio.com/failure',
//       pending: 'https://www.tusitio.com/pending',
//     },
//     auto_return: 'approved',
//     payment_methods: {
//       excluded_payment_methods: [
//         'atm',
//         'account_money',
//         'bank_transfer',
//         'boleta_bapro',
//         'rapipago',
//         'pagofacil',
//         'baloto',
//         'dinero_mail',
//         'prepaid_card',
//         'ticket',
//         'utility_bill',
//         'debit_card',
//         'money',
//         'ticket_boleto',
//         'quick_payment',
//       ],
//       installments: 12,
//     },
//     payer: {
//       email,
//     },
//     notification_url: 'https://www.tusitio.com/notification',
//     external_reference: 'ORDER_ID_12345',
//   };

//   app.post('/process_payment', async (req, res) => {
//     const { payerFirstName, payerLastName, email } = req.body;
  
//     try {
//       const paymentData = {
//         transaction_amount: 5000,
//         description: 'Nombre del Producto',
//         payment_method_id: 'clabe', // Método de pago SPEI
//         payer: {
//           entity_type: 'individual',
//           email: email,
//           first_name: payerFirstName,
//           last_name: payerLastName
//         }
//       };
  
//       const payment = await MercadoPago.payment.save(paymentData);
  
//       res.status(200).json(payment);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });

//   // Crea la preferencia de pago
//   mercadopago.preferences
//     .create(preference)
//     .then(response => {
//       res.json({ preferenceId: response.body.id });
//     })
//     .catch(error => {
//       console.log(error);
//       res.status(500).json({ error: error.message });
//     });
// });

// servicio correo

app.post('/sendVerificationEmail', (req, res) => {
  const { userEmail } = req.body;
  const selectUserIdQuery = 'SELECT id FROM usuarios WHERE correo_electronico = ?';
        connection.query(selectUserIdQuery, [userEmail], (err, userIdResults) => {
          if (err) {
            console.error('Error al buscar el ID del usuario:', err);
            res.status(500).json({ error: 'Error interno del servidor al buscar el ID del usuario' });
            return;
          }
          const userId = userIdResults[0].id;
          const usertoken= jwt.sign({ userId }, 'secreto', { expiresIn: '1d' });
          const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'lechuga.lflr@gmail.com',
      pass: 'adtx cfpz ggsc qcre'
    }
  });
  connection.query('UPDATE usuarios SET verificacionToken = ? WHERE id = ?', [usertoken, userId], (error, results, fields) => {
    if (error) {
      console.error('Error al guardar el token de verificación:', error);
    } else {
      console.log('Token de verificación guardado correctamente');
    }
   // Corregido aquí
    const mailOptions = {
      from: 'lechuga.lflr@gmail.com',
      to: userEmail,
      subject: 'Verificación de correo electrónico',
      html: `<!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificación de correo electrónico</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #1d2027;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
              }
              .container {
                  text-align: center;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 10px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h1 {
                  color: #4CAF50;
                  margin-bottom: 20px;
              }
              p {
                  color: #333;
                  margin-bottom: 20px;
              }
              a {
                  display: inline-block;
                  padding: 10px 20px;
                  background-color: #4CAF50;
                  color: #fff;
                  text-decoration: none;
                  border-radius: 5px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>Verificación de correo electrónico</h1>
              <p>Hola,</p>
              <p>Por favor, haz clic en el siguiente enlace para verificar tu dirección de correo electrónico:</p>
              <a href="https://tvt0tnk6-3000.usw3.devtunnels.ms/verify?token=${usertoken}">Verificar correo electrónico</a>
          </div>
      </body>
      </html>
      `
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo electrónico:', error);
        res.status(500).send('Error al enviar el correo electrónico de verificación');
      } else {
        console.log('Correo electrónico enviado:', info.response);
        res.status(200).send('Correo electrónico de verificación enviado correctamente');
      }
    });
  });
  });
});
app.get('/verify', async (req, res) => {
  const token = req.query.token;

  try {
      const decoded = jwt.verify(token, 'secreto'); // Verifica el token
      const userId = decoded.userId;

      // Actualiza el estado del correo electrónico del usuario como verificado
      connection.query('UPDATE usuarios SET correoElectronicoVerificado = 1 WHERE id = ?', [userId], (error, results, fields) => {
        if (error) {
          console.error('Error al actualizar el estado del correo electrónico del usuario:', error);
          res.status(500).send('Error al actualizar el estado del correo electrónico del usuario');
        } else {
          console.log('Estado del correo electrónico del usuario actualizado correctamente');
          const htmlResponse = `
          <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación de correo electrónico</title>
     <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
  />
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #1d2027;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            text-align: center;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #4CAF50;
            margin-bottom: 10px;
        }
        p {
            color: #333;
            margin-bottom: 20px;
        }
        img {
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    </style>
</head>
<body>
    <div class="container animate__animated animate__rubberBand">
        <h1>¡Correo electrónico verificado!</h1>
        <p>La verificación de correo electrónico se completó correctamente.</p>
        <img src="https://cdn-icons-png.flaticon.com/512/7184/7184066.png" alt="Verificado" width="100" height="100">
    </div>
</body>
</html>
            `;
            
            res.send(htmlResponse);
        }
      });
  } catch (error) {
      console.error('Error al verificar el token:', error);
      res.status(400).send('Token de verificación inválido o expirado');
  }
});

// const accessToken = 'APP_USR-6676272883606931-030303-f63bc9cd7ddd140d4497371a37bd2576-1708323573';

// app.post('/api/transfer', async (req, res) => {
//   const { external_reference, payer_email, amount, description } = req.body;

//   try {
//     const response = await axios.post(
//       'https://api.mercadopago.com/v1/funds',
//       {
//         external_reference,
//         payer: {
//           email: payer_email,
//         },
//         amount,
//         description,
//         transfer: {
//           destination: {
//             account_number: '5120694470616271',
//             bank_code: '1',
//             bank_name: 'Santander',
//           },
//         },
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     );

//     res.status(200).json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: error.toString() });
//   }
// });

app.post('/create-payment-intent', async (req, res) => {
  const customer = await stripe.customers.create();
  console.log('estos son datos de costumer',customer);
  const ephemeralKey = await stripe.ephemeralKeys.create(
    
    {customer: customer.id},
    {apiVersion: '2023-10-16'}
  );
  try {
    const {amount} = req.body; 
    console.log('aqui recibo amount',amount);
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'MXN',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.json({
    clientSecret: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'pk_test_51OqKITGl1997KuzQtjbApKQq3BHUmppquCKHHux8h4ab0r1KO30X21OgHDkhGW62pEdwzQj81z2z8F44i8yJ2upb003Zv3aMWw'
  });
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message,
      },
    });
  }
});

app.post('/transfer', async (req, res) => {
  const { from_account, to_account, amount, currency } = req.body;

  try {
    const authString = `${process.env.BITSO_API_KEY}:`;
    const authBuffer = Buffer.from(authString, 'utf8');
    const authBase64 = authBuffer.toString('base64');

    // Get the user's accounts
    const accountsResponse = await axios.get(
      'https://api.bitso.com/v3/accounts',
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authBase64}`,
        },
      }
    );

    const accounts = accountsResponse.data.data;

    // Find the from_account and to_account in the list of accounts
    const fromAccount = accounts.find(
      (account) => account.id === from_account
    );
    const toAccount = accounts.find((account) => account.id === to_account);

    // Make sure the accounts belong to the user
    if (!fromAccount || !toAccount) {
      return res.status(400).json({ message: 'Invalid account' });
    }

    // Initiate the transfer
    const transferResponse = await axios.post(
      'https://api.bitso.com/v3/btc_withdrawals',
      {
        currency,
        amount,
        address: toAccount.address,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authBase64}`,
        },
      }
    );

    const transferId = transferResponse.data.data.id;

    res.status(200).json({ message: 'Transfer initiated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Transfer failed' });
  }
});
const { Client, resources, Webhook } = require("coinbase-commerce-node");
const {
  COINBASE_API_KEY,
  COINBASE_WEBHOOK_SECRET,
  DOMAIN,
} = require("./config");

const { Charge } = resources;
Client.init(COINBASE_API_KEY);
app.get("/create-charge", async (req, res) => { 
  
  const chargeData = {
    
    name: "Sound Effect",
    description: "An awesome science fiction sound effect",
    local_price: {
      amount: 0.2,
      currency: "USD",
    },
    pricing_type: "fixed_price",
    metadata: {
      customer_id: "id_1005",
      customer_name: "Satoshi Nakamoto",
    },
    redirect_url: `${DOMAIN}/success-payment`,
    cancel_url: `${DOMAIN}/cancel-payment`,
  };
  console.log(COINBASE_API_KEY,
    COINBASE_WEBHOOK_SECRET,
    DOMAIN);
    console.log('datos cargados',chargeData);
  const charge = await Charge.create(chargeData);

  console.log(charge);

  res.send(charge);
});

app.post("/payment-handler", (req, res) => {
  const rawBody = req.rawBody;
  const signature = req.headers["x-cc-webhook-signature"];
  const webhookSecret = COINBASE_WEBHOOK_SECRET;

  let event;

  try {
    event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);
    // console.log(event);

    if (event.type === "charge:pending") {
      // received order
      // user paid, but transaction not confirm on blockchain yet
      console.log("pending payment");
    }

    if (event.type === "charge:confirmed") {
      // fulfill order
      // charge confirmed
      console.log("charge confirme");
    }

    if (event.type === "charge:failed") {
      // cancel order
      // charge failed or expired
      console.log("charge failed");
    }

    res.send(`success ${event.id}`);
  } catch (error) {
    console.log(error);
    res.status(400).send("failure");
  }
});

app.get("/success-payment", (req, res) => {
  res.send("success payment");
});

app.post('/create-payment-intent2', async (req, res) => {
  try {
    const {currency,type,payment_method} = req.body;
    console.log('Datos recibidos del cliente:', req.body);
    console.log('Datos recibidos del card:', type); // Agrega este registro para imprimir los datos recibidos
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 7777, // Monto a cobrar en centavos
      currency: currency, // Moneda
      type: 'card',
      payment_method: payment_method,
    });
    console.log('datos despues del create:',paymentIntent);
    const clientSecret = paymentIntent.client_secret;
    res.json({ clientSecret,payment_method });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { amount, id_usuario, porcentaje, afiliado } = req.body;
    console.log('Datos recibidos del cliente:', req.body);
    const unit_amount = amount + "00";
    
    // Crear sesión de pago
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            product_data: {
              name: "Inversion Fintech",
            },
            currency: "mxn",
            unit_amount: unit_amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://iseconsultoria.com.mx/",
    });
    console.log('Datos después del create:', session.url);
    console.log('Datos :', afiliado);
    // Ejecutar consulta de actualización en la base de datos
    const query = `UPDATE usuarios SET porcentaje=?, porcentaje_afiliado=? WHERE id=?`;
    connection.query(query, [porcentaje, afiliado, id_usuario], (error, results) => {
      if (error) {
        console.error("Error al actualizar datos del usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
      }
      console.log("Datos del usuario actualizados correctamente:", results);
      res.status(200).json({ url: session.url, message: "Datos del usuario actualizados correctamente" });
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const endpointSecret = "whsec_a3f2b80a59ed33450f0d762e87886bfd3e0481fbdfd7ae3bc18500ee18a0309c";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  console.log(`Unhandled event type ${event.type}`);
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break;
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      break;
    case 'checkout.session.expired':
      const checkoutSessionExpired = event.data.object;
      // Then define and call a function to handle the event checkout.session.expired
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

// Escuchar en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor backend escuchando en el puerto 3000');
});

app.get('/', (req, res) => {
  res.send('¡Bienvenido a la aplicación de registro!');
});

app.get('/registro', (req, res) => {
  res.send('¡Bienvenido registro!');
});

app.get('/upload', (req, res) => {
  res.send('¡Bienvenido upload!');
});

app.get('/update-balance', (req, res) => {
  res.send('¡Bienvenido upload!');
});
app.get('/documentos', (req, res) => {
  res.send('¡Bienvenido documentos!');
});