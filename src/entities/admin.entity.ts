export interface IAdmin {
    _id: string
    email: string,
    password: string
}

export interface IAdminLogin{
    email: string,
    token: string,
}

export interface IJwtPayloadAdmin{
    id: string,
    email: string,
    isAdmin: boolean
}

export interface IStatisticsData{
    _id: string,
    count: number
  }
  