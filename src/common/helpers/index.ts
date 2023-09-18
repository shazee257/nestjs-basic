import * as bcrypt from 'bcrypt';
import { PaginationResult } from '../interfaces';

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

export const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash);
};

// pagination with mongoose paginate library
export const getAggregatedPaginatedResult = async <T>({
  model,
  page = 1,
  limit = 10,
  query = [],
  populate = '',
  select = '-password',
  sort = { createdAt: -1 },
}: {
  model: any;
  page?: number;
  limit?: number;
  query?: any[]; // Adjust the type as needed
  populate?: string;
  select?: string;
  sort?: Record<string, number>;
}): Promise<PaginationResult<T>> => {
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

export const generateFilename = (req, file, cb) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, uniqueSuffix + '.' + file.originalname.split('.').pop());
};

export const filterImage = (req, file, cb) => {
  // check mime type
  if (
    !file.mimetype.match(
      /image\/(jpg|JPG|webp|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF)/,
    )
  ) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(null, false);
  }
  cb(null, true);
};
