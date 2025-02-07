<template>
  <div class="table-demo-wrapper">
    <ul class="table-header">
      <li>
        <span>姓名</span>
        <span>性别</span>
        <span>年龄</span>
        <span>地址</span>
      </li>
    </ul>
    <vueSeamlessScroll :data="source" class="seamless-warp" >
      <ul
        class="list"
        :style="'height:'+source.length*38+'px;'"
        @mousemove="stopScroll"
        @mouseout="doScroll"
      >
        <li
          :class="{devicelistitem: true, even: (index + 1) % 2 !== 0}"
          v-for="(item,index) in source"
          :key="index"
        >
          <span :title="item.name">{{item.name}}</span>
          <span :title="item.sex">{{item.sex}}</span>
          <span :title="item.age">{{item.age}}</span>
          <span :title="item.address">{{item.address}}</span>
        </li>
      </ul>
    </vueSeamlessScroll>
  </div>
</template>

<script>
    import vueSeamlessScroll from "vue-seamless-scroll";
    export default {
    components: {
    vueSeamlessScroll,
  },
    data() {
    return {
    allowScroll: true,
    source: [],
  };
  },
    computed: {
    optionSingleHeightTime() {
    return {
    singleHeight: 38,
    waitTime: 3000,
    limitMoveNum: this.source ? this.source.length : 5,
  };
  },
  },
    mounted() {
    this.initData();
  },
    methods: {
    initData() {
    this.source = [];
    for (let i = 0; i < 30; i++) {
    this.source.push({
    name: `张三${i + 1}`,
    sex: "男",
    age: i + 1,
    address: "中国大陆浙江省杭州市西湖区",
  });
  }
  },
    stopScroll() {
    this.allowScroll = false;
  },
    doScroll() {
    this.allowScroll = true;
  },
  },
  };
</script>

<style scoped>
*{ margin:0; padding:0; }
.table-demo-wrapper {
  margin: 0;
  left: 0;
  width: 100%;
  height: 200px;
  overflow: hidden;
  padding: 0;
  /*background-color: pink;*/
}

.table-demo-wrapper .table-header {
  margin-top: 5px;
  width: 100%;
  margin-left: 0;
}

.table-demo-wrapper .table-header li {
  height: 38px;
  display: flex;
  /*justify-content: flex-start;*/
  align-items: center;
}

.table-demo-wrapper .table-header li span {
  line-height: 40px;
  flex: 1;
  font-size: 14px;
  font-family: FZZhengHeiS-M-GB;
  font-weight: 400;
  color: #fff;
  /*text-align: left;*/
}

.table-demo-wrapper .table-header li span:nth-child(1) {
  flex: 2;
}

.table-demo-wrapper .table-header li span:nth-child(4) {
  flex: 2;
  text-align: center;
}

.table-demo-wrapper .seamless-warp {
  overflow: hidden;
}

.table-demo-wrapper .seamless-warp .list {
  overflow: hidden;
  left: 0;
}

.table-demo-wrapper .seamless-warp .list .devicelistitem {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 38px;
}

.table-demo-wrapper .seamless-warp .list .devicelistitem span {
  flex: 1;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 400;
  color: #d7def5;
  text-align: left;
}

.table-demo-wrapper .seamless-warp .list .devicelistitem span:nth-child(1) {
  flex: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-demo-wrapper .seamless-warp .list .devicelistitem span:nth-child(4) {
  flex: 2;
  text-align: center;
}

.table-demo-wrapper .seamless-warp .list .even {
  background: linear-gradient(180deg, rgba(85, 109, 255, 0.3), rgba(45, 67, 139, 0.3), rgba(85, 109, 255, 0.3));
}

</style>
