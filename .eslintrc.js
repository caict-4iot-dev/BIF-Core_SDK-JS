module.exports = {
    "parser": "babel-eslint",
    "root": true,
    "globals": {
        "document": true,
        "navigator": true,
        "window": true,
        "think": true
    },
    "env": {
        "browser": true,
        "node": true,
        "jest": true,
        "commonjs": true,
        "jquery": true,
        "es6": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    "ecmaFeatures": {
        // lambda表达式  
        "arrowFunctions": true,
        // 解构赋值  
        "destructuring": true,
        // class  
        "classes": true,
        // http://es6.ruanyifeng.com/#docs/function#函数参数的默认值  
        "defaultParams": true,
        // 块级作用域，允许使用let const  
        "blockBindings": true,
        // 允许使用模块，模块内默认严格模式  
        "modules": true,
        // 允许字面量定义对象时，用表达式做属性名  
        // http://es6.ruanyifeng.com/#docs/object#属性名表达式  
        "objectLiteralComputedProperties": true,
        // 允许对象字面量方法名简写  
        /*var o = {
            method() {
              return "Hello!";
            }
         };
         等同于
         var o = {
           method: function() {
             return "Hello!";
           }
         };
        */
        "objectLiteralShorthandMethods": true,
        /*
          对象字面量属性名简写
          var foo = 'bar';
          var baz = {foo};
          baz // {foo: "bar"}
          // 等同于
          var baz = {foo: foo};
        */
        "objectLiteralShorthandProperties": true,
        // http://es6.ruanyifeng.com/#docs/function#rest参数  
        "restParams": true,
        // http://es6.ruanyifeng.com/#docs/function#扩展运算符  
        "spread": true,
        // http://es6.ruanyifeng.com/#docs/iterator#for---of循环  
        "forOf": true,
        // http://es6.ruanyifeng.com/#docs/generator  
        "generators": true,
        // http://es6.ruanyifeng.com/#docs/string#模板字符串  
        "templateStrings": true,
        "superInFunctions": true,
        // http://es6.ruanyifeng.com/#docs/object#对象的扩展运算符  
        "experimentalObjectRestSpread": true
    },
    "rules": {
        // 定义对象的set存取器属性时，强制定义get  
        "accessor-pairs": 2,
        // 指定数组的元素之间要以空格隔开(,后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格  
        "array-bracket-spacing": [2, "never"],
        // 在块级作用域外访问块内定义的变量是否报错提示  
        "block-scoped-var": 0,
        // if while function 后面的{必须与if在同一行，java风格。  
        "brace-style": [2, "1tbs", { "allowSingleLine": true }],
        // 双峰驼命名格式  
        "camelcase": 0,
        // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，  
        // always-multiline：多行模式必须带逗号，单行模式不能带逗号  
        "comma-dangle": [2, "never"],
        // 控制逗号前后的空格  
        "comma-spacing": [2, { "before": false, "after": true }],
        // 控制逗号在行尾出现还是在行首出现  
        // http://eslint.org/docs/rules/comma-style  
        "comma-style": [2, "last"],
        // 圈复杂度  
        "complexity": [0, 11],
        // 以方括号取对象属性时，[ 后面和 ] 前面是否需要空格, 可选参数 never, always  
        "computed-property-spacing": [2, "never"],
        // 强制方法必须返回值，TypeScript强类型，不配置  
        "consistent-return": 0,
        // 用于指统一在回调函数中指向this的变量名，箭头函数中的this已经可以指向外层调用者，应该没卵用了  
        // e.g [0,"that"] 指定只能 var that = this. that不能指向其他任何值，this也不能赋值给that以外的其他值  
        "consistent-this": 0,
        // 强制在子类构造函数中用super()调用父类构造函数，TypeScrip的编译器也会提示  
        "constructor-super": 0,
        // if else while for do后面的代码块是否需要{ }包围，参数：  
        //    multi  只有块中有多行语句时才需要{ }包围  
        //    multi-line  只有块中有多行语句时才需要{ }包围, 但是块中的执行语句只有一行时，  
        //                   块中的语句只能跟和if语句在同一行。if (foo) foo++; else doSomething();  
        //    multi-or-nest 只有块中有多行语句时才需要{ }包围, 如果块中的执行语句只有一行，执行语句可以零另起一行也可以跟在if语句后面  
        //    [2, "multi", "consistent"] 保持前后语句的{ }一致  
        //    default: [2, "all"] 全都需要{ }包围  
        "curly": [2, "all"],
        // switch语句强制default分支，也可添加 // no default 注释取消此次警告  
        "default-case": 2,
        // 强制object.key 中 . 的位置，参数:  
        //      property，'.'号应与属性在同一行  
        //      object, '.' 号应与对象名在同一行  
        "dot-location": [2, "property"],
        // 强制使用.号取属性  
        //    参数： allowKeywords：true 使用保留字做属性名时，只能使用.方式取属性  
        //                          false 使用保留字做属性名时, 只能使用[]方式取属性 e.g [2, {"allowKeywords": false}]  
        //           allowPattern:  当属性名匹配提供的正则表达式时，允许使用[]方式取值,否则只能用.号取值 e.g [2, {"allowPattern": "^[a-z]+(_[a-z]+)+$"}]  
        "dot-notation": [2, { "allowKeywords": true }],
        // 文件末尾强制换行  
        "eol-last": 2,
        // 使用 === 替代 ==  
        "eqeqeq": [2, "allow-null"],
        // 方法表达式是否需要命名  
        "func-names": 0,
        // 方法定义风格，参数：  
        //    declaration: 强制使用方法声明的方式，function f(){} e.g [2, "declaration"]  
        //    expression：强制使用方法表达式的方式，var f = function() {}  e.g [2, "expression"]  
        //    allowArrowFunctions: declaration风格中允许箭头函数。 e.g [2, "declaration", { "allowArrowFunctions": true }]  
        "func-style": 0,
        //生成器函数*的前后空格
        "generator-star-spacing": [2, { "before": true, "after": true }],
        //for in循环要用if语句过滤
        "guard-for-in": 0,
        //nodejs 处理错误
        "handle-callback-err": [2, "^(err|error)$"],
        //缩进风格
        "indent": [2, 2, { "SwitchCase": 1 }],
        //对象字面量中冒号的前后空格
        "key-spacing": [2, { "beforeColon": false, "afterColon": true }],
        "linebreak-style": 0,//换行风格
        "lines-around-comment": 0,//行前/行后备注
        "max-nested-callbacks": 0,//回调嵌套深度
        //函数名首行大写必须使用new方式调用，首行小写必须用不带new方式调用
        "new-cap": [2, { "newIsCap": true, "capIsNew": false }],
        "new-parens": 2,//new时必须加小括号
        "newline-after-var": 0,//变量声明后是否需要空一行
        "no-alert": 0,//禁止使用alert confirm prompt
        "no-array-constructor": 2,//禁止使用数组构造器
        "no-caller": 2,//禁止使用arguments.caller或arguments.callee
        "no-catch-shadow": 0,//禁止catch子句参数与外部作用域变量同名
        "no-cond-assign": 2,//禁止在条件表达式中使用赋值语句
        "no-console": 0,//禁止使用console
        "no-constant-condition": 0,//禁止在条件中使用常量表达式 if(true) if(1)
        "no-continue": 0,//禁止使用continue
        "no-control-regex": 2,//禁止在正则表达式中使用控制字符
        "no-debugger": 2,//禁止使用debugger
        "no-delete-var": 2,//不能对var声明的变量使用delete操作符
        "no-div-regex": 0,//不能使用看起来像除法的正则表达式/=foo/
        "no-dupe-args": 2,//函数参数不能重复
        "no-dupe-keys": 2,//在创建对象字面量时不允许键重复 {a:1,a:1}
        "no-duplicate-case": 2,//switch中的case标签不能重复
        "no-else-return": 0,//如果if语句里面有return,后面不能跟else语句
        "no-empty": 0,//块语句中的内容不能为空
        "no-empty-character-class": 2,//正则表达式中的[]内容不能为空
        "no-empty-label": 0,//禁止使用空label
        "no-eq-null": 0,//禁止对null使用==或!=运算符
        "no-eval": 2,//禁止使用eval
        "no-ex-assign": 2,//禁止给catch语句中的异常参数赋值
        "no-extend-native": 2,//禁止扩展native对象
        "no-extra-bind": 2,//禁止不必要的函数绑定
        "no-extra-boolean-cast": 2,//禁止不必要的bool转换
        "no-extra-parens": 0,//禁止非必要的括号
        "no-extra-semi": 0,//禁止多余的冒号
        "no-fallthrough": 2,//禁止switch穿透
        "no-floating-decimal": 2,//禁止省略浮点数中的0 .5 3.
        "no-func-assign": 2,//禁止重复的函数声明
        "no-implied-eval": 2,//禁止使用隐式eval
        "no-inline-comments": 0,//禁止行内备注
        "no-inner-declarations": [2, "functions"],//禁止在块语句中使用声明（变量或函数）
        "no-invalid-regexp": 2,//禁止无效的正则表达式
        "no-irregular-whitespace": 2,//不能有不规则的空格
        "no-iterator": 2,//禁止使用__iterator__ 属性
        "no-label-var": 2,//label名不能与var声明的变量名相同
        "no-labels": 2,//禁止标签声明
        "no-lone-blocks": 2,//禁止不必要的嵌套块
        "no-lonely-if": 0,//禁止else语句内只有if语句
        "no-loop-func": 0,//禁止在循环中使用函数（如果没有引用外部变量不形成闭包就可以）
        "no-mixed-requires": 0,//声明时不能混用声明类型
        "no-mixed-spaces-and-tabs": 2,//禁止混用tab和空格
        "no-multi-spaces": 2,//不能用多余的空格
        "no-multi-str": 2,//字符串不能用\换行
        "no-multiple-empty-lines": [2, { "max": 1 }],//空行最多不能超过2行
        "no-native-reassign": 2,//不能重写native对象
        "no-negated-in-lhs": 2,//in 操作符的左边不能有!
        "no-nested-ternary": 0,//禁止使用嵌套的三目运算
        "no-new": 2,//禁止在使用new构造一个实例后不赋值
        "no-new-func": 0,//禁止使用new Function
        "no-new-object": 2,//禁止使用new Object()
        "no-new-require": 2,//禁止使用new require
        "no-new-wrappers": 2,//禁止使用new创建包装实例，new String new Boolean new Number
        "no-obj-calls": 2,//不能调用内置的全局对象，比如Math() JSON()
        "no-octal": 2,//禁止使用八进制数字
        "no-octal-escape": 2,//禁止使用八进制转义序列
        "no-param-reassign": 0,//禁止给参数重新赋值
        "no-path-concat": 0,//node中不能使用__dirname或__filename做路径拼接
        "no-process-env": 0,//禁止使用process.env
        "no-process-exit": 0,//禁止使用process.exit()
        "no-proto": 0,//禁止使用__proto__属性
        "no-redeclare": 2,//禁止重复声明变量
        "no-regex-spaces": 2,//禁止在正则表达式字面量中使用多个空格 /foo bar/
        "no-restricted-modules": 0,//如果禁用了指定模块，使用就会报错
        "no-return-assign": 2,//return 语句中不能有赋值表达式
        "no-script-url": 0,//禁止使用javascript:void(0)
        "no-self-compare": 2,//不能比较自身
        "no-sequences": 2,//禁止使用逗号运算符
        "no-shadow": 0,//外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
        "no-shadow-restricted-names": 2,//严格模式中规定的限制标识符不能作为声明时的变量名使用
        "no-spaced-func": 2,//函数调用时 函数名与()之间不能有空格
        "no-sparse-arrays": 2,//禁止稀疏数组， [1,,2]
        "no-sync": 0,//nodejs 禁止同步方法
        "no-ternary": 0,//禁止使用三目运算符
        "no-this-before-super": 2,//在调用super()之前不能使用this或super
        "no-throw-literal": 2,//禁止抛出字面量错误 throw "error";
        "no-trailing-spaces": 2,//一行结束后面不要有空格
        "no-undef": 2,//不能有未定义的变量
        "no-undef-init": 2,//变量初始化时不能直接给它赋值为undefined
        "no-undefined": 0,//不能使用undefined
        "no-underscore-dangle": 0,//标识符不能以_开头或结尾
        "no-unexpected-multiline": 2,//避免多行表达式
        "no-unneeded-ternary": 2,//禁止不必要的嵌套 var isYes = answer === 1 ? true : false;
        "no-unreachable": 2,//不能有无法执行的代码
        "no-unused-expressions": 0,//禁止无用的表达式
        "no-unused-vars": [2, { "vars": "all", "args": "none" }],//不能有声明后未被使用的变量或参数
        "no-use-before-define": 0,//未定义前不能使用
        "no-var": 0,//禁用var，用let和const代替
        "no-void": 0,//禁用void操作符
        "no-warning-comments": 0,//不能有警告备注
        "no-with": 2,//禁用with
        "object-curly-spacing": 0, //大括号内是否允许不必要的空格
        "object-shorthand": 0,//强制对象字面量缩写语法
        "one-var": [2, { "initialized": "never" }],//连续声明
        "operator-assignment": 0,//赋值运算符 += -=什么的
        "operator-linebreak": [2, "after", { "overrides": { "?": "before", ":": "before" } }],//换行时运算符在行尾还是行首
        "padded-blocks": 0,//块语句内行首行尾是否要空行
        "prefer-const": 0,//首选const
        "quote-props": 0,//对象字面量中的属性名是否强制双引号
        "quotes": [2, "single", "avoid-escape"],//引号类型 `` "" ''
        "radix": 2,//parseInt必须指定第二个参数
        "semi": [2, "never"], //语句强制分号结尾
        "semi-spacing": 0,//分号前后空格
        "sort-vars": 0,//变量声明时排序
        "space-after-keywords": [0, "always"],//关键字后面是否要空一格
        "space-before-blocks": [2, "always"],//不以新行开始的块{前面要不要有空格
        "space-before-function-paren": [0, "always"],//函数定义时括号前面要不要有空格
        'indent': 'off',//缩进风格
        "space-in-parens": [2, "never"],//小括号里面要不要有空格
        "space-infix-ops": 2,//中缀操作符周围要不要有空格
        "space-return-throw-case": 0,//return throw case后面要不要加空格
        "space-unary-ops": [2, { "words": true, "nonwords": false }],//一元运算符的前/后要不要加空格
        //注释风格要不要有空格什么的
        "spaced-comment": [2, "always", { "markers": ["global", "globals", "eslint", "eslint-disable", "*package", "!"] }],
        "strict": 0,//使用严格模式
        "use-isnan": 2,//禁止比较时使用NaN，只能用isNaN()
        "valid-jsdoc": 0,//jsdoc规则
        "valid-typeof": 2,//必须使用合法的typeof的值
        "vars-on-top": 0,//var必须放在作用域顶部
        "wrap-iife": [2, "any"],//立即执行函数表达式的小括号风格
        "wrap-regex": 0,//正则表达式字面量用小括号包起来
        "yoda": [2, "never"],//禁止尤达条件
        "no-useless-escape": 'off'//禁用不必要的转义字符
    }
};