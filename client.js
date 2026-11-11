/**
 * dsh-sidebar-scroll-fix — 右侧 sidebar 内容超出时不可上下滚动的修复。
 *
 * 根因（源码证据）：
 *   - 官方右栏 dsh-client-ui-sidebar-right 每个 tab 的正文包装
 *     `.acoR2W_tabBody` 写死 `overflow:hidden`，滚动责任下放给页面，
 *     但内置「开始」引导页（`.p2k40q_guide`，min-height:100% 的列）
 *     并不自建滚动容器 —— 条目一多，底部直接被裁掉且滚不动。
 *   - Better Sidebar 的 `.nArs4W_paneContent` / `.nArs4W_paneEmptyCards`
 *     同样是 `overflow:hidden`。
 *
 * 必须用 !important：宿主的这些样式是插件 CSS-module，在组件首次渲染时
 * 才追加到 <head>，晚于本插件在页面加载时注入的 style；同特异度下
 * 后来者胜，不加 !important 会被宿主原样式覆盖回去。
 * 内容没超出时 overflow-y:auto 不产生滚动条，其余行为不变。
 *
 * 不注册 slot、不读 host 服务、不改内核文件，卸载即净。
 */
window.__ModuleLoader__.load({
  id: 'dsh-sidebar-scroll-fix',
  factory() {
    // factory 必须返回带 apply 的 cordis 插件对象（前端 registry.resolve 会校验）。
    // DOM 副作用放进 apply，并用 id 去重，HMR 重载时不会重复注入。
    return {
      inject: [],
      apply() {
        if (document.getElementById('dsh-sidebar-scroll-fix')) return
        const css = [
          '.acoR2W_tabBody{overflow-y:auto !important;overflow-x:hidden !important}',
          '.nArs4W_paneContent{overflow-y:auto !important;overflow-x:hidden !important}',
          '.nArs4W_paneEmptyCards{overflow-y:auto !important;overflow-x:hidden !important}',
          // 「开始」引导页：justify-content:center 配合底部 :after(flex:0 10%) 占位，
          // 在小窗口/内容超高时会把整组条目往上下顶，首条仍被切。可滚列表本就该
          // 顶对齐，改成 flex-start 彻底消除居中这个变量；保留上下 16px 留白，
          // 首末条都能完整显示（内容少时不再垂直居中，纯美观代价）。
          '.p2k40q_guide{justify-content:flex-start;padding:16px 24px}',
        ].join('\n')
        const style = document.createElement('style')
        style.id = 'dsh-sidebar-scroll-fix'
        style.textContent = css
        document.head.appendChild(style)
      },
    }
  },
})
