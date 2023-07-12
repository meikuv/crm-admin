<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Страница не найдена</h2>
    <router-link to="/home">На главную</router-link>
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  text-align: center;
  margin: auto;
  h1 {
    font-size: 12rem;
    line-height: 12rem;
    margin: 0;
  }
}
</style>
