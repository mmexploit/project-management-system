export enum Operators {
  eq = '=', // equals
  gt = '>', // greater than
  gte = '>=', // greater than or equal
  lt = '<', // less than
  lte = '<=', // less than or equal
  neq = '<>', // not equal, alternative '!='
  like = 'LIKE', // SQL LIKE operator, use '%' for wildcards
  ilike = 'ILIKE', // case-insensitive LIKE
  match = '~', // pattern matching, PostgreSQL specific
  imatch = '~*', // case-insensitive pattern matching, PostgreSQL specific
  in = 'IN', // in a list of values
  is = 'IS', // checking for exact equality (null, true, false)
  isdistinct = 'IS DISTINCT FROM', // not equal, treating NULL as a comparable value
  fts = '@@', // Full-Text Search using to_tsquery
  cs = '@>', // contains, for array or range types
  cd = '<@', // contained in, for array or range types
  ov = '&&', // overlap, for range types
  sl = '<<', // strictly left of, for range types
  sr = '>>', // strictly right of, for range types
  nxr = '&<', // does not extend to the right of, for range types
  nxl = '&>', // does not extend to the left of, for range types
  bn = 'BETWEEN', // does not extend to the left of, for range types
  isnotnull = "IS NOT NULL",
  isnull = "IS NULL"
}
