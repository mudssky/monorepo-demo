
[CmdletBinding()]
param (
    [ValidateSet("prisma-doc", "minio-container", "redis-container", 'postgre-container')]
    $Mode
)
    




switch ($Mode) {
    'prisma-doc' {
        Start-Job -ScriptBlock {
            Start-Process 'http://localhost:20300'
        }
        caddy file-server --root ./prisma/docs/ --listen :20300
    }
    'minio-container' {
        docker run -d --name minio-dev -p 9000:9000 -p 9001:9001 -v c:/usr/docker/minio:/bitnami/minio/data -e MINIO_ROOT_USER=root -e MINIO_ROOT_PASSWORD=12345678 bitnami/minio
    }
     
    'redis-container' {
        docker run -d --name redis-dev -p 6379:6379 redis
    }
    'postgre-container' {
      
        docker run --name postgre-dev -d -p 5432:5432 `
            -e POSTGRES_PASSWORD=123456 `
            -e TZ=Asia/Shanghai `
            -v C:/docker_data/postgresql/data:/var/lib/postgresql/data postgres

        # 创建nestAdmin表
        # docker exec -it postgre-dev ` psql -U postgres `
        #     -c "CREATE DATABASE nestAdmin"
        
    }


}

