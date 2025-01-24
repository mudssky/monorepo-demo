FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


# alpine镜像能成功构建，所以不需要这个阶段了。
# FROM base as prisma-base
# RUN apt-get update -y 
# prisma 需要openssl
# RUN apt-get update -y && apt-get install -y openssl
# nestjs需要ps命令
# RUN apt-get install -y procps



FROM base AS install-stage
# COPY . /app
WORKDIR /app
COPY pnpm-lock.yaml ./
# pnpm fetch只需要lockfile 就能执行，这样基于docker的分层缓存，依赖（pnpm-lock.yaml）不变的时候就不会触发重新下载
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch
# npm国内镜像加速
# RUN npm config set registry https://registry.npmmirror.com/
# 复制monorepo其他内容
COPY . .
# fetch只是提前下载内容，install还是要执行一遍。
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM install-stage AS build
RUN  pnpm --filter server build
RUN mkdir -p /build/server && cp -r /app/apps/server/dist /build/server/


FROM build AS backend-pruned
# pnpm deploy，会把node_modules装好（包括workspace:*的依赖），其他文件也复制过去
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --no-cache --filter=server --prod  /build/backend-pruned
# WORKDIR /build/backend-pruned
# 之后我们可以拷贝backend-pruned里面的node_modules作为运行依赖


# nestadmin
FROM base AS nest-admin-prod
# docker build . --target nest-admin --tag nest-admin:latest
# shell交互式调试镜像
# docker run -p 33201:33201 -it  nest-admin bash
COPY --from=backend-pruned /build/server/dist /build/server/dist
COPY --from=backend-pruned /build/backend-pruned/node_modules /build/server/node_modules
COPY --from=backend-pruned /build/backend-pruned/prisma /build/server/prisma
COPY --from=backend-pruned /build/backend-pruned/.env.development /build/server/.env
WORKDIR /build/server
RUN npx prisma generate

# 暴露写入数据的两个地方
VOLUME [ "/build/server/log","/build/server/static" ]
ENV DATABASE_URL="postgresql://postgres:123456@host.docker.internal:5432/nestAdmin?schema=public"
ENV NODE_ENV=production
RUN npm install pm2 -g

EXPOSE 33101

ENV  REDIS_HOST='host.docker.internal'
ENV MINIO_ENDPOINT = 'host.docker.internal'
# CMD是启动命令，但是可以灵活修改
# docker run -p 33201:33201 nest-admin echo 'hello'
# 也可以换成ENTRYPOINT，这样必定会执行。
CMD [ "pm2-runtime","dist/main.js" ]

# nestadmin
FROM install-stage AS nest-admin-dev
WORKDIR /app/apps/server/
EXPOSE 33101
# 暴露写入数据的两个地方
VOLUME [ "/build/server/log","/build/server/static" ]
ENV DATABASE_URL="postgresql://postgres:123456@host.docker.internal:5432/nestAdmin?schema=public"
CMD [ "pnpm","dev" ]