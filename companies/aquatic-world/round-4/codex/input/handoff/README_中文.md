# 已选定设计 — 文档使用说明

你选中的图片是 **Premium Aquatic / Luxury Nature Storytelling**。本项目要保留深海蓝 + 香槟金、真实感观赏鱼主视觉、大字标题、品牌故事、产品分类和询价入口。

**最重要的决定：不要 hardcode 任何客户品牌，也不要把 Aquatic World 当作固定品牌。** 画面里使用的 `AQUATIC WORLD` 和 `Singapore` 是示范内容。制作真正网页时，品牌、地区、Logo、CTA、图片、产品数据、联系电话和页尾资料全部由 configuration（配置）加载。换一家客户只需要换配置与核实过的资产，不应该修改页面组件。

## 推荐顺序

1. 先打开 `OPEN_ME.html`，查看详细文档及所选设计图。
2. 确认品牌、公司所在国家、产品类别、图像和实际联络渠道。
3. 把 `examples/site-config.example.json` 换成该公司的真实配置。
4. 交给 Coding Agent，并附上 `docs/09_AI_AGENT_IMPLEMENTATION_PROMPT.md`。
5. 先实现 Desktop + Mobile，再开发搜索／询价，最后按 `qa/acceptance-checklist.csv` 验证。

## 特别注意

- 设计图内所有公司规模、品质保证、物流能力、认证及年份，未经公司确认一律不可视为事实。
- 不要为了视觉效果使用错误鱼种名称，照片必须建立 Asset Manifest。
- 询价按钮不可假装提交成功：没有可用 backend 时，必须使用经核实的 mailto 联系方式或者明确展示未启用状态。
- 先完成可读、可用、Responsive 的网站，再考虑动画。
- 本次交付只有设计文档包，没有擅自改动现有项目、GitHub 或部署。
