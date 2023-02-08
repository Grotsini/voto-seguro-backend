const express = require('express')
const cors = require('cors')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const figlet = require('figlet')
const asciify = require('asciify-image')
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '10mb' }))

const credentials = {
	host: 'bfassz2oczlfulvixj8l-mysql.services.clever-cloud.com',
	user: 'usbnwxo7p3hke6y8',
	password: 'QWhSIgTTcYfpswxIhp0m',
	database: 'bfassz2oczlfulvixj8l'
}

app.get('/', (req, res) => {
	res.send('Hola Luis, soy el servidor!')
	console.log(res.send('Hola Luis, soy el servidor!'))
})

app.post('/api/login', (req, res) => {
	const { username, password } = req.body
	const values = [username, password]
	var connection = mysql.createConnection(credentials)
	console.log(req.body)
	console.log(connection)
	connection.query("SELECT * FROM USUARIO WHERE username = ? AND password = ?", values, (err, result) => {
		if (err) {
			res.status(500).send(err)
			console.log(res.status(500).send(err))
			console.log("------------------------")
			console.log(result)
		} else {
			if (result.length > 0) {
				res.status(200).send({
					"id": result[0].ID_USUARIO,
					"username": result[0].username,
					"nombre": result[0].NOMBRE,
					"flag_suscrito": result[0].FLAG_SUSCRITO,
					"isAuth": true
				})
			} else {
				res.status(400).send('Usuario no existe')
			}
		}
	})
	connection.end()
})

app.get('/api/candidatos', (req, res) => {
	var connection = mysql.createConnection(credentials)
	connection.query('SELECT * FROM CANDIDATO', (err, rows) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send(rows)
		}
	})
	connection.end()
})

app.post('/api/eliminar', (req, res) => {
	const { id } = req.body
	var connection = mysql.createConnection(credentials)
	connection.query('DELETE FROM usuarios WHERE id = ?', id, (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send({ "status": "success", "message": "Usuario Eliminado" })
		}
	})
	connection.end()
})

app.post('/api/guardar', (req, res) => {
	const { avatar, nombre, planeta } = req.body
	const params = [[avatar, nombre, planeta]]
	var connection = mysql.createConnection(credentials)
	connection.query('INSERT INTO usuarios (avatar, nombre, planeta) VALUES ?', [params], (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send({ "status": "success", "message": "Usuario creado" })
		}
	})
	connection.end()
})

app.post('/api/quiz', (req, res) => {
	const { espectro_politico, sexo, flg_pregrado, flg_posgrado, flg_cargo_publico, flg_ciudad } = req.body
	const params = [[espectro_politico, sexo, flg_pregrado, flg_posgrado, flg_cargo_publico, flg_ciudad]]
	var connection = mysql.createConnection(credentials)
	//res.status(200).send(req.body)
	select = "SELECT DISTINCT A.DNI, A.IMAGEN, A.NOMBRE, A.PARTIDO_POLITICO FROM CANDIDATO A LEFT JOIN PRIMARIA_SECUNDARIA E ON A.DNI=E.DNI LEFT JOIN (SELECT DNI, CARRERA_1, CENTRO_1, CONCLUIDO_1 FROM ESTUDIOS_UNIVERSITARIOS UNION SELECT DNI, CARRERA_2, CENTRO_2, CONCLUIDO_2 FROM ESTUDIOS_UNIVERSITARIOS UNION SELECT DNI, CARRERA_3, CENTRO_3, CONCLUIDO_3 FROM ESTUDIOS_UNIVERSITARIOS) B ON A.DNI=B.DNI LEFT JOIN ESTUDIOS_TECNICOS C ON A.DNI=C.DNI LEFT JOIN ESTUDIOS_POSGRADO D ON A.DNI=D.DNI LEFT JOIN EXPERIENCIA_LABORAL F ON A.DNI=F.DNI "
	connection.query(select + "WHERE ESPECTRO_POLITICO = ? AND (CASE WHEN A.SEXO = 'MASCULINO' THEN 'HOMBRE' ELSE 'MUJER' END) = ? AND (CASE WHEN B.CARRERA_1 IS NOT NULL THEN 'SI' ELSE 'NO' END) = ? AND (CASE WHEN D.ESPECIALIZACION_1 IS NOT NULL THEN 'SI' ELSE 'NO' END) = ? AND (CASE WHEN F.CENTRO_TRABAJO IN ('PCM', 'CONGRESO DE LA REPUBLICA', 'DESPACHO PRESIDENCIAL DE LA REPUBLICA','CENTRO PERUANO DE ESTUDIOS SOCIALES','MUNICIPALIDAD DE LA VICTORIA','MUNICIPALIDAD DISTRITAL DE LA VICTORIA','MUNICIPALIDAD DE LOS OLIVOS','GOBIERNO REGIONAL CALLAO (VER IX. INFORMACION ADICIONAL') THEN 'SI' ELSE 'NO' END) = ? AND (CASE WHEN A.DEPARTAMENTO_NACIMIENTO != 'LIMA' THEN 'PROVINCIA' ELSE A.DEPARTAMENTO_NACIMIENTO END) = ?", [espectro_politico, sexo, flg_pregrado, flg_posgrado, flg_cargo_publico, flg_ciudad], (err, rows) => {
		//res.status(200).send(req.body)
		if (err) {
			res.status(500).send(err)
			//res.status(200).send(req.body)
		} else {
			//res.status(200).send(req.body)
			//res.status(200).send(params)
			res.status(200).send(rows)
		}
	})
	connection.end()
})


app.post('/api/editar', (req, res) => {
	const { id, avatar, nombre, planeta } = req.body
	const params = [avatar, nombre, planeta, id]
	var connection = mysql.createConnection(credentials)
	connection.query('UPDATE usuarios set avatar = ?, nombre = ?, planeta = ? WHERE id = ?', params, (err, result) => {
		if (err) {
			res.status(500).send(err)
		} else {
			res.status(200).send({ "status": "success", "message": "USuario editado" })
		}
	})
	connection.end()
})

app.listen(4000, async () => {
	const ascified = await asciify('helmet.png', { fit: 'box', width: 10, height: 10 })
	console.log(ascified)
	console.log(figlet.textSync('Samus Server v. 1.0.0'))
})
//app.listen(4000, () => console.log('hola soy el servidor'))