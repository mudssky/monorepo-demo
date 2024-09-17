
[CmdletBinding()]
param (
    [ValidateSet("prisma-doc", "minio-container")]
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
     
}

