export class TimestampModel {
  createdAt: Date;
  updatedAt: Date;
}

export class BaseModel extends TimestampModel {
  id: string;
}
