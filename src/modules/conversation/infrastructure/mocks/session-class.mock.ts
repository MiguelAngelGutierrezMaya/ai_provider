import { SessionChat } from '../../models/entities/chat.entity';

export const sessionChat: { [key: string]: any } = {
  _id: 'id',
  messages: [],
  payload: {},
  created_at: new Date(),
  updated_at: new Date(),
};

export class SessionChatMongoMock {
  constructor(private _: SessionChat) {}

  static findOne = ({
    provider,
    session,
  }: {
    provider: string;
    session: string;
  }) => ({
    exec: () => ({
      provider,
      session,
      ...sessionChat,
    }),
  });

  static findOneAndUpdate = (data: { [key: string]: any }) => ({
    exec: () => ({
      ...data.filter,
      ...sessionChat,
    }),
  });

  public save = () => sessionChat;
}
