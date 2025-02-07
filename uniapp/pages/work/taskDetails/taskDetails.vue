<template>
	<view>
		<view style="display: flex; justify-content: center;align-items: center; flex-direction: column;margin-top: 10px;">
			<u-icon name="more-circle-fill" color="#FFB72C" size="70"></u-icon>
			<span style="color:#FFB72C;">进行中</span>
		</view>
		<view class="table-wrap">
			<table>
			  <tbody>
				<tr>
				  <td class="table-cell">任务编号</td>
				  <td class="table-cell">{{ dataList.ptId }}</td>
				</tr>
				<tr>
				  <td class="table-cell">产品</td>
				  <td class="table-cell">{{ dataList.ptDesp }}</td>
				</tr>
				<tr>
				  <td class="table-cell">任务最晚时间</td>
				  <td class="table-cell">{{ dataList.ptLatestEndtime }}</td>
				</tr>
				<tr>
				  <td class="table-cell">任务完成时间</td>
				  <td class="table-cell">{{ dataList.ptRealEndtime ? dataList.ptRealEndtime : '暂未完成'}}</td>
				</tr>
			  </tbody>
			</table>
		</view>
		<u-divider
		        text="任务进度"
		        textColor="#000000"
		        lineColor="#000000"
		></u-divider>
		<view class="user_box" style="width: 80%; margin: 40rpx auto;">
			<view class="user_for" v-for="(list,id) in taskList" :key="id">
				<view class="line_box">
					<!-- 圆球 -->
					<view class="line_radio" :style="{ 'background' : list.etStatus ? '#ef6f16' : '#8e8b8d' , 'border' : list.etStatus ? 'solid 6rpx #fbc293' : 'solid 6rpx #b9b7b6'}"></view>
					<!-- 线 -->
					<view class="line_for" v-for="item in 3" :style="{ 'background' : list.etStatus ? '#ef6f16' : '#8e8b8d'}"></view>
				</view>
				
				<view class="right_box"  :style="{ 'color' : list.etStatus ? '#ef6f16' : '#8e8b8d'}">
					<view class="title">{{list.opName}}</view>
					<view class="desc">
						{{list.etRealEndtime}}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { listTask } from '@/api/system/equipmentTask.js'
	export default {
		data() {
			return {
				dataList: null,
				taskList: []
					
			}
		},
		methods: {
			getDetails(){
				// this.dataList = this.route.query.item
				// console.log(this.dataList)
				const queryParams1 = {
					ptId: this.dataList.ptId,
				  }
				  listTask(queryParams1).then(response => {
					// console.log(response);
					this.taskList = response.rows;
					console.log(this.taskList)
				  })
			},
			
		},
		created() {
			this.getDetails()
		},
		onLoad(options) {
		    // 获取传递的对象参数，使用decodeURIComponent解码，并转为对象
		    if ('item' in options) {
		      this.dataList = JSON.parse(decodeURIComponent(options.item));
		    }
		  }
		
	}
</script>
<style>
	page {
	    background-color: #ffffff;
	}
</style>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* 让元素的宽度和高度的计算方式更为直观 */
  font-family: Arial, sans-serif; /* 设置默认字体 */
}
.table-wrap {
	margin-top: 10px;
  width: 400px;
  /* table-layout: fixed; */
}

.table-cell {
  padding: 8px;
  width: 60%;
  box-sizing: border-box;
}

.table-cell:first-child {
  text-align: left;
}

.table-cell:last-child {
  text-align: right;
}
.user_for{
	display: flex;
}
.item_year {
	font-size: 34rpx;
	height: 50rpx;
}
.line_for {
	width: 4rpx;
	height: 24rpx;
	margin: 0 20rpx 10rpx;
	background-color:#559DFF;
}
.line_radio {
	width: 20rpx;
	height: 20rpx;
	border-radius: 50%;
	position: relative;
	left: 50%;
	transform: translateX(-50%);
	top: 0;
}
.right_box {
	padding: 0rpx 20rpx 20rpx 20rpx;
}
.desc{
	font-size: 30rpx;
	color: #8e8b8d;
	display: flex;
	margin-top: 20rpx;
	align-items: center;
	
}
image{
	margin-right: 20rpx;
	width: 34rpx;
	height: 34rpx;
	border-radius: 50%;
}
</style>
