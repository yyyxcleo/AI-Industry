<template>
    <div class="app-container home">
        <img :src="bg" class="sidebar-logo" />
    </div>
  </template>
  
  <script>

  export default {
    name: "Index",
    data() {
      return {
        // 版本号
        bg: require("../assets/images/bg.png"),
        version: "0.8.3",
      };
    },
    methods: {
      goTarget(href) {
        window.open(href, "_blank");
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  .home {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    // background-image: url("../assets/images/bg.png");
    background-size: cover;
    
  
    // font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    // font-size: 13px;
    // color: #676a6c;
    overflow-x: hidden;
  
  }
  </style>
  
  