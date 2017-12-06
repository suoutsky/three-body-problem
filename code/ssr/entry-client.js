/**
 * 果你在路由级别完成以上，可以实现无缝运行（即在路由配置中使用异步组件），
 * 因为在解析路由时，vue-router 将自动解析匹配的异步组件。
 * 你需要做的是确保在服务器和客户端上都使用 router.onReady。
 * 我们已经在我们的服务器入口(server entry)中实现过了，
 * 现在我们只需要更新客户端入口(client entry)：
 */

import { createApp } from './app'
const { app, router, store } = createApp()
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}
router.onReady(() => {
  // 添加路由钩子函数，用于处理 asyncData.
    // 在初始路由 resolve 后执行，
    // 以便我们不会二次预取(double-fetch)已有的数据。
    // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
    router.beforeResolve((to, from, next) => {
      const matched = router.getMatchedComponents(to)
      const prevMatched = router.getMatchedComponents(from)
      // 我们只关心之前没有渲染的组件
      // 所以我们对比它们，找出两个匹配列表的差异组件
      let diffed = false
      const activated = matched.filter((c, i) => {
        return diffed || (diffed = (prevMatched[i] !== c))
      })
      if (!activated.length) {
        return next()
      }
      // 这里如果有加载指示器(loading indicator)，就触发
      Promise.all(activated.map(c => {
        if (c.asyncData) {
          return c.asyncData({ store, route: to })
        }
      })).then(() => {
        // 停止加载指示器(loading indicator)
        next()
      }).catch(next)
    })
    app.$mount('#app')
})
