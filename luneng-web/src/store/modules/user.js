import {login, logout, getInfo} from '@/api/login'
import {getToken, setToken, removeToken, webSocketOnMessage} from '@/utils/auth'
import WebSocketClass from '@/utils/websocket'
import {ip} from "@/settings"

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissions: [],
    msgNoRead: 0,
    webSocket: null,
    webSocketMessage: null,
    yearList: [],
    dept: '',
    userId: '',
    userInfo: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_MSGNOREAD: (state, msgNoRead) => {
      state.msgNoRead = msgNoRead
    },
    SET_WEBSOCKET: (state, webSocket) => {
      state.webSocket = webSocket
    },
    SET_WEBSOCKETMESSAGE: (state, webSocketMessage) => {
      state.webSocketMessage = webSocketMessage
    },
    SET_YEARLIST: (state, yearList) => {
      state.yearList = yearList
    },
    SET_DEPT: (state, dept) => {
      state.dept = dept
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },

  },

  actions: {
    // 登录
    Login({commit}, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password
      const code = userInfo.code
      const uuid = userInfo.uuid
      return new Promise((resolve, reject) => {
        login(username, password, code, uuid).then(res => {
          setToken(res.token)
          commit('SET_TOKEN', res.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({dispatch, commit, state}) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(res => {
          const user = res.user
          const avatar = user.avatar == "" ? require("@/assets/image/profile.jpg") : process.env.VUE_APP_BASE_API + user.avatar;
          if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', res.roles)
            commit('SET_PERMISSIONS', res.permissions)
          } else {
            commit('SET_ROLES', ['ROLE_DEFAULT'])
          }
          commit('SET_NAME', user.userName)
          commit('SET_USERID', user.userId)
          commit('SET_USERINFO', user)
          if (!state.webSocket) {
            dispatch('createWebSocket', user.userName)
          }
          commit('SET_AVATAR', avatar)
          commit('SET_MSGNOREAD', user.msgNoRead)
          if (user.dept) {
            commit('SET_DEPT', user.dept)
          }
          if (res.yearList) commit('SET_YEARLIST', res.yearList)
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 退出系统
    LogOut({commit, state}) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({commit}) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    //
    changeMsgNoRead({commit}, data) {
      commit('SET_MSGNOREAD', data)
    },

    //创建websocket实例并保存到vuex中
    createWebSocket({commit}, userName) {
      const wsUrl = ip.replace(RegExp("https", "g"), "wss")
        .replace(RegExp("http", "g"), "ws") + "/ws/msg/" + userName;  //生成环境是https请求需要将ws替换成wss,以保证websocket请求可被正常接收
      const webSocket = new WebSocketClass(wsUrl, webSocketOnMessage)
      commit('SET_WEBSOCKET', webSocket)
    },

    //websocket服务端返回信息
    getWsOnMessage({commit}, message) {
      commit('SET_WEBSOCKETMESSAGE', message)
    }
  }
}

export default user
