import { User } from '@prisma/client'

type UserDtoType = Omit<User, 'password' | 'status'> & {
  avatarFullUrl: srting | null
}

type UpdateUserDtoType = Pick<User, 'id' | 'name' | 'avatarUrl'>
