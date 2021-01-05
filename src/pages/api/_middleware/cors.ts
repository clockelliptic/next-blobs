import Cors from 'cors'
import initMiddleware from './initMiddleware'

const whitelist = ['http://localhost']

const validateOrigin = (origin: string, cb: Function) => {
  if (whitelist.indexOf(origin) !== -1) {
    cb(null, true)
  } else {
    cb(new Error('Not allowed by CORS'))
  }
}

export default initMiddleware(
  Cors({
    origin: validateOrigin,
    methods: ['GET', 'POST'],
  })
)