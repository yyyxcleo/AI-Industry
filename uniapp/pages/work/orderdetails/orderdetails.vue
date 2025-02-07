<template>
	<view>
		<u-cell-group class="custom-cell-group" >
			<u-cell
				title="订单号"
				:value="order.omId"
			></u-cell>
			<u-cell
				title="状态"
				:value="order.omStatus"
			></u-cell>
			<u-cell
				title="供方"
				:value="order.omSupply"
			></u-cell>
			<u-cell
				title="供方地址"
				:value="order.omSupplyAddress"
			></u-cell>
			<u-cell
				title="需方"
				:value="order.omDemand"
			></u-cell>
			<u-cell
				title="需方地址"
				:value="order.omDemandAddress"
			></u-cell>
			<u-cell
				title="订单交期"
				:value="order.omDeliveryDate"
			></u-cell>
			<u-cell
				title="总价"
				:value="order.omTotalPrice"
			></u-cell>
		</u-cell-group>
		 <u-collapse
				accordion
		>
			<u-collapse-item
				title="产品列表"
				style="background-color: #fff;"
			>
				<!-- <u-icon name="tags-fill" size="20" slot="icon"></u-icon> -->
				<!-- <text class="u-collapse-content">众多组件覆盖开发过程的各个需求，组件功能丰富，多端兼容。让您快速集成，开箱即用</text> -->
				<u-list class="list">
				<u-list-item
					v-for="(item, index) in listDetails"
					:key="index"	
				>
					<u-cell
					:title="getPrName(item.prId)">
						<template slot="label">
							<span>{{"产品单价："+ item.odUnitPrice}}</span>
							<span>{{"产品数量："+ item.prNum}}</span>
						</template>
					</u-cell>
				</u-list-item>
				</u-list>
			</u-collapse-item>
		</u-collapse>
	</view>
</template>

<script>
	import { getOrder } from '@/api/system/bookmenu.js'
	import { listOrderDetails } from '@/api/system/orderDetails.js'
	import {listProduct} from "@/api/system/product";
	export default {
		data() {
			return {
				order:{
					omId: undefined,
					omStatus: undefined,
					omDemand: undefined,
					omDemandAddress:undefined,
					omSupply: undefined,
					omSupplyAddress: undefined,
					omTotalPrice: undefined,
					omDeliveryDate: undefined
				},
				queryParams:{
					omId: undefined
				},
				listDetails: [],
				deptOptions: []
			}
		},
		methods: {
			getDetails() { 
				// const query ={
					// this.queryParams.omId = this.$route.query.omId,
				// }
				// console.log(query.omId)
				
				getOrder(this.queryParams.omId).then(res => {
					console.log(res)
					this.order = res.data;
				})
			},
			getOrderDetails() {
				listOrderDetails(this.queryParams).then(res => {
					this.listDetails = res.rows;
					console.log(this.listDetails)
				})
			},
			 getPrName(prId) {
				  const prid = this.deptOptions.find(item => item.prId === prId);
				  return prid ? prid.prName : '';
			},
			getItemTree() {
				  listProduct().then(response => {
					this.deptOptions = response.rows;
					console.log(this.deptOptions)
				  });
			},
		},
		onLoad(options) {
		    // 获取传递的对象参数，使用decodeURIComponent解码，并转为对象
		    if ('item' in options) {
		      this.queryParams.omId = JSON.parse(decodeURIComponent(options.item)).omId;
		    }
		  },
		created() {
			this.getDetails();
			this.getItemTree()
			this.getOrderDetails();
		}
	}
</script>

<style lang="scss">
.custom-cell-group {
  background-color: #ffffff; /* 设置背景为白色 */
}
.u-page {
        padding: 0;

        &__item {
    
            &__title {
                 color: $u-tips-color;
                 background-color: $u-bg-color;
                 padding: 15px;
                 font-size: 15px;
        
                &__slot-title {
                     color: $u-primary;
                     font-size: 14px;
                 }
            }
        }
    }

    // .u-collapse-content {
    //     color: $u-tips-color;
    //     font-size: 14px;
    // }
	
</style>
