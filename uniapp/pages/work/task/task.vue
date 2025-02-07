<template>
	<view>
		<u-tabs v-model="activeTab" :list="list" @click="click" class="wrapper" 
        :activeStyle="{ color: '#2678FFFF' }"
        lineWidth="50"
		:scrollable="false">
		</u-tabs>
		<view v-for="(item,index) in taskList" :key="index" class="list">
			<view class="itemTop">
				<span style="margin-left: 2%;margin-top: 2%;">任务编号：</span>
				<span style="margin-top: 2.5%;">{{ item.ptId }}</span>
				<u-tag plain plainFill text="正常" type="primary" size="mini" style="width: 40px;position: absolute; right: 8%;margin-top: 1%;"></u-tag>
			</view>
			<view class="itemBottom">
				<view style="width: 80%;">
					<span style="margin-left: 2%;margin-top: 1%;">{{"产品：" + item.prId}}</span><br/>
					<span style="margin-left: 2%;margin-top: 1%;">{{"产品任务量：" + item.ptNum}}</span><br/>
					<span style="margin-left: 2%;margin-top: 1%;">{{"创建时间：" + item.createTime}}</span>
				</view>
				<view class="bottom-right">
					<u-button type="primary" text="详情" style="width: 50px;height: 30px;margin-top: 20px;" @click="getDetails(item)"></u-button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { listProductionTask } from '@/api/system/task.js'
	export default {
		data() {
			return {
				activeTab: '待开始', // 默认激活的标签
				taskList: [], // 列表数据
				list: [{
					name: '待开始',
				}, {
					name: '生产中',
				}, {
					name: '已完成'
				}],
				queryParams:{
					ptStatus: '0',
				}
			}
		},
		methods: {
			click(item) {
				console.log('item', item);
				if(item.name === '待投产'){
					this.queryParams.ptStatus = '0';
					this.getList(this.queryParams);
				}else if(item.name === '生产中'){
					this.queryParams.ptStatus = '1';
					this.getList(this.queryParams);
				}else{
					this.queryParams.ptStatus = '2';
					this.getList(this.queryParams);
				}
			},
			getList(query){
				listProductionTask(query).then(res => {
					console.log(res)
					this.taskList = res.rows;
				})
			},
			getDetails(item){
				console.log(item);
				uni.navigateTo({
				  url: `/pages/work/taskDetails/taskDetails?item=${encodeURIComponent(JSON.stringify(item))}`
				});
			}
		}
	}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* 让元素的宽度和高度的计算方式更为直观 */
  font-family: Arial, sans-serif; /* 设置默认字体 */
}
.wrapper{
	background-color: #fff;
	border-top: 1px solid #ccc; /* 示例边框：1像素宽、实线、灰色 */
}
.list{
	width:94%;
	height: 120px;
	margin-left: 3%;
	margin-top: 5%;
	background-color: #fff;
	border-radius: 8px;
}
.itemTop{
	height: 30px;
	border-bottom: 0.7px solid #ccc;
	font-size: 15px;
	display: flex;
	flex-direction: row;
}
.itemBottom{
	display: flex;
	flex-direction: row;
	font-size: 15px;
	margin-top: 5px;
}
.button-left{
	width: 500px;
}
.bottom-right{
	right: 10%;
	position: absolute;
	width: 10%;
}
</style>
