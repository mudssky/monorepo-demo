FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# prisma 需要openssl
RUN apt-get update -y && apt-get install -y openssl
# nestjs需要ps命令
RUN apt-get install -y procps


FROM base AS deps-intall
COPY . /app
WORKDIR /app
# npm国内镜像加速
# RUN npm config set registry https://registry.npmmirror.com/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile


FROM deps-intall AS build
RUN  pnpm --filter server build

RUN cp /app/apps/server/.env /build/server/.env
# 因为还要执行prisma命令，所以不适合单独打包部署
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --no-cache --filter=server  /build/server
RUN cp -r /app/apps/server/dist /build/server/dist

# nestadmin
FROM build AS nest-admin-prod
# docker build . --target nest-admin --tag nest-admin:latest
# shell交互式调试镜像
# docker run -p 33201:33201 -it  nest-admin bash
COPY --from=build /build/server /build/server
WORKDIR /build/server
EXPOSE 33201
# 暴露写入数据的两个地方
VOLUME [ "/build/server/log","/build/server/static" ]

# CMD是启动命令，但是可以灵活修改
# docker run -p 33201:33201 nest-admin echo 'hello'
# 也可以换成ENTRYPOINT，这样必定会执行。
CMD [ "pnpm","start:deploy" ]

# nestadmin
FROM deps-intall AS nest-admin-dev
WORKDIR /app/apps/server/
EXPOSE 33101
# 暴露写入数据的两个地方
VOLUME [ "/build/server/log","/build/server/static" ]
ENV DATABASE_URL="postgresql://postgres:123456@host.docker.internal:5432/nestAdmin?schema=public"

CMD [ "pnpm","dev" ]