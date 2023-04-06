import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { userId: number; deviceId: string };
}

export default RequestWithUser;
