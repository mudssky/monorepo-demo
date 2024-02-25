FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
# prisma 需要openssl
RUN apt-get update -y && apt-get install -y openssl

FROM base AS build
COPY . /app
WORKDIR /app
# npm国内镜像加速
# RUN npm config set registry https://registry.npmmirror.com/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN  pnpm --filter server build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm deploy --no-cache --filter=server  /prod/server
RUN cp -r /app/apps/server/dist /prod/server/dist

# nestadmin
FROM base AS nest-admin
# docker build . --target nest-admin --tag nest-admin:latest
# shell交互式调试镜像
# docker run -p 33201:33201 -it  nest-admin bash
COPY --from=build /prod/server /prod/server
WORKDIR /prod/server
EXPOSE 33201
# 暴露写入数据的两个地方
VOLUME [ "/prod/server/log","/prod/server/static" ]

# CMD是启动命令，但是可以灵活修改
# docker run -p 33201:33201 nest-admin echo 'hello'
# 也可以换成ENTRYPOINT，这样必定会执行。
CMD [ "pnpm","start:deploy" ]
