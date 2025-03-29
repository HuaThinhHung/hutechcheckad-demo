import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer as createLahmServer } from 'lahm'

import accountsRoutes from './routes/accounts.js'
import authRoutes from './routes/auth.js'
import checkinRoutes from './routes/checkin.js'
import dashboardAuthRoutes from './routes/dashboard-auth.js'
import dashboardCertsRoutes from './routes/dashboard-certs.js'
import dashboardConfigRoutes from './routes/dashboard-config.js'
import dashboardEventsRoutes from './routes/dashboard-events.js'
import dashboardLabelsRoutes from './routes/dashboard-labels.js'
import dashboardStudentsRoutes from './routes/dashboard-students.js'
import dashboardTemplatesRoutes from './routes/dashboard-templates.js'
import eventRoutes from './routes/event.js'
import hostsRoutes from './routes/hosts.js'

async function createServer() {
  const app = express()

  dotenv.config()

  app.use(express.json())
  app.use(cors())

  const lahm = await createLahmServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })
  app.use(lahm.middlewares)

  app.use('/v1/dashboard-auth', dashboardAuthRoutes)
  app.use('/v1/accounts', accountsRoutes)
  app.use('/v1/hosts', hostsRoutes)
  app.use('/v1/dashboard-config', dashboardConfigRoutes)
  app.use('/v1/dashboard-labels', dashboardLabelsRoutes)
  app.use('/v1/dashboard-templates', dashboardTemplatesRoutes)
  app.use('/v1/dashboard-events', dashboardEventsRoutes)
  app.use('/v1/dashboard-students', dashboardStudentsRoutes)
  app.use('/v1/dashboard-certs', dashboardCertsRoutes)
  app.use('/v1/auth', authRoutes)
  app.use('/v1/checkin', checkinRoutes)
  app.use('/v1/event', eventRoutes)
  app.use('*', async (req, res) => {
    res.send('Hello world!')
  })

  app.listen(5174, () =>
    console.log(
      `Server running on port: http://localhost:5174 (Press 'Ctrl + C' to stop the server)`
    )
  )
}

createServer()
