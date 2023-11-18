import { Systeminformation } from 'systeminformation'

export class StaticDataDto implements Systeminformation.StaticData {
  version: string
  system: Systeminformation.SystemData
  bios: Systeminformation.BiosData
  baseboard: Systeminformation.BaseboardData
  chassis: Systeminformation.ChassisData
  os: Systeminformation.OsData
  uuid: Systeminformation.UuidData
  versions: Systeminformation.VersionData
  cpu: Systeminformation.CpuData
  graphics: Systeminformation.GraphicsData
  net: Systeminformation.NetworkInterfacesData[]
  memLayout: Systeminformation.MemLayoutData[]
  diskLayout: Systeminformation.DiskLayoutData[]
}
