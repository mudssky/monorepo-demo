import { ApiProperty } from '@nestjs/swagger'
import { Systeminformation } from 'systeminformation'

export class SystemDataDto implements Systeminformation.SystemData {
  manufacturer: string
  model: string
  version: string
  serial: string
  uuid: string
  sku: string
  virtual: boolean
  virtualHost?: string | undefined
  raspberry?: Systeminformation.RaspberryRevisionData | undefined
}

export class BaseboardDataDto implements Systeminformation.BaseboardData {
  manufacturer: string
  model: string
  version: string
  serial: string
  assetTag: string
  memMax: number | null
  memSlots: number | null
}

export class ChassisDataDto implements Systeminformation.ChassisData {
  manufacturer: string
  model: string
  type: string
  version: string
  serial: string
  assetTag: string
  sku: string
}

// OsDataDto
export class OsDataDto implements Systeminformation.OsData {
  platform: string
  distro: string
  release: string
  codename: string
  kernel: string
  arch: string
  hostname: string
  fqdn: string
  codepage: string
  logofile: string
  serial: string
  build: string
  servicepack: string
  uefi: boolean | null
  hypervizor?: boolean | undefined
  remoteSession?: boolean | undefined
  hypervisor?: boolean | undefined
}

export class UuidDataDto implements Systeminformation.UuidData {
  os: string
  hardware: string
  macs: string[]
}
// VersionData
export class VersionDataDto implements Systeminformation.VersionData {
  kernel?: string
  openssl?: string
  systemOpenssl?: string
  systemOpensslLib?: string
  node?: string
  v8?: string
  npm?: string
  yarn?: string
  pm2?: string
  gulp?: string
  grunt?: string
  git?: string
  tsc?: string
  mysql?: string
  redis?: string
  mongodb?: string
  nginx?: string
  php?: string
  docker?: string
  postfix?: string
  postgresql?: string
  perl?: string
  python?: string
  python3?: string
  pip?: string
  pip3?: string
  java?: string
  gcc?: string
  virtualbox?: string
  dotnet?: string
}

// CpuData
export class CpuDataDto implements Systeminformation.CpuData {
  manufacturer: string
  brand: string
  vendor: string
  family: string
  model: string
  stepping: string
  revision: string
  voltage: string
  speed: number
  speedMin: number
  speedMax: number
  governor: string
  cores: number
  physicalCores: number
  efficiencyCores?: number | undefined
  performanceCores?: number | undefined
  processors: number
  socket: string
  flags: string
  virtualization: boolean
  cache: Systeminformation.CpuCacheData
}

// GraphicsData
export class GraphicsDataDto implements Systeminformation.GraphicsData {
  controllers: Systeminformation.GraphicsControllerData[]
  displays: Systeminformation.GraphicsDisplayData[]
}

// NetworkInterfacesData
export class NetworkInterfacesDataDto
  implements Systeminformation.NetworkInterfacesData
{
  iface: string
  ifaceName: string
  default: boolean
  ip4: string
  ip4subnet: string
  ip6: string
  ip6subnet: string
  mac: string
  internal: boolean
  virtual: boolean
  operstate: string
  type: string
  duplex: string
  mtu: number | null
  speed: number | null
  dhcp: boolean
  dnsSuffix: string
  ieee8021xAuth: string
  ieee8021xState: string
  carrierChanges: number
}

// MemLayoutData
export class MemLayoutDataDto implements Systeminformation.MemLayoutData {
  size: number
  bank: string
  type: string
  ecc?: boolean | null | undefined
  clockSpeed: number | null
  formFactor: string
  manufacturer?: string | undefined
  partNum: string
  serialNum: string
  voltageConfigured: number | null
  voltageMin: number | null
  voltageMax: number | null
}

// DiskLayoutData
export class DiskLayoutDataDto implements Systeminformation.DiskLayoutData {
  device: string
  type: string
  name: string
  vendor: string
  size: number
  bytesPerSector: number
  totalCylinders: number
  totalHeads: number
  totalSectors: number
  totalTracks: number
  tracksPerCylinder: number
  sectorsPerTrack: number
  firmwareRevision: string
  serialNum: string
  interfaceType: string
  smartStatus: string
  temperature: number | null
  smartData?: Systeminformation.SmartData | undefined
}

export class StaticDataDto implements Systeminformation.StaticData {
  bios: Systeminformation.BiosData
  version: string
  @ApiProperty({
    type: SystemDataDto,
  })
  system: Systeminformation.SystemData
  @ApiProperty({ type: BaseboardDataDto })
  baseboard: Systeminformation.BaseboardData
  @ApiProperty({ type: ChassisDataDto })
  chassis: Systeminformation.ChassisData
  @ApiProperty({ type: OsDataDto })
  os: Systeminformation.OsData
  @ApiProperty({ type: UuidDataDto })
  uuid: Systeminformation.UuidData
  @ApiProperty({ type: VersionDataDto })
  versions: Systeminformation.VersionData
  @ApiProperty({ type: CpuDataDto })
  cpu: Systeminformation.CpuData
  @ApiProperty({ type: GraphicsDataDto })
  graphics: Systeminformation.GraphicsData
  @ApiProperty({ type: [NetworkInterfacesDataDto] })
  net: Systeminformation.NetworkInterfacesData[]
  @ApiProperty({ type: [MemLayoutDataDto] })
  memLayout: Systeminformation.MemLayoutData[]
  @ApiProperty({ type: [DiskLayoutDataDto] })
  diskLayout: Systeminformation.DiskLayoutData[]
}

// 下面是动态获取的信息
// TimeDTo
export class TimeDataDto implements Systeminformation.TimeData {
  current: number
  uptime: number
  timezone: string
  timezoneName: string
}
// CpuCurrentSpeedData
export class CpuCurrentSpeedDataDto
  implements Systeminformation.CpuCurrentSpeedData
{
  min: number
  max: number
  avg: number
  cores: number[]
}

// UserData
export class UserDataDto implements Systeminformation.UserData {
  user: string
  tty: string
  date: string
  time: string
  ip: string
  command: string
}
// ProcessesData
export class ProcessesDataDto implements Systeminformation.ProcessesData {
  all: number
  running: number
  blocked: number
  sleeping: number
  unknown: number
  list: Systeminformation.ProcessesProcessData[]
}

// CurrentLoadData
export class CurrentLoadDataDto implements Systeminformation.CurrentLoadData {
  avgLoad: number
  currentLoad: number
  currentLoadUser: number
  currentLoadSystem: number
  currentLoadNice: number
  currentLoadIdle: number
  currentLoadIrq: number
  currentLoadSteal: number
  currentLoadGuest: number
  rawCurrentLoad: number
  rawCurrentLoadUser: number
  rawCurrentLoadSystem: number
  rawCurrentLoadNice: number
  rawCurrentLoadIdle: number
  rawCurrentLoadIrq: number
  rawCurrentLoadSteal: number
  rawCurrentLoadGuest: number
  cpus: Systeminformation.CurrentLoadCpuData[]
}
// CpuTemperatureData
export class CpuTemperatureDataDto
  implements Systeminformation.CpuTemperatureData
{
  main: number
  cores: number[]
  max: number
  socket?: number[] | undefined
  chipset?: number | undefined
}
// NetworkStatsData
export class NetworkStatsDataDto implements Systeminformation.NetworkStatsData {
  iface: string
  operstate: string
  rx_bytes: number
  rx_dropped: number
  rx_errors: number
  tx_bytes: number
  tx_dropped: number
  tx_errors: number
  rx_sec: number
  tx_sec: number
  ms: number
}
// NetworkConnectionsData
export class NetworkConnectionsDataDto
  implements Systeminformation.NetworkConnectionsData
{
  protocol: string
  localAddress: string
  localPort: string
  peerAddress: string
  peerPort: string
  state: string
  pid: number
  process: string
}

// MemData
export class MemDataDto implements Systeminformation.MemData {
  total: number
  free: number
  used: number
  active: number
  available: number
  buffcache: number
  buffers: number
  cached: number
  slab: number
  swaptotal: number
  swapused: number
  swapfree: number
  writeback: number | null
  dirty: number | null
}

// BatteryData
export class BatteryDataDto implements Systeminformation.BatteryData {
  hasBattery: boolean
  cycleCount: number
  isCharging: boolean
  voltage: number
  designedCapacity: number
  maxCapacity: number
  currentCapacity: number
  capacityUnit: string
  percent: number
  timeRemaining: number
  acConnected: boolean
  type: string
  model: string
  manufacturer: string
  serial: string
  additionalBatteries?: Systeminformation.BatteryData[] | undefined
}

// ServicesData
export class ServicesDataDto implements Systeminformation.ServicesData {
  name: string
  running: boolean
  startmode: string
  pids: number[]
  cpu: number
  mem: number
}

// FsSizeData
export class FsSizeDataDto implements Systeminformation.FsSizeData {
  fs: string
  type: string
  size: number
  used: number
  available: number
  use: number
  mount: string
  rw: boolean | null
}

// FsStatsData
export class FsStatsDataDto implements Systeminformation.FsStatsData {
  rx: number
  wx: number
  tx: number
  rx_sec: number | null
  wx_sec: number | null
  tx_sec: number | null
  ms: number
}

// DisksIoData
export class DisksIoDataDto implements Systeminformation.DisksIoData {
  rIO: number
  wIO: number
  tIO: number
  rIO_sec: number | null
  wIO_sec: number | null
  tIO_sec: number | null
  rWaitTime: number
  wWaitTime: number
  tWaitTime: number
  rWaitPercent: number | null
  wWaitPercent: number | null
  tWaitPercent: number | null
  ms: number
}

// WifiNetworkData
export class WifiNetworkDataDto implements Systeminformation.WifiNetworkData {
  ssid: string
  bssid: string
  mode: string
  channel: number
  frequency: number
  signalLevel: number
  quality: number
  security: string[]
  wpaFlags: string[]
  rsnFlags: string[]
}

export class DynamicDataDto implements Systeminformation.DynamicData {
  @ApiProperty({ type: TimeDataDto })
  time: Systeminformation.TimeData
  node: string
  v8: string
  @ApiProperty({ type: CpuCurrentSpeedDataDto })
  cpuCurrentSpeed: Systeminformation.CpuCurrentSpeedData
  @ApiProperty({ type: UserDataDto })
  users: Systeminformation.UserData[]
  @ApiProperty({ type: ProcessesDataDto })
  processes: Systeminformation.ProcessesData[]
  @ApiProperty({ type: CurrentLoadDataDto })
  currentLoad: Systeminformation.CurrentLoadData
  @ApiProperty({ type: CpuTemperatureDataDto })
  cpuTemperature: Systeminformation.CpuTemperatureData
  @ApiProperty({ type: NetworkStatsDataDto })
  networkStats: Systeminformation.NetworkStatsData[]
  @ApiProperty({ type: NetworkConnectionsDataDto })
  networkConnections: Systeminformation.NetworkConnectionsData[]
  @ApiProperty({ type: MemDataDto })
  mem: Systeminformation.MemData
  @ApiProperty({ type: BatteryDataDto })
  battery: Systeminformation.BatteryData
  @ApiProperty({ type: ServicesDataDto })
  services: Systeminformation.ServicesData[]
  @ApiProperty({ type: FsSizeDataDto })
  fsSize: Systeminformation.FsSizeData
  @ApiProperty({ type: FsStatsDataDto })
  fsStats: Systeminformation.FsStatsData
  @ApiProperty({ type: DisksIoDataDto })
  disksIO: Systeminformation.DisksIoData
  @ApiProperty({ type: WifiNetworkDataDto })
  wifiNetworks: Systeminformation.WifiNetworkData
  inetLatency: number
}
