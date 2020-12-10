
import { NextApiRequest, NextApiResponse } from 'next'

export default function initMiddleware(fn: Function) {
    return (req: NextApiRequest, res: NextApiResponse) => new Promise((resolve, reject) => {
      fn(req, res, (result: Object) => {
        if (result instanceof Error) {
          return reject(result)
        }
  
        return resolve(result)
      })
    })
}