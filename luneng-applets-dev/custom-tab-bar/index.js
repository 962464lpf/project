Component({
	data: {
		isShowTabbar: true,
		active: 0,
		list: [
			{
				icon: 'home-o',
				text: '我的工作',
				url: '/pages/index/index'
			},
			{
				icon: 'records',
				text: '会议管理',
				url: '/pages/manageMeeting/manageMeeting'
			},
			{
				icon: 'friends-o',
				text: '通讯录',
				url: '/pages/addressList/addressList'
			},
			{
				icon: 'user-o',
				text: '个人中心',
				url: '/pages/profile/profile'
			}
		]
	},

	methods: {
		onChange(event) {
			this.setData({ active: event.detail });
			wx.switchTab({
				url: this.data.list[event.detail].url
			});
		},

		init() {
			const page = getCurrentPages().pop();
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`)
			});
		}
	}
});
