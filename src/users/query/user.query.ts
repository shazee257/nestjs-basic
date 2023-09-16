import { Types } from 'mongoose';
import { ROLES } from 'src/common/constants';

export const fetchAllUsers = (userId: string, search: string) => {
  return [
    {
      $match: {
        $and: [
          { _id: { $ne: new Types.ObjectId(userId) } },
          { role: { $ne: ROLES.ADMIN } },
          // {
          //   $or: [
          // { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          //     ],
          //   },
        ],
      },
    },
  ];
};
