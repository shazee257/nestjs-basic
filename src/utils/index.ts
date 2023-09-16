import * as bcrypt from 'bcrypt';

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

export const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

// pagination with mongoose paginate library
export const getAggregatedPaginatedResult = async ({
  model,
  page = 1,
  limit = 10,
  query = [],
  populate = '',
  select = '-password',
  sort = { createdAt: -1 },
}: any): Promise<any> => {
  const options = {
    select,
    sort,
    populate,
    lean: true,
    page,
    limit,
    customLabels: {
      totalDocs: 'totalItems',
      docs: 'result',
      limit: 'perPage',
      page: 'currentPage',
      meta: 'pagination',
    },
  };

  const myAggregate = model.aggregate(query);
  const { result, pagination } = await model.aggregatePaginate(
    myAggregate,
    options,
  );

  // delete password keys if present in result or nested objects
  if (result) {
    for (const key in result) {
      if (result[key].password) {
        delete result[key].password;
        delete result[key].deviceToken;
      }
    }
  }

  return { result, pagination };
};
