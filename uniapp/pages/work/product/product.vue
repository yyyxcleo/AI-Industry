<template>
  <view>
    <view class="topbcg">
      <view class="data">
        <view class="dataitem">
          <text>{{ num }}</text>
          <text>总产品数</text>
        </view>
		<!-- <view class="dataitem">
		  <text>{{ numOnline }}</text>
		  <text>设备在线</text>
		</view>
		<view class="dataitem">
		  <text>{{ numFailed }}</text>
		  <text>设备异常</text>
		</view> -->
      </view>
    </view>
    <!-- <view class="devicemenu">
      <view><span>设备查看</span></view>
      <view class="deviceitem" v-for="(item, index) in device" :key="index" @click="navigateToPage(item.url, item.img,item.label,item.status)">
        <view class="img">
          <image :src="item.img"></image>
        </view>
        <view>
          <view>
            <text>{{ item.label }}</text>
          </view>
          <view class="title">
            <text v-if="item.status === 1">设备在线</text>
            <text v-else-if="item.status === 0">设备离线</text>
          </view>
        </view>
      </view>
    </view> -->
	<u-list class="list">
		<u-list-item
			v-for="(item, index) in prList"
			:key="index"
			
		>
			<u-cell
				:title="item.prName"
				class="custom-cell" 
				@click="open"
			>
			<template slot="label">
				<span>{{"产品名称："+ item.prName}}</span><br/>
				<span>{{"产品库存："+ item.prInventory}}</span><br/>
				<span>{{"创建时间："+ item.createTime}}</span>
			</template>
			</u-cell>
		</u-list-item>
	</u-list>
  </view>
</template>

<script>	
	import { listProduct } from '@/api/system/product.js';
	export default {
		data() {
			return {
				prList: [],
				num:undefined,
				numOnline: undefined,
				numFailed: undefined,
				show: false
			}
		},
		methods: {
			getProduct(){
				listProduct().then(res => {
					this.prList = res.rows;
					console.log(this.prList);
					this.num = this.prList.length;
					
				})
			},
			getType(eqtype){
				if(eqtype === '1749707747447111682') return "机械臂";
				else return "小车"
			},
			open() {
				this.show = true;
			},
			close() {
				this.show = false
			}
		},
		created() {
			this.getProduct();
		},
		computed:{
			
		}
	}
</script>

<style lang="scss">
  .topbcg{
	  width:100%;
	  height: 100px;
	  background-color: #5290FF;
  }
  // .data{
	 //  position: absolute;
	 //  top: 70px;
	 //  left: 10px;
	 //  height: 70px;
	 //  width: 375px;
	 //  background-color: white;
	 //  border-radius: 8px;
  // }
   .top {
      display: flex; /* 使用Flex布局 */
      justify-content: space-between; /* 在父容器中水平对齐并平均分配空间 */
      padding: 30px;
    }
    .item {
		margin-top: 30px;
		display: flex; /* 使用Flex布局 */
		flex-direction: column; /* 垂直排列子元素 */
		align-items: center; /* 在主轴上居中对齐 */
		width: 80px;
    }
    .item image {
      width: 30px;
      height: 30px;
      margin-bottom: 5px;
    }
	.item text{
		color: white;
	}
	.data{
	  position: absolute;
	  top: 20px;
	  left: 10px;
	  height: 70px;
	  width: 95%;
	  background-color: white;
	  border-radius: 8px;
	  display: flex;
	  justify-content: space-around;
	  align-items: center;
	}
	
	.dataitem{
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  text-align: center;
	}
	
	.dataitem text:nth-child(1){
	  font-size: 24px;
	  font-weight: bold;
	  color: #333333;
	}
	.dataitem text:nth-child(2){
	  margin-top: 5px;
	  font-size: 16px;
	  color: #666666;
	}
	/* 设备菜单样式 */
	.devicemenu {
		margin-top: 70px;
	  width: 400px; /* 调整宽度以适应需要 */
	  background-color: #f2f2f2;
	  border-radius: 10px;
	  display: flex;
	  flex-direction: column;
	  /* padding: 10px; */
	}
	
	/* 设备项目样式 */
	.deviceitem {
	  display: flex;
	  align-items: center;
	  flex-direction: row;
	  /* padding: 5px; */
	  cursor: pointer;
	  height: 70px;
	  background-color: white;
	  border-bottom: 2px solid #F5F5F5;
	}
	
	.deviceitem:hover {
	  background-color: #e6e6e6;
	}
	
	.deviceitem .icon {
	  margin-right: 10px;
	}
	
	.deviceitem .name {
	  font-weight: bold;
	}
	
	.deviceitem .status {
	  margin-left: auto;
	  font-size: 12px;
	  color: #999999;
	}
	
	.deviceitem.active {
	  background-color: #d9d9d9;
	}
	.deviceitem text{
		text-align: left;
	}
	.deviceitem image{
		height: 50px;
		width: 70px;
	}
	.devicemenu span{
		font-size:20px;
		font-family: "Microsoft YaHei", sans-serif;
	}
	.deviceitem view:nth-child(1) {
		margin-top: 5px;
	 font-size: 20px;
	 font-family: 'Roboto', sans-serif;
		font-weight: 500;
	}
	.deviceitem view:nth-child(2) {
		font-size: 15px;
		margin-top: 10px;
		margin-left: 0px;
		/* color: #5290FF; */
	}
	.img{
		height: 50px;
		width: 70px;
	}
	.title{
		height: 50px;
		color: #5290FF;
		/* padding-top: 0; */
	}
	.list{
		margin-top: 5%
	}
	.custom-cell {
		background-color: #fff;
		height: 130px;
		margin-top: 2%;
	}
	@import 'uni_modules/uview-ui/index.scss'
</style>
