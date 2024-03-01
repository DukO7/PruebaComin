// Importar las dependencias
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
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

      // Insertar el nuevo usuario en la base de datos
      const insertQuery = 'INSERT INTO usuarios (nombre, telefono, correo_electronico, password, codigo_afiliado, numero_afiliado_referente) VALUES (?, ?, ?, ?, ?, ?)';
      connection.query(insertQuery, [nombre, telefono, correo_electronico, password, codigoAfiliado, numero_afiliado_referente], (err, results) => {
        if (err) {
          console.error('Error al insertar usuario:', err);
          res.status(500).json({ error: 'Error interno del servidor para insertar' });
          return;
        }

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
  const query = `SELECT * FROM usuarios WHERE correo_electronico = ? AND password = ?`;
  connection.query(query, [correo_electronico, password], (err, results) => {
    if (err) {
      console.error('Error al realizar la consulta:', err);
      res.status(500).json({ error: 'Error interno del servidor' });
      return;
    }
    if (results.length === 0) {
      // Si no se encuentra el usuario, devolver un error de credenciales inválidas
      res.status(401).json({ error: 'Credenciales inválidas' });
    } else {
      // Si las credenciales son válidas, iniciar sesión exitosamente y enviar los datos del usuario
      const usuario = results[0]; // Suponiendo que solo se espera un resultado
      console.log('Datos del usuario:', usuario); // Imprimir los datos del usuario en la consola del servidor
      const { foto_usuario, ...usuarioSinFoto } = usuario;
      const token = jwt.sign({ usuario: usuarioSinFoto }, 'clave_secreta', { expiresIn: '1h' });
      // Excluir el campo foto_usuario del objeto usuario
      
      console.log('Token generado:', token);
      res.status(200).json({ message: 'Inicio de sesión exitoso', usuario: usuarioSinFoto, token });
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
  const { usuarioId, codigoAfiliado } = req.body;

  console.log('usuarioId:', usuarioId);
  console.log('codigoAfiliado:', codigoAfiliado);

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

          // Crear un objeto para cada afiliado con su id y saldo
          const afiliado = {
            id: affiliate.id,
            nombre: affiliate.nombre,
            saldo: affiliate.saldo
          };

          // Agregar el objeto afiliado al array
          datosafiliados.push(afiliado);
        }

        // Calcular el 5% del saldo total de los afiliados
        const affiliateBonus = totalAffiliateBalance * 0.05;
        const updateQuery = `
          UPDATE cuentas_bancarias AS cb
          JOIN usuarios AS u ON cb.id_usuario = u.id
          SET cb.saldo_afiliados = u.saldo + ?
          WHERE u.id = ?
        `;

        connection.query(updateQuery, [affiliateBonus, usuarioId], (err, results) => {
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

              console.log('Resultados de la consulta SQL:', inversionesPorFecha);
              // Ahora tienes las inversiones organizadas por fecha en inversionesPorFecha

              // Devolver el saldo total de los afiliados, el bono, los datos de los afiliados, las inversiones y los datos de la cuenta bancaria como una respuesta al cliente
              res.status(200).json({ message: 'Saldo actualizado exitosamente', totalAffiliateBalance, affiliateBonus, datosafiliados, inversionesPorFecha, cuenta });
            });
          });
        });
      });
    } else {
      // Si no hay afiliados, devolver un objeto cuenta con nombre_cuenta predeterminado
      const cuenta = { nombre_cuenta: 'sin nombre' };
      const datosafiliados =[];
      const affiliateBonus=0;
      const inversionesPorFecha=[];
      res.status(200).json({ message: 'No hay afiliados', datosafiliados, cuenta, affiliateBonus,inversionesPorFecha });
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

app.post("/act-datosbanco", (req, res) => {
  const {
    titular_cuenta,numero_tarjeta,banco,nombre_cuenta,numero_cuenta,saldo_afiliados,usuarioId} = req.body;

  // Query para actualizar los datos en la base de datos
  const query = `UPDATE usuarios SET saldo =? WHERE id = ?`;

  // Ejecutar la consulta
  connection.query(query,[saldo_afiliados, usuarioId],
    (error, results) => {
      if (error) {
        console.error("Error al actualizar el saldo del usuario:", error);
        res.status(500).json({ error: "Error interno del servidor" });
        return;
      }
      console.log("Saldo del usuario actualizado correctamente:", results);

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
    }
  );
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