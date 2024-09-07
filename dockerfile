FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# prisma 需要openssl
RUN apt-get update -y && apt-get install -y openssl
# nestjs需要ps命令
RUN apt-get install -y procps


FROM base AS install-stage
COPY . /app
WORKDIR /app
# npm国内镜像加速
# RUN npm config set registry https://registry.npmmirror.com/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile


FROM install-stage AS build
RUN  pnpm --filter server build
RUN mkdir -p /build/server && cp -r /app/apps/server/dist /build/server/

FROM build AS backend-pruned
# pnpm deploy，会把node_modules装好（包括workspace:*的依赖），其他文件也复制过去
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --no-cache --filter=server  /build/backend-pruned
WORKDIR /build/backend-pruned
RUN npx prisma generate
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
EXPOSE 33101
# 暴露写入数据的两个地方
VOLUME [ "/build/server/log","/build/server/static" ]
ENV DATABASE_URL="postgresql://postgres:123456@host.docker.internal:5432/nestAdmin?schema=public"
ENV NODE_ENV=production
# CMD是启动命令，但是可以灵活修改
# docker run -p 33201:33201 nest-admin echo 'hello'
# 也可以换成ENTRYPOINT，这样必定会执行。
CMD [ "node","dist/main.js" ]

# nestadmin
FROM install-stage AS nest-admin-dev
WORKDIR /app/apps/server/
EXPOSE 33101
# 暴露写入数据的两个地方
VOLUME [ "/build/server/log","/build/server/static" ]
ENV DATABASE_URL="postgresql://postgres:123456@host.docker.internal:5432/nestAdmin?schema=public"

CMD [ "pnpm","dev" ]