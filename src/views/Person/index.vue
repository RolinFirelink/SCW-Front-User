<script setup></script>

<template>
  <div class="container">
    <div class="xtx-member-aside">
      <div class="user-manage">
        <div class="links">
          <RouterLink to="/personal">个人中心</RouterLink>
        </div>
        <div class="links">
          <RouterLink to="/personal/experts">我的专家</RouterLink>
        </div>
      </div>
    </div>
    <div class="article">
      <!-- 三级路由的挂载点 -->
      <RouterView />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  padding-top: 20px;

  .xtx-member-aside {
    width: 220px;
    margin-right: 20px;
    border-radius: 2px;
    background-color: #fff;

    .user-manage {
      background-color: #fff;

      h4 {
        font-size: 18px;
        font-weight: 400;
        padding: 20px 52px 5px;
        border-top: 1px solid #f6f6f6;
      }

      .links {
        padding: 0 52px 10px;
      }

      a {
        display: block;
        line-height: 1;
        padding: 15px 0;
        font-size: 14px;
        color: #666;
        position: relative;

        &:hover {
          color: $mainColor;
        }

        &.active,
        &.router-link-exact-active {
          color: $mainColor;

          &:before {
            display: block;
          }
        }

        &:before {
          content: '';
          display: none;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          position: absolute;
          top: 19px;
          left: -16px;
          background-color: $mainColor;
        }
      }
    }
  }

  .article {
    width: 1000px;
    background-color: #fff;
  }
}
</style>
