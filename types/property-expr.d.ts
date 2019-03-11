export class Cache {
  constructor(maxSize: any)
  clear(): void
  get(key: any): any
  set(key: any, value: any): any
}
export function expr(expression: any, safe: any, param: any): any
export function forEach(path: any, cb: any, thisArg: any): void
export function getter(path: any, safe: any): any
export function join(segments: any): any
export function normalizePath(path: any): any
export function setter(path: any): any
export function split(path: string): string[]
