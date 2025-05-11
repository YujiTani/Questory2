-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "corbado_user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "correct_answer" TEXT[],
    "alternative_answers" TEXT[],
    "explanation" TEXT NOT NULL,
    "type" SMALLINT NOT NULL,
    "state" SMALLINT NOT NULL,
    "category" SMALLINT NOT NULL,
    "created_at" BIGINT NOT NULL,
    "deleted_at" BIGINT,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_uuid_key" ON "Question"("uuid");

-- CreateIndex
CREATE INDEX "Question_deleted_at_idx" ON "Question"("deleted_at");

-- CreateIndex
CREATE INDEX "Question_deleted_at_category_idx" ON "Question"("deleted_at", "category");

-- CreateIndex
CREATE INDEX "Question_deleted_at_state_idx" ON "Question"("deleted_at", "state");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
