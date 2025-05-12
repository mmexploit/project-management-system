import { Query, Sort, Where } from "./model/query.model";

export function encodeToQueryParams(query: Query) {
  const queryParam = new URLSearchParams();

  if ("skip" in query) {
    queryParam.append("skip", query?.skip?.toString() ?? "0");
  }

  if ("take" in query) {
    queryParam.append("take", query?.take?.toString() ?? "10");
  }

  if (query?.where) {
    queryParam.append("w", encodeWhere(query.where));
  }

  if (query?.includes) {
    queryParam.append("includes", encodeIncludes(query.includes));
  }

  if (query.sort) {
    queryParam.append("sort", encodeSort(query.sort));
  } else if (!query.sort) {
    queryParam.append(
      "sort",
      encodeSort([{ field: "createdAt", direction: "DESC" }])
    );
  }

  return encodeURIComponent(queryParam.toString());
}

function encodeIncludes(query: string[] | undefined): string {
  return query?.join(",") ?? "";
}

function encodeSort(sort: Sort[]) {
  return sort
    .map(
      (sortObj) => `${encodeURIComponent(sortObj.field)}$${sortObj.direction}`
    )
    .join(",");
}

function encodeWhere(query: Where[][]): string {
  const encodedGroups = query.map((group) => {
    const orConditions = group.map(
      (orCondition) =>
        `${encodeURIComponent(orCondition.field)}$${encodeURIComponent(orCondition.operator)}$${orCondition.value}`
    );

    return `${orConditions.join("|")}`;
  });

  return `${encodedGroups.join(";")}`;
}
