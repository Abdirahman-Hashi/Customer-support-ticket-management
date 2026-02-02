import type { Request, Response, NextFunction } from "express";
import type { ZodTypeAny } from "zod";

type Schemas = {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
};

export function validate(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      if (schemas.params) {
        const parsedParams = schemas.params.parse(req.params) as any;
        Object.assign(req.params as any, parsedParams);
      }
      if (schemas.query) {
        const parsedQuery = schemas.query.parse(req.query) as any;
        Object.assign(req.query as any, parsedQuery);
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
