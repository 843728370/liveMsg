
 //遍历sessionStorage
		function mls() {
			var arr = [],
				key,
				value;

			for (var i = 0 , len = sessionStorage.length; i < len; i++) {
				key = sessionStorage.key(i);
				value = JSON.parse(sessionStorage.getItem(key));
				arr[i] = value;
			}
			//返回新数组
			return arr;
		};

		//修改sessionStorage数据
		function modifySess (set,msga,blon,mek) {
			var key,
				value,
				newValue,
				blo = blon,
				meck = mek,
				useTak = msga,
				seat = set;
			//更该sessionStorage数据
			for (var i = 0 , len = sessionStorage.length; i < len; i++) {
				key = sessionStorage.key(i);
				value = JSON.parse(sessionStorage.getItem(key));

				if (value.msg == seat.msg) {
					if ( useTak == '用户反馈') {
						value.user = blo;
					}else if ( useTak == '已处理' ) {
						value.mek_y = blo;
						meck && (value.mek_n = false);
					}else if ( useTak == '待处理' ){
						value.mek_n = blo;
						meck && (value.mek_y = false);
					}else if ( useTak == 'plus' ) {
						value.plus = blo;
					}
					newValue = JSON.stringify(value);
					sessionStorage.setItem( key , newValue );
				}
			}
		};

		//knockout function
		function myMsg() {
			//获取this对象
			var self = this;
			//用户名
			self.userName = ko.observable();
			//留言内容
			self.userMsg = ko.observable();
			//文本字数统计
			self.textNum = ko.observable('0/300');
			//留言数组
			self.msgAyrray = ko.observableArray(mls());
			//搜索内容
			self.searVal = ko.observable();
			//字数提醒
			self.stop = ko.observable(false);
			//回复框是否显示
			self.reply_conten = ko.observable(false);
			//回复框背景是否显示
			self.reply_bg = ko.observable(false);
			//回复用户名
			self.reply_name = ko.observable();
			//回复内容
			self.reply_msg = ko.observable();
			//public
			self.public = function (set,msga,blo,mek) {
				var seat = set,
					useTak = msga,
					blon = blo,
					meck = mek,
					msArr = self.msgAyrray,
				    newArr = self.msgAyrray(),
				    mlsArr;

				modifySess( seat , useTak , blon ,meck);
				//刷新页面内容
				mlsArr= mls()
				msArr.removeAll();
				mlsArr.forEach(function (e) {
					//遍历sessionStorage数据
					msArr.push(e);
				});
			};

			//打开添加标签
			self.plusBtn = function (set) {
				var seat = set,
					blon = true,
					useTak = 'plus';
				self.public(seat,useTak,blon);
				self.searchBtn();
			};

			//关闭添加标签
			self.takPlusBtn = function (set) {
				var seat = set,
					blon = false,
					useTak = 'plus';
				self.public(seat,useTak,blon);
			};

			//添加用户反馈
			self.plusKu = function (set) {
				var seat = set,
					blon = true,
					useTak = '用户反馈';
				self.public(seat,useTak,blon);
				//关闭选择标签
				self.takPlusBtn(seat);
				//关联搜索
				self.searchBtn();
			};

			//添加已处理
			self.plus_y = function (set) {
				var seat = set,
					blon = true,
					mek_n = 'y',
					useTak = '已处理';
				self.public(seat,useTak,blon,mek_n);
				self.takPlusBtn(seat);
				self.searchBtn();
			};

			//添加待处理
			self.plus_n = function (set) {
				var seat = set,
					blon = true,
					mek_y = 'n',
					useTak = '待处理';
				self.public(seat,useTak,blon,mek_y);
				self.takPlusBtn(seat);
				self.searchBtn();
			};

			//添加回复
			self.plus_reply = function (set) {
				var seat = set,
						mArr =self.msgAyrray();
				self.reply_conten(true);
				self.reply_bg(true);
				self.takPlusBtn(seat);
				mArr.forEach(function (e) {
					if (e.msg == seat.msg) {
						e.reply_blo = true;
					}
				});
			};

			//点击回复
			self.replyBtn = function () {
				var msg = self.reply_name()+': '+self.reply_msg(),
						mArr = self.msgAyrray(),
						mmArr = self.msgAyrray,
						newArr,
						newValue,
						key,
						value,
						mlsArr;

				self.reply_name('');
				self.reply_msg('');
				self.reply_conten(false);
				self.reply_bg(false);
				mArr.forEach(function (e) {
					if (e.reply_blo == true) {
						newArr = e;
						e.reply_blo =false;

					}
				});
				for (var i = 0 , len = sessionStorage.length; i < len; i++) {
					key = sessionStorage.key(i);
					value = JSON.parse(sessionStorage.getItem(key));
					if ( value.msg == newArr.msg) {
						value.reply = msg;
						newValue = JSON.stringify(value);
						sessionStorage.setItem( key , newValue );

					};
				};
				mlsArr = mls();
				mmArr.removeAll();
				mlsArr.forEach(function (e) {
					//遍历sessionStorage数据
					mmArr.push(e);
				});
			};

			//删除用户反馈
			self.userKu = function (set) {
				var seat = set,
					blon = false,
					useTak = '用户反馈';
				self.public(seat,useTak,blon);
				self.searchBtn();
			};


			//删除已处理
			self.userMek_y = function (set) {
				var seat = set,
					blon = false,
					useTak = '已处理';
				self.public(seat,useTak,blon);
				self.searchBtn();
			};

			//删除待处理
			self.userMek_n = function (set) {
				var seat = set,
					blon = false,
					useTak = '待处理';
				self.public(seat,useTak,blon);
				self.searchBtn();
			};

			//textara字数计算
			self.areaWord = function (_index) {
				var texTarVal = document.getElementsByClassName('areaval')[0],
					spanSum = document.getElementById('sum'),
					aereLeng,
					texts,
					sliceVal,
					setTime;
				texTarVal.addEventListener("keyup",function () {
					aereLeng = texTarVal.value.length;
					texts = aereLeng+"/300";
					if ( aereLeng > 300) {
						sliceVal = texTarVal.value.slice(0,300);
					   document.getElementsByClassName('areaval')[0].value = sliceVal;
						self.textNum(texts);
						self.stop(true);
					setTime = setTimeout(function () {
						self.stop(false);
						clearTimeout(setTime);
					},1500);
					}else{
						self.textNum(texts);
					}
				});
			};

			//搜索
			self.searchBtn = function () {
				var seVal = self.searVal(),
					newArr = self.msgAyrray,
					//获取sessionStorage数据
					mlsArr = mls(),
					//获取textarea内容
					seArr = self.msgAyrray();
				//判断搜索内容
				if ( seVal == '用户反馈') {
					newArr.remove(function(item) {
					 	return (item.user == false);
					});
				}else if ( seVal == '已处理' ) {
					newArr.remove(function(item) {
					 	return (item.mek_y == false);
					});

				}else if ( seVal == '待处理' ) {
					newArr.remove(function(item) {
					 	return (item.mek_n == false);
					});
				}else if ( seVal == '回复' ){
					newArr.remove(function(item) {
					 	return (item.reply =='');
					});
				}else{
					//刷新页面数据
					newArr.removeAll();
					mlsArr.forEach(function (e) {
						newArr.push(e);
					});
				}
			};

			//提交留言
			self.sendMsg = function () {
				var uN = self.userName(),
					uM = self.userMsg(),
					user,
					msg;
        //
        self.textNum('0/300')

				//判断留言/用户名内容是否为空
				if (uN && uM) {
					//添加留言道sessionStorage到
					var msgConten = uN+': '+uM,

						ff = sessionStorage.length,
						ff1 = 'item'+ff,
						obj ={
								msg: msgConten,
								user: true,
								mek_y: false,
								mek_n:true,
								plus:false,
								reply_blo:false,
								reply:''
							},
						//转化js对象为json
						json = JSON.stringify(obj);
					sessionStorage.setItem( ff1 , json);
					//清空文本框/域内容
					self.userName('');
					self.userMsg('');

			 		//显示提交留言到页面
			 		self.msgAyrray.push({
			 			msg:msgConten,
			 			user: true,
						mek_y: false,
						mek_n:true,
						plus:false,
						reply_blo:false,
						reply:''
			 		});
				}else{
					//判断用户名和留言内容是否为空
					if ( !uN ) {
						self.userName('用户名不能为空!');
						user = setTimeout(function () {
							self.userName('');
							clearTimeout(user);
						},800);
					}else if( !uM ) {
						self.userMsg('留言内容不能为空!');
						msg = setTimeout(function () {
							self.userMsg('');
							clearTimeout(msg);
						},800);

					}
				}
			};

			//删除元素
			self.deletItem = function (set) {
				var deletArr = self.msgAyrray,
				//遍历寻找删除元素的下表
					stVal = set.msg,
					key,
					value;
					//删除页面对应的元素
					deletArr.remove(set)
				//遍历寻找sessionStorage对应值并删除
				for (var i = 0 , len = sessionStorage.length; i < len; i++) {
					key = sessionStorage.key(i);
					value = JSON.parse(sessionStorage.getItem(key));
					if ( value.msg = stVal ) {
						sessionStorage.removeItem(key);
					}
				}

			}
		};

		ko.applyBindings(new myMsg());
