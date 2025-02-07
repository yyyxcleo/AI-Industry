<template>
  <div>
    <video ref="videoPlayer" muted autoplay  class="circlebg" @ended="restartVideo">
      <source src="@/assets/board/data4bg.mp4" type="video/mp4">
    </video>
<!--    <video ref="videoPlayer" muted autoplay  class="circlebg" @ended="restartVideo">-->
<!--      <source src="@/assets/board/line.mp4" type="video/mp4">-->
<!--    </video>-->
    <div class="dt1">
      <span style="color: #FFFFFF">数据1</span>
      <span style="color: #FFA902">111</span>
    </div>
    <div class="dt2">
      <span style="color: #FFFFFF">数据2</span>
      <span style="color: #FF4F02">222</span>
    </div>
    <div class="dt3">
      <span style="color: #FFFFFF">数据3</span>
      <span style="color: #8B02FF">333</span>
    </div>
    <div class="dt4">
      <span style="color: #FFFFFF">数据4</span>
      <span style="color: #02FFB5">444</span>
    </div>
    <div class="dt5">
      <span style="color: #FFFFFF">数据5</span>
      <span style="color: #D2FF02">555</span>
    </div>
    <div class="dt6">
      <span style="color: #FFFFFF">数据6</span>
      <span style="color: #02DEFF">666</span>
    </div>
  </div>

</template>

<script>
export default {
  name: "data4",
  methods:{
    restartVideo(){
      this.$refs.videoPlayer.currentTime = 0;
      this.$refs.videoPlayer.play();
    }
  }
}
</script>

<style scoped>
.circlebg{
  position: absolute;
  z-index: 0;
  width: 100%;
  height: 80%;
}
.dt1{
  position: absolute;
  z-index: 1;
  left: 20%;
  top: 22%;
  display: flex;
  flex-direction: column;
}
.dt2{
  position: absolute;
  z-index: 1;
  left: 10%;
  top: 45%;
  display: flex;
  flex-direction: column;
}
.dt3{
  position: absolute;
  z-index: 1;
  left: 20%;
  top: 70%;
  display: flex;
  flex-direction: column;
}
.dt4{
  position: absolute;
  z-index: 1;
  right: 18%;
  top: 22%;
  display: flex;
  flex-direction: column;
}
.dt5{
  position: absolute;
  z-index: 1;
  right: 8%;
  top: 45%;
  display: flex;
  flex-direction: column;
}
.dt6{
  position: absolute;
  z-index: 1;
  right: 18%;
  top: 70%;
  display: flex;
  flex-direction: column;
}
</style>
