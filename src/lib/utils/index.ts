import { GraphQLResolveInfo, FieldNode } from 'graphql';
import { BaseModel } from '../../database';

export const selectExactFields = <T>(selectFields: (keyof T)[], data: T): T => {
  return selectFields.reduce((acc, key): T => {
    acc[key] = data[key] as never;
    return acc;
  }, {} as T);
};

export const addDates = <T extends BaseModel>(data: T, updateOnly = false): T => {
  data.updatedAt = new Date();
  if (!updateOnly) data.createdAt = data.updatedAt;
  return data;
};

export const getSelectedFields = <T>(graphQLInfo: GraphQLResolveInfo): (keyof T)[] => {
  return (graphQLInfo?.fieldNodes[0]?.selectionSet?.selections?.map(
    (field) => (field as FieldNode).name.value
  ) || []) as (keyof T)[];
};
