-- CreateEnum
CREATE TYPE "ChatRoomType" AS ENUM ('GROUP', 'SINGLE');

-- CreateTable
CREATE TABLE "Chatroom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ChatRoomType" NOT NULL DEFAULT 'SINGLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chatroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChatroom" (
    "userId" TEXT NOT NULL,
    "chatroomId" TEXT NOT NULL,

    CONSTRAINT "UserChatroom_pkey" PRIMARY KEY ("userId","chatroomId")
);
