#### 项目配置

- `tsconfig.json` 

[tsconfig-zh](https://www.tslang.cn/docs/handbook/tsconfig-json.html)
[tsconfig-en](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

```
compilerOptions 编译选项
    moduleResolution 决定如何处理模块
    target 指定ECMAScript目标版
    module 指定生成哪个模块系统代码
    lib 编译过程中需要引入的库文件的列表
    strict 启用所有严格类型检查选项
    sourceMap 生成相应的 .map文件
    declaration 生成相应的 .d.ts文件
    allowSyntheticDefaultImports 允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查
    experimentalDecorators 启用实验性的ES装饰器
    emitDecoratorMetadata 给源码里的装饰器声明加上设计类型元数据
    declarationDir 生成声明文件的输出路径
    outDir 重定向输出目录
    typeRoots 要包含的类型声明文件路径列表

inclued 
exclude
    "include"和"exclude"属性指定一个文件glob匹配模式列表
```

- 相关依赖

- commander 命令行工具
    
```
npm i commander -D
```

- inquirer  处理命令行交互

```
npm i inquirer -D
```

- chalk 命令行输出颜色

```
npm i chalk -D
```

- tinify 压缩图片核心包

```
npm i tinify -D
```

#### node 相关知识

- `process.cwd()` 获取 Node.js 进程的当前工作目录
- `process.execPath` 返回启动 Node.js 进程的可执行文件的绝对路径
- `__dirname` 当前模块的目录名 [__dirname](http://nodejs.cn/api/modules.html#modules_dirname)
- `path.resolve(path, path...)` 返回当前工作目录的绝对路径
- `path.join(path, path...)` 使用平台特定的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径
- `path.parse(path)` 方法返回一个对象，包含标识path的信息
