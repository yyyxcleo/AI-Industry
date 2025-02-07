<template>
  <view class="content">
    <image class="logo" src="@/static/image.png"></image>
    <view class="text-area">
      <text class="title">欢迎来到智控生产</text>
    </view>
  </view>
</template>

<script>
	import { listEquipment } from '@/api/system/equipment.js'
  export default {
	  data(){
		return{
			eqList:[]
		}  
	  },
	onLoad: function() {
		console.log(11)
	},
	created() {
		// this.getEqList()
	},
	methods: {
		getEqList(){
			listEquipment().then(res =>{
				console.log(res);
			})
		}
	}
  }
</script>

<style>
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 50rpx;
  }

  .text-area {
    display: flex;
    justify-content: center;
  }

  .title {
    font-size: 36rpx;
    color: #8f8f94;
  }
</style>
