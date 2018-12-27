import { Person } from './person'
import { TVersion } from './version'

export type TPackage = {
  name: string
  author: Person

  main: string

  // all versions
  versions: {
    // "0.0.1": {}
    [version: string]: TVersion
  }

  // time when each version was uploaded
  time: {
    // "0.0.1": new Date().toString()
    [version: string]: string
  }

  // dist tags
  'dist-tags': {
    // "latest": "0.0.14"
    [tag: string]: string
  }
}