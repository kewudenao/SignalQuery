import { defineStore } from 'pinia'
import { UserInfo } from '@/types'

export const useUserStore = defineStore('user', {
  state: (): { userInfo: UserInfo } => ({
    userInfo: {
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      name: '管理员'
    }
  }),

  actions: {
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo
    }
  }
})

