---
title: web开发css基础书写规范
date: 2015-10-07 08:55:29
categories: css
tags: css
toc: true
---

# 规范条目
1. class命名链接一律使用半角中线连接 “-” ，禁止使用下划线或者驼峰命名；
正确：.this-module-move；（1级-2级-3级.......）
错误：.this_module_move；     thisModuleMove；   thismodulemove；
2. class命名当中不能使用大写字母
正确：.this-module-move；
错误：.thisModuleMove；  THISMODULEMOVE；
3. class一级命名必须使用英文单词，其他级尽量使用英文，迫不得已可以使用拼音；
4. class命名采用级别命名法；
公共模块一级必须是public，二级必须是模块名，三级四级根据模块根据模块功能或者作用来命名；
例如
.public-house-ico、.public-house-search-txt；
私有模块可以不使用public，但一级或者二级必须是模块名，二级或者三级四级根据模块根据模块功能或者作用来命名；
例如
house-ico、.house-search-txt；
5. class命名数字只能出现在命名最后一级；首部和中部不能出现数字
正确：.this-module-move-item1；.this-module-move-item2；
错误：.this-module-move1-item；.this2-module-move-item1；
6. (适用于移动版）公共样式根部默认字体大小为10px或者62.5%；字体单位建议使用rem；
字体大小设置即：
10px=1rem；
12px=1.2rem；
15px=1.5rem；
25px=2.5rem；
.....
7. z-index层级关系；最外层父级单位为100单位一层级；子级为10单位一层级；（继续补充）
8. 不提倡直接定义标签，建议每隔标签添加class；尤其是div、p、a、span等常用标签；
`<div class="active"><span class="ico"></span></div>`
正确：.actuve .ico； 
错误：.actuve span；div span；
9. 不建议使用active伪类作为触发效果；建议使用hover
正确：.actuve：hover；
错误：.actuve：active；
10. （适用于移动版）鉴于移动web开发，尽量最大化使用html5语义化标签；
例如header、section、footer、address、详见html5标准；
11. （适用于移动版）关于触发效果，属性为 data-hover=“{样色值}”
例如
正确： data-hover=“rgba（0,0,0,0.5）”； data-hover=“#000”；
不建议使用red、green等单词代替；
12. css不能采用单行书写，必须为多行；
例如；
红色部分必须是盒子模型属性在前，例如display、position、border、margin、padding等等；后面视情况而定；
倡议书写顺序：
 
显示属性：display/list-style/position/float/clear …
自身属性（盒模型）：width/height/margin/padding/border
背景：background
行高：line-height
文本属性：color/font/text-decoration/text-align/text-indent/vertical-align/white-space/content…
其他：cursor/z-index/zoom/overflow
CSS3属性：transform/transition/animation/box-shadow/border-radius
如果使用CSS3的属性，如果有必要加入浏览器前缀，则按照 -webkit- / -moz- / -ms- / -o- / std的顺序进行添加，标准属性写在最后。
链接的样式请严格按照如下顺序添加： a:link -> a:visited -> a:hover -> a:active
倡议坚持：
使用单引号，不允许使用双引号;
每个声明结束都应该带一个分号，不管是不是最后一个声明;
除16进制颜色和字体设置外，CSS文件中的所有的代码都应该小写;
除了重置浏览器默认样式外，禁止直接为html tag添加css样式设置;
每一条规则应该确保选择器唯一，禁止直接为全局.nav/.header/.body等类设置属性;
13. css头部不能包含个人信息和utf-8等；
14. 模块css段落样式前需要注释模块名字和用途，css书写格式采用多行原则，禁止单行。
例如
15. 颜色值不建议使用red、green、blue等类似单词、建议使用16进制或者rgba格式；
十六进制纯色需要省去后三位色值，
例如 黑色 #000000 →#000；#ffffff →#fff；
提议使用小写字母
16. 文字超出css通用样式为 .text-more，需要定义容器宽度；
.text_more {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
17. 图片命名
为避免图片命名冲突
图片命名采用项目名+功能/作用+次序；
例如个人中心的搜索logo
person_search_logo_01.jpg
18. 一级class样式必须包含至少一个父级定义；（防止css样式名重复覆盖）
`<div class="pubilc-module"><a class="item"></a></div>`
正确：.pubilc-module .item { }；
错误：.item { }；

19. 主色调样式class（相见reset.css）；

20. 字体规范（适用于PC版）；
1、为了防止文件合并及编码转换时造成问题，建议将样式中文字体名字改成对应的英文名字，如：黑体(SimHei) 宋体(SimSun) 微软雅黑 (Microsoft Yahei，几个单词中间有空格组成的必须加引号)
2、字体粗细采用具体数值，粗体bold写为700，正常normal写为400
3、font-size必须以px或pt为单位，推荐用px（注：pt为打印版字体大小设置），不允许使用xx-small/x-small/small/medium/large/x-large/xx-large等值
4、为了对font-family取值进行统一，更好的支持各个操作系统上各个浏览器的兼容性，font-family不允许在业务代码中随意设置
21. 其他注意事项
1、不要轻易改动全站级CSS和通用CSS库。改动后，要经过全面测试。
2、避免使用filter
3、避免在CSS中使用expression
4、避免过小的背景图片平铺。
5、尽量不要在CSS中使用!important
6、绝对不要在CSS中使用”*”选择符
7、层级(z-index)必须清晰明确，页面弹窗、气泡为最高级（最高级为999），不同弹窗气泡之间可在三位数之间调整；普通区块为10-90内10的倍数；区块展开、弹出为当前父层级上个位增加，禁止层级间盲目攀比。
8、背景图片请尽可能使用sprite技术, 减小http请求, 考虑到多人协作开发, sprite按照模块、业务、页面来划分均可。
四、css全局重置样式地址
测试版
http://192.168.242.44/sceapp/focus_static/wap/common/css/mobile_reset_v1.0.css（适用于移动版）
Focus-css重置样式（PC版）
# 附则
 
1、常用命名（多记多查英文单词）：page、wrap、layout、header(head)、footer(foot、ft)、content(cont)、menu、nav、main、submain、sidebar(side)、logo、banner、title(tit)、popo(pop)、icon、note、btn、txt、iblock、window(win)、tips等。 
 
1、常用id的命名：
 
(1) 页面结构
 
容器: container
页头：header
内容：content/container
页面主体：main
页尾：footer
导航：nav
侧栏：sidebar
栏目：column
页面外围控制整体布局宽度：wrapper
左右中：left right center
(2) 导航
 
导航：nav
主导航：mainbav
子导航：subnav
顶导航：topnav
边导航：sidebar
左导航：leftsidebar
右导航：rightsidebar
菜单：menu
子菜单：submenu
标题: title
摘要: summary
(3) 功能
 
标志：logo
广告：banner
登陆：login
登录条：loginbar
注册：regsiter
搜索：search
功能区：shop
标题：title
加入：joinus
状态：status
按钮：btn
滚动：scroll
标签页：tab
文章列表：list
提示信息：msg
当前的: current
小技巧：tips
图标: icon
注释：note
指南：guild
服务：service
热点：hot
新闻：news
下载：download
投票：vote
合作伙伴：partner
友情链接：link
版权：copyright
 