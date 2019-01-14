import express from 'express'
import http from 'http'

import { TEmeraltServerParams } from '@emeralt/types'
import { createServices } from '@/services'
import { createMiddlewares } from '@/middlewares'
import { createHandlers } from '@/handlers'
import { TEmeraltServerParamsInternal } from '@emeralt/types/src/emeralt'

type EmeraltServer = http.Server & {
  emeralt: TEmeraltServerParamsInternal
}

const initializeInternal = async (
  params: TEmeraltServerParams,
): Promise<TEmeraltServerParamsInternal> => {
  const database = await params.database(params.config)
  const auth = await params.auth(params.config, database)
  const storage = await params.storage(params.config, database)

  return {
    ...params,
    database,
    auth,
    storage,
  }
}

export const createEmeraltServer = async (params: TEmeraltServerParams) => {
  // initialize plugins
  const internal = await initializeInternal(params)

  const services = createServices(internal)
  const middlewares = createMiddlewares({ ...internal, services })
  const handlers = createHandlers({ ...internal, services, middlewares })

  const server = express()
    // options
    .set('etag', false)

    // middlewares
    .use(middlewares.logger)
    .use(middlewares.json)
    .use(middlewares.compression)
    .use(middlewares.context)

    // handlers
    .use(handlers.ping)
    .use(handlers.login)
    .use(handlers.adduser)
    .use(handlers.search)
    .use(handlers.packages)

  const httpServer = http.createServer(server) as EmeraltServer

  httpServer.emeralt = internal

  return httpServer
}
