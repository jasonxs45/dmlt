### 自用npm脚手架

#### 所需
* commander: 命令行工具
* download-git-repo: 来通过git下载项目模板的插件
* inquirer: 用于命令行交互问询等
* ora: 用于实现node命令环境的loading效果，并显示各种状态的图标,显示 loading 动画
* chalk: chalk是一个颜色的插件。可以通过chalk.green(‘success’)来改变颜色。修改控制台输出内容样式
* log-symbols: 用于在打印输出的内容中加入icon更友好（显示出 √ 或 × 等的图标）
* handlebars.js： 模板引擎工具，可用于修改package.json中相关字段

#### inquirer参数

* type：表示提问的类型，包括：input, confirm, list, rawlist, expand, checkbox, password, editor；
* name: 存储当前问题回答的变量；
* message：问题的描述；
* default：默认值；
* choices：列表选项，在某些 type 下可用，并且包含一个分隔符(separator)；
* validate：对用户的回答进行校验；
* filter：对用户的回答进行过滤处理，返回处理后的值；
* when：根据前面问题的回答，判断当前问题是否需要被回答；
* prefix：修改 message 默认前缀；
* suffix：修改 message 默认后缀。