import { RequestHandler } from 'express'

export interface IRouteFactory<TService> {
  factory (service: TService): RequestHandler
}

export interface IRouteMap<TService> {
  [key: string]: IRouteFactory<TService>
}
