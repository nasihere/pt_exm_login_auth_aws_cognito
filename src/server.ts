import App from './app'

import * as bodyParser from 'body-parser'

import AuthController from './controllers/auth.controller'
import AuthMiddleware from './middleware/auth.middleware'

const app = new App({
    port: 5000,
    controllers: [
        new AuthController()
    ],
    middleWares: [
      // parse application/json
      // parse application/x-www-form-urlencoded
        new AuthMiddleware().verifyToken,
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true }),
    ]
})

app.listen()