import express from 'express'

declare global {
  namespace Express {
    interface Request {
      verifiedUser?: Record<string, any>
    }
  }
}
