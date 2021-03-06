import { Router } from 'express'

import { TEmeraltHandlerParams } from '@/types'
import { endpoints } from '@/constants'
import { useIf } from '@/utils'

export const loginHandler = ({ config }: TEmeraltHandlerParams) =>
  useIf(
    config.endpoints.login,
    Router().post(endpoints.login, (req, res) => {
      res.status(401).json({
        error: '',
      })
    }),
  )
