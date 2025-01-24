

[CmdletBinding()]
param (
    [ValidateSet("all-containers", "nest-admin")]
    $Mode
)
    

switch ($Mode) {

    'all-infra-containers' {
        docker-compose --env-file compose.env -f compose.infra.yml up -d
    }

    'nest-admin' {
        docker-compose --env-file compose.env -f compose.nest-admin.yml up -d
    }
     


}
