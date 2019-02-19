import { OptionalPromise } from '../helpers'
import { TEmeraltServerConfig } from './server'
import { CEmeraltDatabase } from './database'

export type TEmeraltAuthAction = 'publish' | 'get'

export interface CEmeraltAuth {
  putUser(username: string, password: string): OptionalPromise<any>

  hasUser(username: string): OptionalPromise<boolean>

  comparePassword(username: string, password: string): OptionalPromise<boolean>

  canUser(
    username: string,
    action: TEmeraltAuthAction,
    packagename: string,
  ): OptionalPromise<boolean>

  /** drop all data (used for test purposes) */
  dropData(): OptionalPromise<any>
}
export interface IEmeraltAuth<C = {}> {
  (pluginConfig: C): (
    serverConfig: TEmeraltServerConfig,
    database: CEmeraltDatabase,
  ) => OptionalPromise<CEmeraltAuth>
}
