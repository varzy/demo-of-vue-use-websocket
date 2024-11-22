export type MessageSchema = {
  origin: 'client' | 'server'
  event: ClientToServerMessages | ServerToClientMessages
  data: any
}

export type ClientToServerMessages = 'updateSetting' | 'ping' | 'input_source'

export type ServerToClientMessages = 'pong'

export interface SettingsSchema {
  volume: number
}

export type SettingsKey = keyof SettingsSchema
