require("dotenv").config();

const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const session = require("express-session");

const app = express();

const PORT = 3000;


/* =====================================================
   CONFIGURACIÓN
===================================================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* =====================================================
   SESIONES
===================================================== */

app.use(session({
    secret: "kelly-nils-secreto",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true
    }
}));


/* =====================================================
   CONEXIÓN CON MYSQL
===================================================== */

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT)
});

db.connect((error) => {

    if (error) {

        console.log(
            "❌ Error conectando a MySQL:",
            error.message
        );

        return;
    }

    console.log(
        "✅ Conectado a MySQL correctamente"
    );

});


/* =====================================================
   VERIFICAR SESIÓN
===================================================== */

function verificarSesion(req, res, next) {

    if (!req.session.usuario) {

        return res.status(401).json({
            mensaje: "No autorizado"
        });

    }

    next();

}


/* =====================================================
   PROTEGER ADMIN.HTML
===================================================== */

app.get("/admin.html", (req, res) => {

    if (!req.session.usuario) {

        return res.redirect("/login.html");

    }

    res.sendFile(
        path.join(__dirname, "..", "admin.html")
    );

});


/* =====================================================
   GUARDAR CITA
===================================================== */

app.post("/api/citas", (req, res) => {

    const {
        nombre,
        telefono,
        servicio,
        fecha,
        hora
    } = req.body;


    const sql = `
        INSERT INTO citas
        (nombre, telefono, servicio, fecha, hora)
        VALUES (?, ?, ?, ?, ?)
    `;


    db.query(
        sql,
        [
            nombre,
            telefono,
            servicio,
            fecha,
            hora
        ],
        (error, resultado) => {

            if (error) {

                console.log(
                    "❌ Error guardando la cita:",
                    error.message
                );

                return res.status(500).json({
                    mensaje: "No se pudo guardar la cita"
                });

            }


            console.log(
                "✅ Cita guardada correctamente"
            );


            res.json({

                mensaje:
                    "Cita guardada correctamente",

                id:
                    resultado.insertId

            });

        }
    );

});


/* =====================================================
   OBTENER CITAS
===================================================== */

app.get(
    "/api/citas",
    verificarSesion,
    (req, res) => {

        const sql = `
            SELECT *
            FROM citas
            ORDER BY fecha ASC, hora ASC
        `;


        db.query(
            sql,
            (error, resultados) => {

                if (error) {

                    console.log(
                        "❌ Error obteniendo las citas:",
                        error.message
                    );

                    return res.status(500).json({

                        mensaje:
                            "No se pudieron obtener las citas"

                    });

                }


                res.json(resultados);

            }
        );

    }
);


/* =====================================================
   LOGIN
===================================================== */

app.post("/api/login", (req, res) => {

    const {
        usuario,
        password
    } = req.body;


   const usuarioCorrecto =
    process.env.ADMIN_USER;

const passwordCorrecta =
    process.env.ADMIN_PASSWORD;

    if (
        usuario === usuarioCorrecto &&
        password === passwordCorrecta
    ) {

        req.session.usuario =
            usuario;


        res.json({

            correcto: true

        });

    } else {

        res.json({

            correcto: false

        });

    }

});

/* LOGOUT */
app.post("/api/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({
                mensaje: "No se pudo cerrar sesión"
            });
        }

        res.json({
            correcto: true
        });
    });
});


/* =====================================================
   CONFIRMAR / CANCELAR CITA
===================================================== */

app.put(
    "/api/citas/:id",
    verificarSesion,
    (req, res) => {

        const {
            estado
        } = req.body;

        const {
            id
        } = req.params;


        const sql = `
            UPDATE citas
            SET estado = ?
            WHERE id = ?
        `;


        db.query(
            sql,
            [
                estado,
                id
            ],
            (error, resultado) => {

                if (error) {

                    console.log(
                        "❌ Error actualizando la cita:",
                        error.message
                    );

                    return res.status(500).json({

                        mensaje:
                            "No se pudo actualizar la cita"

                    });

                }


                res.json({

                    mensaje:
                        "Cita actualizada correctamente"

                });

            }
        );

    }
);


/* =====================================================
   ELIMINAR CITA
===================================================== */

app.delete(
    "/api/citas/:id",
    verificarSesion,
    (req, res) => {

        const {
            id
        } = req.params;


        const sql = `
            DELETE FROM citas
            WHERE id = ?
        `;


        db.query(
            sql,
            [id],
            (error, resultado) => {

                if (error) {

                    console.log(
                        "❌ Error eliminando la cita:",
                        error.message
                    );

                    return res.status(500).json({

                        mensaje:
                            "No se pudo eliminar la cita"

                    });

                }


                res.json({

                    mensaje:
                        "Cita eliminada correctamente"

                });

            }
        );

    }
);


/* =====================================================
   ARCHIVOS DE LA PÁGINA
===================================================== */

app.use(
    express.static(
        path.join(__dirname, "..")
    )
);


/* =====================================================
   INICIAR SERVIDOR
===================================================== */

app.listen(
    PORT,
    () => {

        console.log(
            `Servidor de Kelly Nils funcionando en http://localhost:${PORT}`
        );

    }
);