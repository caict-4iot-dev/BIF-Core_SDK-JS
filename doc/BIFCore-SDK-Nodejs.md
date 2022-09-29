# 1.BIFCore-SDK-NodeJs使用说明

​		本节详细说明BIFCore-SDK-NodeJs常用接口文档。星火链提供 nodejs版 SDK供开发者使用。

​        **github**代码库地址：https://github.com/caict-4iot-dev/BIF-Core_SDK-JS

## 1.1 SDK概述

### 1.1.1 名词解析

+ 账户服务： 提供账户相关的有效性校验、创建与查询接口

+ 合约服务： 提供合约相关的有效性校验、创建与查询接口

+ 交易服务： 提供构建交易及交易查询接口

+ 区块服务： 提供区块的查询接口

+ 账户nonce值： 每个账户都维护一个序列号，用于用户提交交易时标识交易执行顺序的

### 1.1.2 请求参数与相应数据格式

+ **请求参数**

​    为了保证数字精度，请求参数中的Number类型，全都按照字符串处理，例如：

​    amount = 500， 那么传递参数时候就将其更改为 amount = '500' 字符串形式：

+ **响应数据**

  响应数据为JavaScript对象，数据格式如下：

  ```js
  {
  	errorCode:0,
  	errorDesc:'',
  	result:{}
  }
  ```

  说明：

  1. errorCode: 错误码。0表示无错误，大于0表示有错误
  1. errorDesc: 错误描述。
  1. result: 返回结果

  > 因响应数据结构固定，方便起见，后续接口说明中的`响应数据`均指`result`对象的属性

## 1.2 SDK使用方法

​		本节介绍SDK的使用流程。

​		首先需要生成SDK实现，然后调用相应服务的接口，其中服务包括账户服务、合约服务、交易服务和区块服务。

### 1.2.1 生成SDK实例

##### 传入参数：

options 是一个对象，可以包含如下属性

| 参数 | 类型   | 描述        |      |
| ---- | ------ | ----------- | ---- |
| host | String | ip地址:端口 |      |

##### 实例：

```js
const BIFCoreSDK = require('bifcore-sdk-nodejs')
const options = {
  host: 'http://test-bif-core.xinghuo.space'
}
const sdk = new BIFCoreSDK(options)
```

### 1.2.2 生成公私钥地址

+ **Ed25519算法生成**

```js
const KeyPairEntity = sdk.keypair.getBidAndKeyPair()
const encAddress = KeyPairEntity.encAddress
const encPublicKey = KeyPairEntity.encPublicKey
const encPrivateKey = KeyPairEntity.encPrivateKey
const rawPublicKey = KeyPairEntity.rawPublicKey
const rawPrivateKey = KeyPairEntity.rawPrivateKey
```

+ **SM2算法生成**

```js
const KeyPairEntitySM2 = sdk.keypair.getBidAndKeyPairBySM2()
const encAddress = KeyPairEntitySM2.encAddress
const encPublicKey = KeyPairEntitySM2.encPublicKey
const encPrivateKey = KeyPairEntitySM2.encPrivateKey
const rawPublicKey = KeyPairEntitySM2.rawPublicKey
const rawPrivateKey = KeyPairEntitySM2.rawPrivateKey
```

### 1.2.3 私钥对象使用

+ **构造对象**

```js
//签名方式构造 
const privateKeyManager = sdk.keypair.privateKeyManager(sdk.keypair.CRYPTO_ED25519)
//私钥构造
const encPrivateKey = 'privbsDGan4sA9ZYpEERhMe25k4K5tnJu1fNqfEHbyKfaV9XSYq7uMcy'
const privateKeyManagerByKey = sdk.keypair.privateKeyManagerByKey(encPrivateKey)
```

+ **解析对象**

```js
//构造对象
const privateKeyManager = sdk.keypair.privateKeyManager(sdk.keypair.CRYPTO_ED25519)
//获取私钥
const encPrivateKey = privateKeyManager.encPrivateKey
//address
const encAddress = privateKeyManager.encAddress
//公钥
const encPublicKey = privateKeyManager.encPublicKey
//获取原生私钥
const rawPrivateKey = privateKeyManager.rawPrivateKey
//获取原生公钥
const rawPublicKey = privateKeyManager.rawPublicKey
```

+ **账户地址校验**

```js
const address = 'did:bid:efnVUgqQFfYeu97ABf6sGm3WFtVXHZB2'
const isAddress = sdk.keypair.isAddress(address)
```

+ **根据私钥获取公钥**

```js
const encPrivateKey = 'privbsDGan4sA9ZYpEERhMe25k4K5tnJu1fNqfEHbyKfaV9XSYq7uMcy'
const encPublicKey = sdk.keypair.getEncPublicKey(encPrivateKey)
```

+ **原生私钥转星火私钥**

```js
const encPrivateKeyByRaw = sdk.keypair.getEncPrivateKeyByRaw(rawPrivateKey,sdk.keypair.CRYPTO_ED25519)
```

+ **原生公钥转星火公钥**

```js
const encPublicKeyByRaw = sdk.keypair.getEncPublicKeyByRaw(rawPublicKey,sdk.keypair.CRYPTO_ED25519)
```

+ **签名**

```js
const privateKey = 'privbsDGan4sA9ZYpEERhMe25k4K5tnJu1fNqfEHbyKfaV9XSYq7uMcy'
const serialization = 'test'
const signature = sdk.keypair.sign(serialization,privateKey)
```

### 1.2.4 公钥对象使用

+ **构造对象**

```js
//公钥创建对象
const encPublicKey = 'b0014085888f15e6fdae80827f5ec129f7e9323cf60732e7f8259fa2d68a282e8eed51fad13f'
const publicKeyManager = sdk.keypair.publicKeyManager(encPublicKey)
```

+ **获取账号地址**

```js
const encPublicKey = 'b0014085888f15e6fdae80827f5ec129f7e9323cf60732e7f8259fa2d68a282e8eed51fad13f'
const publicKeyManager = sdk.keypair.publicKeyManager(encPublicKey)
const encAddress = publicKeyManager.encAddress
const rawPublicKey = publicKeyManager.rawPublicKey
```

+ **验签** 

```js
const publicKey = 'b07a6604f00d7a00da61f975048a40db1568a3befe3eb4e69fa2d14bf3e44833db58f4761c293efcd48a912b8ee2693b4f9ae0c9a4d03ffe4fb54bb7c2a5afd758df78dd'
//签名后信息
const serialization = '59bda0c85e354ba4690b9bd8079a8e97dd18461c5d67128e46b693aef71d391ad965464c2db2c88610b3266899392703f11d047c696d17867985d0e057018450'
const verify= sdk.keypair.verify(serialization,publicKey)

```

### 1.2.5 密钥存储器

+ **生成密钥存储器**

```js
generateKeyStore(encPrivateKey,password)
```

>  请求参数

| 参数          | 类型   | 描述         |
| ------------- | ------ | ------------ |
| encPrivateKey | String | 待存储的密钥 |
| password      | String | 口令         |

> 响应数据

| 参数     | 类型        | 描述             |
| -------- | ----------- | ---------------- |
| keyStore | KeyStoreEty | 存储密钥的存储器 |

> 示例

```js
const  encPrivateKey = 'priSrrstxpMCKMa9G6d41rZ4iwzKbGeqJrXqeWZYXVo2pct24L'
const  password = 'bif8888'
 //生成密钥存储器
const keyStore = sdk.keypair.generateKeyStore(encPrivateKey,password)

```

+ **解析密钥存储器**

```
decipherKeyStore(keyStore,password);
```

>  请求参数

| 参数     | 类型   | 描述             |
| -------- | ------ | ---------------- |
| password | String | 口令             |
| keyStore | String | 存储密钥的存储器 |

> 响应数据

| 参数          | 类型   | 描述           |
| ------------- | ------ | -------------- |
| encPrivateKey | String | 解析出来的密钥 |

> 示例

```js
const password = 'bif8888'
const keyStore= '{\"cypher_text\":\"f306394e808cb422f5c0ad072f09283a4cee1fc8058ab2593397da1d375becdab05b886703d28e802353d5a659b3484f0103\",\"aesctr_iv\":\"9a1c9811fc29cfbe0b6e2160b2f7dc81\",\"scrypt_params\":{\"n\":16384,\"p\":1,\"r\":8,\"salt\":\"80454456c43bb0ed2103b990f549c15262d354cdb49a8682af1d4f618c112b9c\"},\"version\":2}'

const encPrivateKey = sdk.keypair.decipherKeyStore(keyStore,password)
console.log('decipherKeyStore()', JSON.stringify( encPrivateKey))

```

### 1.2.6 助记词

+ **生成助记词**

> 请求参数

| 参数   | 类型   | 描述                     |
| ------ | ------ | ------------------------ |
| random | byte[] | 16位字节数组，必须是16位 |

> 响应数据

| 参数          | 类型         | 描述   |
| ------------- | ------------ | ------ |
| mnemonicCodes | List<String> | 助记词 |

> 示例

```js
 let random = randombytes(16)
 const mnemonicCodes = sdk.keypair.generateMnemonicCode(random.toString('hex'))
 console.log('mnemonicCodes ',mnemonicCodes)
```

+ **根据助记词生成私钥**

> 请求参数

| 参数          | 类型         | 描述              |
| ------------- | ------------ | ----------------- |
| type          | String       | 选填，ED25519/SM2 |
| mnemonicCodes | List<String> | 必填，助记词      |
| hdPaths       | List<String> | 必填，路径        |

> 响应数据

| 参数        | 类型         | 描述 |
| ----------- | ------------ | ---- |
| privateKeys | List<String> | 私钥 |

> 示例

```js
 let random = randombytes(16);
 const mnemonicCodes = sdk.keypair.generateMnemonicCode(random.toString('hex'));
//ED25519
//方式一
 const privateKey = await sdk.keypair.privateKeyFromMnemonicCode(mnemonicCodes, "m/44'/526'/1'/0/0");
    console.log(privateKey);
//方式二
 const privkeyED25519 = await sdk.keypair.privKeyFromMCodeAndCrypto(sdk.keypair.CRYPTO_ED25519, mnemonicCodes, "m/44'/526'/1'/0/0");
    console.log(privkeyED25519);

//SM2
 const privkeySM2 = await sdk.keypair.privKeyFromMCodeAndCrypto(sdk.keypair.CRYPTO_SM2, mnemonicCodes, "m/44'/526'/1'/0/0");
    console.log(privkeySM2);

```

## 1.3 账户服务接口列表

​		账户服务接口主要是账户相关的接口，目前有8个接口：

| 序号 | 接口                | 说明                                  |
| ---- | ------------------- | ------------------------------------- |
| 1    | createAccount       | 生成主链数字身份                      |
| 2    | getAccount          | 该接口用于获取指定的账户信息          |
| 3    | getNonce            | 该接口用于获取指定账户的nonce值       |
| 4    | getAccountBalance   | 该接口用于获取指定账户的星火令的余额  |
| 5    | setMetadatas        | 设置metadatas                         |
| 6    | getAccountMetadatas | 该接口用于获取指定账户的metadatas信息 |
| 7    | setPrivilege        | 设置权限                              |
| 8    | getAccountPriv      | 获取账户权限                          |

### 1.3.1 createAccount

> 接口说明

```
该接口用于生成主链数字身份。
```

> 调用方法

```js
account.createAccount(createAccountOperation)
```

> 请求参数

| 参数          | 类型    | 描述                                                         |
| ------------- | ------- | ------------------------------------------------------------ |
| senderAddress | string  | 必填，交易源账号，即交易的发起方                             |
| privateKey    | String  | 必填，交易源账户私钥                                         |
| ceilLedgerSeq | Long    | 选填，区块高度限制, 如果大于0，则交易只有在该区块高度之前（包括该高度）才有效 |
| remarks       | String  | 选填，用户自定义给交易的备注                                 |
| destAddress   | String  | 必填，目标账户地址                                           |
| initBalance   | Long    | 必填，初始化星火令，单位PT，1 星火令 = 10^8 PT, 大小(0, Long.MAX_VALUE] |
| gasPrice      | Long    | 选填，打包费用 (单位是PT)，默认100L                          |
| feeLimit      | Long    | 选填，交易花费的手续费(单位是PT)，默认1000000L               |
| domainId      | Integer | 选填，指定域ID，默认主共识域id(0)                            |

> 响应数据

| 参数 | 类型   | 描述     |
| ---- | ------ | -------- |
| hash | string | 交易hash |


> 错误码

| 异常                      | 错误码 | 描述                                          |
| ------------------------- | ------ | --------------------------------------------- |
| INVALID_ADDRESS_ERROR     | 11006  | Invalid address                               |
| REQUEST_NULL_ERROR        | 12001  | Request parameter cannot be null              |
| PRIVATEKEY_NULL_ERROR     | 11057  | PrivateKeys cannot be empty                   |
| INVALID_DESTADDRESS_ERROR | 11003  | Invalid destAddress                           |
| INVALID_INITBALANCE_ERROR | 11004  | InitBalance must between 1 and Long.MAX_VALUE |
| SYSTEM_ERROR              | 20000  | System error                                  |
| INVALID_DOMAINID_ERROR    | 12007  | Domainid must be equal to or greater than 0   |


> 示例

```js
// 初始化请求参数
 let createAccountOperation = {
          sourceAddress:'did:bid:efnVUgqQFfYeu97ABf6sGm3WFtVXHZB2',
          privateKey:'priSPKkWVk418PKAS66q4bsiE2c4dKuSSafZvNWyGGp2sJVtXL',
          remarks:'create account',
          destAddress:'did:bid:efQMuPahc3zm7abBUBfj22xZokhZ7rED',
          initBalance:'100000000000',
          ceilLedgerSeq:'',
     	  gasPrice:'',
     	  feeLimit:'',
          domainId:'20'
      }
 let data = await sdk.account.createAccount(createAccountOperation)
  console.log('createAccount() : ',  JSON.stringify(data))
```

### 1.3.2 getAccount

> 接口说明

   	该接口用于获取指定的账户信息。

> 调用方法

```js
account.getAccountBalance(param)
```

> 请求参数

| 参数     | 类型    | 描述                              |
| -------- | ------- | --------------------------------- |
| address  | String  | 必填，待查询的区块链账户地址      |
| domainId | Integer | 选填，指定域ID，默认主共识域id(0) |

> 响应数据

| 参数    | 类型   | 描述                                           |
| ------- | ------ | ---------------------------------------------- |
| address | String | 账户地址                                       |
| balance | Long   | 账户余额，单位PT，1 星火令 = 10^8 PT, 必须大于0 |
| nonce   | Long   | 账户交易序列号，必须大于0                      |

> 错误码

| 异常                   | 错误码 | 描述                                        |
| ---------------------- | ------ | ------------------------------------------- |
| INVALID_ADDRESS_ERROR  | 11006  | Invalid address                             |
| REQUEST_NULL_ERROR     | 12001  | Request parameter cannot be null            |
| CONNECTNETWORK_ERROR   | 11007  | Failed to connect to the network            |
| SYSTEM_ERROR           | 20000  | System error                                |
| INVALID_DOMAINID_ERROR | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
 // 初始化请求参数
    let param = {
        address: 'did:bid:eft6d191modv1cxBC43wjKHk85VVhQDc',
        domainId: '20'
    }
 	let data = await sdk.account.getAccountBalance(param)
    console.log('getAccountBalance() : ',  JSON.stringify(data))
```

### 1.3.3 getNonce

> 接口说明

   	该接口用于获取指定账户的nonce值。

> 调用方法

```js
getNonce(param)
```

> 请求参数

| 参数     | 类型    | 描述                              |
| -------- | ------- | --------------------------------- |
| address  | String  | 必填，待查询的区块链账户地址      |
| domainId | Integer | 选填，指定域ID，默认主共识域id(0) |

> 响应数据

| 参数  | 类型 | 描述           |
| ----- | ---- | -------------- |
| nonce | Long | 账户交易序列号 |

> 错误码

| 异常                   | 错误码 | 描述                                        |
| ---------------------- | ------ | ------------------------------------------- |
| INVALID_ADDRESS_ERROR  | 11006  | Invalid address                             |
| REQUEST_NULL_ERROR     | 12001  | Request parameter cannot be null            |
| CONNECTNETWORK_ERROR   | 11007  | Failed to connect to the network            |
| SYSTEM_ERROR           | 20000  | System error                                |
| INVALID_DOMAINID_ERROR | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
	// 初始化请求参数
    let param = {
        address: 'did:bid:eft6d191modv1cxBC43wjKHk85VVhQDc',
        domainId: '20'
    }
	let data = await sdk.account.getNonce(param)
 	console.log('getNonce() : ',  JSON.stringify(data))
```

### 1.3.4 getAccountBalance

> 接口说明

  	该接口用于获取指定账户的余额。

> 调用方法

```js
account.getAccountBalance(param)
```

> 请求参数

| 参数     | 类型    | 描述                              |
| -------- | ------- | --------------------------------- |
| address  | String  | 必填，待查询的区块链账户地址      |
| domainId | Integer | 选填，指定域ID，默认主共识域id(0) |

> 响应数据

| 参数    | 类型 | 描述 |
| ------- | ---- | ---- |
| balance | Long | 余额 |

> 错误码

| 异常                   | 错误码 | 描述                                        |
| ---------------------- | ------ | ------------------------------------------- |
| INVALID_ADDRESS_ERROR  | 11006  | Invalid address                             |
| REQUEST_NULL_ERROR     | 12001  | Request parameter cannot be null            |
| CONNECTNETWORK_ERROR   | 11007  | Failed to connect to the network            |
| SYSTEM_ERROR           | 20000  | System error                                |
| INVALID_DOMAINID_ERROR | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
    // 初始化请求参数
    let param = {
        address: 'did:bid:eft6d191modv1cxBC43wjKHk85VVhQDc',
        domainId: '20'
    }
    let data = await sdk.account.getAccountBalance(param)
    console.log('getAccountBalance() : ',  JSON.stringify(data))
```

### 1.3.5 setMetadatas

> 接口说明

   	该接口用于修改账户的metadatas信息。

> 调用方法

```js
account.setMetadatas(setMetadatasOperation)
```

> 请求参数

| 参数          | 类型    | 描述                                                         |
| ------------- | ------- | ------------------------------------------------------------ |
| senderAddress | string  | 必填，交易源账号，即交易的发起方                             |
| privateKey    | String  | 必填，交易源账户私钥                                         |
| ceilLedgerSeq | Long    | 选填，区块高度限制, 如果大于0，则交易只有在该区块高度之前（包括该高度）才有效 |
| remarks       | String  | 选填，用户自定义给交易的备注                                 |
| key           | String  | 必填，metadatas的关键词，长度限制[1, 1024]                   |
| value         | String  | 必填，metadatas的内容，长度限制[0, 256000]                   |
| version       | Long    | 选填，metadatas的版本                                        |
| deleteFlag    | Boolean | 选填，是否删除remarks                                        |
| gasPrice      | Long    | 选填，打包费用 (单位是PT)，默认100L                          |
| feeLimit      | Long    | 选填，交易花费的手续费(单位是PT)，默认1000000L               |
| domainId      | Integer | 选填，指定域ID，默认主共识域id(0)                            |

> 响应数据

| 参数 | 类型   | 描述     |
| ---- | ------ | -------- |
| hash | string | 交易hash |


> 错误码

| 异常                    | 错误码 | 描述                                             |
| ----------------------- | ------ | ------------------------------------------------ |
| INVALID_ADDRESS_ERROR   | 11006  | Invalid address                                  |
| REQUEST_NULL_ERROR      | 12001  | Request parameter cannot be null                 |
| PRIVATEKEY_NULL_ERROR   | 11057  | PrivateKeys cannot be empty                      |
| INVALID_DATAKEY_ERROR   | 11011  | The length of key must be between 1 and 1024     |
| INVALID_DATAVALUE_ERROR | 11012  | The length of value must be between 0 and 256000 |
| SYSTEM_ERROR            | 20000  | System error                                     |
| INVALID_DOMAINID_ERROR  | 12007  | Domainid must be equal to or greater than 0      |


> 示例

```js
    // 初始化请求参数
	let setMetadatasOperation = {
      sourceAddress:'did:bid:eft6d191modv1cxBC43wjKHk85VVhQDc',
      privateKey:'priSPKff1hvKVFYYFKSgfMb17wJ4dYZAHhLREarvh4Cy6fgn5b',
      remarks:'create account',
      key:'20211210',
      value:'metadata-20211210',
      version:'1',
      gasPrice:'',
      feeLimit:'',
      ceilLedgerSeq: '',
      domainId:'20'
    }
    let data = await sdk.account.setMetadatas(setMetadatasOperation)
    console.log('setMetadatas() : ',JSON.stringify(data))
```

### 1.3.6 getAccountMetadatas

> 接口说明

   	该接口用于获取指定账户的metadatas信息。

> 调用方法

```js
account.getMetadatas(getMetadatasOperation)
```

> 请求参数

| 参数     | 类型    | 描述                                                         |
| -------- | ------- | ------------------------------------------------------------ |
| address  | String  | 必填，待查询的账户地址                                       |
| key      | String  | 选填，metadatas关键字，长度限制[1, 1024]，有值为精确查找，无值为全部查找 |
| domainId | Integer | 选填，指定域ID，默认主共识域id(0)                            |

> 响应数据

| 参数                 | 类型     | 描述              |
| -------------------- | -------- | ----------------- |
| metadatas            | object[] | 账户              |
| metadatas[i].key     | String   | metadatas的关键词 |
| metadatas[i].value   | String   | metadatas的内容   |
| metadatas[i].version | Long     | metadatas的版本   |


> 错误码

| 异常                   | 错误码 | 描述                                         |
| ---------------------- | ------ | -------------------------------------------- |
| INVALID_ADDRESS_ERROR  | 11006  | Invalid address                              |
| REQUEST_NULL_ERROR     | 12001  | Request parameter cannot be null             |
| CONNECTNETWORK_ERROR   | 11007  | Failed to connect to the network             |
| NO_METADATAS_ERROR     | 11010  | The account does not have the metadatas      |
| INVALID_DATAKEY_ERROR  | 11011  | The length of key must be between 1 and 1024 |
| SYSTEM_ERROR           | 20000  | System error                                 |
| INVALID_DOMAINID_ERROR | 12007  | Domainid must be equal to or greater than 0  |


> 示例

```js
    // 初始化请求参数
	let data = await sdk.account.getMetadatas({
          address: 'did:bid:eft6d191modv1cxBC43wjKHk85VVhQDc',
          key: '20211208',
          domainId: '20' 
      })
    console.log('getMetadatas() : ',JSON.stringify(data))
```

### 1.3.7 setPrivilege

> 接口说明

   	该接口用于设置权限。

> 调用方法

```js
setPrivilege(accountSetPrivilegeOperation)
```

> 请求参数

| 参数                    | 类型    | 描述                                                         |
| ----------------------- | ------- | ------------------------------------------------------------ |
| senderAddress           | string  | 必填，交易源账号，即交易的发起方                             |
| privateKey              | String  | 必填，交易源账户私钥                                         |
| ceilLedgerSeq           | Long    | 选填，区块高度限制, 如果大于0，则交易只有在该区块高度之前（包括该高度）才有效 |
| remarks                 | String  | 选填，用户自定义给交易的备注                                 |
| signers                 | list    | 选填，签名者权重列表                                         |
| signers.address         | String  | 签名者区块链账户地址                                         |
| signers.weight          | Long    | 为签名者设置权重值                                           |
| txThreshold             | String  | 选填，交易门限，大小限制[0, Long.MAX_VALUE]                  |
| typeThreshold           | list    | 选填，指定类型交易门限                                       |
| typeThreshold.type      | Long    | 操作类型，必须大于0                                          |
| typeThreshold.threshold | Long    | 门限值，大小限制[0, Long.MAX_VALUE]                          |
| masterWeight            | String  | 选填                                                         |
| gasPrice                | Long    | 选填，打包费用 (单位是PT)，默认100L                          |
| feeLimit                | Long    | 选填，交易花费的手续费(单位是PT)，默认1000000L               |
| domainId                | Integer | 选填，指定域ID，默认主共识域id(0)                            |

> 响应数据

| 参数 | 类型   | 描述     |
| ---- | ------ | -------- |
| hash | string | 交易hash |


> 错误码

| 异常                   | 错误码 | 描述                                        |
| ---------------------- | ------ | ------------------------------------------- |
| INVALID_ADDRESS_ERROR  | 11006  | Invalid address                             |
| REQUEST_NULL_ERROR     | 12001  | Request parameter cannot be null            |
| PRIVATEKEY_NULL_ERROR  | 11057  | PrivateKeys cannot be empty                 |
| SYSTEM_ERROR           | 20000  | System error                                |
| INVALID_DOMAINID_ERROR | 12007  | Domainid must be equal to or greater than 0 |


> 示例

```js
	// 初始化请求参数
	let accountSetPrivilegeOperation = {
     sourceAddress:'did:bid:efMrjMzYWUBBLZBwgsWtxEvdfQe5wejB',
     privateKey:'priSPKqYp19ghxeCykHUrepLRkCRD3a2a9y5MJGF8Kc4qfn2aK',
     txThreshold:'8',
     signers: [{
        address: 'did:bid:ef284xXpJLySqXnMcaLVkFWTJyJ6VhpxG',
        weight: '55'
      }],
     typeThresholds: [{
       type: '5',
       threshold: '51',
     }],
     feeLimit: '',
     gasPrice: '',
     ceilLedgerSeq: '',
     domainId: '20'
   }
   let data = await sdk.account.setPrivilege(accountSetPrivilegeOperation)
    console.log('setPrivilege() : ',JSON.stringify(data))
```

### 1.3.8 getAccountPriv

> 接口说明

   	该接口用于获取指定的账户权限信息。

> 调用方法

```js
account.getAccountPriv(param)
```

> 请求参数

| 参数     | 类型    | 描述                              |
| -------- | ------- | --------------------------------- |
| address  | String  | 必填，待查询的区块链账户地址      |
| domainId | Integer | 选填，指定域ID，默认主共识域id(0) |

> 响应数据

| 参数                                        | 类型     | 描述                   |
| ------------------------------------------- | -------- | ---------------------- |
| address                                     | String   | 账户地址               |
| priv                                        | Object   | 账户权限               |
| Priv.masterWeight                           | Object   | 账户自身权重，大小限制 |
| Priv.signers                                | Object   | 签名者权重列表         |
| Priv.signers[i].address                     | String   | 签名者区块链账户地址   |
| Priv.signers[i].weight                      | Long     | 签名者权重，大小限制   |
| Priv.Thresholds                             | Object   |                        |
| Priv.Thresholds.txThreshold                 | Long     | 交易默认门限，大小限制 |
| Priv.Thresholds.typeThresholds              | Object[] | 不同类型交易的门限     |
| Priv.Thresholds.typeThresholds[i].type      | Long     | 操作类型，必须大于0    |
| Priv.Thresholds.typeThresholds[i].threshold | Long     | 门限值，大小限制       |

> 错误码

| 异常                   | 错误码 | 描述                                        |
| ---------------------- | ------ | ------------------------------------------- |
| INVALID_ADDRESS_ERROR  | 11006  | Invalid address                             |
| REQUEST_NULL_ERROR     | 12001  | Request parameter cannot be null            |
| CONNECTNETWORK_ERROR   | 11007  | Failed to connect to the network            |
| SYSTEM_ERROR           | 20000  | System error                                |
| INVALID_DOMAINID_ERROR | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
    // 初始化请求参数
    let param = {
        address: 'did:bid:efMrjMzYWUBBLZBwgsWtxEvdfQe5wejB',
        domainId: '20'
    }
    let data = await sdk.account.getAccountPriv(param)
    console.log('getAccountPriv() : ',  JSON.stringify(data))
```

## 1.4 合约服务接口列表

​		合约服务接口主要是合约相关的接口，目前有6个接口：

| 序号 | 接口                 | 说明                               |
| ---- | -------------------- | ---------------------------------- |
| 1    | checkContractAddress | 该接口用于检测合约账户的有效性     |
| 2    | contractCreate       | 创建合约                           |
| 3    | getContractInfo      | 该接口用于查询合约代码             |
| 4    | getContractAddress   | 该接口用于根据交易Hash查询合约地址 |
| 5    | contractQuery        | 该接口用于调试合约代码             |
| 6    | contractInvoke       | 合约调用                           |
| 7    | batchContractInvoke  | 批量合约调用                       |

### 1.4.1 checkContractAddress

> 接口说明

   	该接口用于检测合约账户的有效性。

> 调用方法

```js
contract.checkContractAddress(param)
```

> 请求参数

| 参数            | 类型    | 描述                              |
| --------------- | ------- | --------------------------------- |
| contractAddress | String  | 待检测的合约账户地址              |
| domainId        | Integer | 选填，指定域ID，默认主共识域id(0) |

> 响应数据

| 参数    | 类型    | 描述     |
| ------- | ------- | -------- |
| isValid | Boolean | 是否有效 |

> 错误码

| 异常                          | 错误码 | 描述                                        |
| ----------------------------- | ------ | ------------------------------------------- |
| INVALID_CONTRACTADDRESS_ERROR | 11037  | Invalid contract address                    |
| REQUEST_NULL_ERROR            | 12001  | Request parameter cannot be null            |
| SYSTEM_ERROR                  | 20000  | System error                                |
| INVALID_DOMAINID_ERROR        | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
    // 初始化请求参数
    let param = {
        contractAddress: 'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu',
        domainId: '20'
    }
    let data = await sdk.contract.checkContractAddress(param)
    console.log('checkContractAddress() : ',  JSON.stringify(data))
```

### 1.4.2 contractCreate

> 接口说明

   	该接口用于创建合约。

> 调用方法

```js
contract.createContract(createContractOperation)
```

> 请求参数

| 参数          | 类型    | 描述                                                         |
| ------------- | ------- | ------------------------------------------------------------ |
| senderAddress | string  | 必填，交易源账号，即交易的发起方                             |
| feeLimit      | Long    | 选填，交易花费的手续费(单位是PT)，默认1000000L               |
| privateKey    | String  | 必填，交易源账户私钥                                         |
| ceilLedgerSeq | Long    | 选填，区块高度限制, 如果大于0，则交易只有在该区块高度之前（包括该高度）才有效 |
| remarks       | String  | 选填，用户自定义给交易的备注                                 |
| initBalance   | Long    | 必填，给合约账户的初始化星火令，单位PT，1 星火令 = 10^8 PT, 大小限制[1, Long.MAX_VALUE] |
| type          | Integer | 选填，合约的类型，默认是0 , 0: javascript，1 :evm 。         |
| payload       | String  | 必填，对应语种的合约代码                                     |
| initInput     | String  | 选填，合约代码中init方法的入参                               |
| gasPrice      | Long    | 选填，打包费用 (单位是PT)，默认100L                          |
| domainId      | Integer | 选填，指定域ID，默认主共识域id(0)                            |

> 响应数据

| 参数 | 类型   | 描述     |
| ---- | ------ | -------- |
| hash | string | 交易hash |


> 错误码

| 异常                      | 错误码 | 描述                                             |
| ------------------------- | ------ | ------------------------------------------------ |
| INVALID_ADDRESS_ERROR     | 11006  | Invalid address                                  |
| REQUEST_NULL_ERROR        | 12001  | Request parameter cannot be null                 |
| PRIVATEKEY_NULL_ERROR     | 11057  | PrivateKeys cannot be empty                      |
| INVALID_INITBALANCE_ERROR | 11004  | InitBalance must be between 1 and Long.MAX_VALUE |
| PAYLOAD_EMPTY_ERROR       | 11044  | Payload cannot be empty                          |
| INVALID_FEELIMIT_ERROR    | 11050  | FeeLimit must be between 0 and Long.MAX_VALUE    |
| SYSTEM_ERROR              | 20000  | System error                                     |
| INVALID_DOMAINID_ERROR    | 12007  | Domainid must be equal to or greater than 0      |


> 示例

```js
    // 初始化请求参数
	let createContractOperation = {
        sourceAddress:'did:bid:efQMuPahc3zm7abBUBfj22xZokhZ7rED',
        privateKey:'priSPKqSR8vTVJ1y8Wu1skBNWMHPeu8nkaerZNKEzkRq3KJix4',
        payload:"\"use strict\";function init(bar){/*init whatever you want*/return;}function main(input){let para = JSON.parse(input);if (para.do_foo)\n            {\n              let x = {\n                \'hello\' : \'world\'\n              };\n            }\n          }\n          \n          function query(input)\n          { \n            return input;\n          }\n        ",
        initBalance:'1',
        remarks:'create account',
        type:0,
        feeLimit:'100100000',
        gasPrice:'',
        ceilLedgerSeq:'',
        initInput:'',
        domainId: '20'
    }
    let data = await sdk.contract.createContract(createContractOperation)
    console.log('createContract() : ',  JSON.stringify(data))
```

### 1.4.3 getContractInfo

> 接口说明

   	该接口用于查询合约代码。

> 调用方法

```js
contract.getContractInfo(param)
```

> 请求参数

| 参数            | 类型    | 描述                              |
| --------------- | ------- | --------------------------------- |
| contractAddress | String  | 待查询的合约账户地址              |
| domainId        | Integer | 选填，指定域ID，默认主共识域id(0) |

> 响应数据

| 参数             | 类型    | 描述            |
| ---------------- | ------- | --------------- |
| contract         | object  | 合约信息        |
| contract.type    | Integer | 合约类型，默认0 |
| contract.payload | String  | 合约代码        |

> 错误码

| 异常                                      | 错误码 | 描述                                        |
| ----------------------------------------- | ------ | ------------------------------------------- |
| INVALID_CONTRACTADDRESS_ERROR             | 11037  | Invalid contract address                    |
| CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR | 11038  | contractAddress is not a contract account   |
| NO_SUCH_TOKEN_ERROR                       | 11030  | No such token                               |
| GET_TOKEN_INFO_ERROR                      | 11066  | Failed to get token info                    |
| REQUEST_NULL_ERROR                        | 12001  | Request parameter cannot be null            |
| SYSTEM_ERROR                              | 20000  | System error                                |
| INVALID_DOMAINID_ERROR                    | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
    // 初始化请求参数
    let param = {
        contractAddress: 'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu',
        domainId: '20'
    }
    let data = await sdk.contract.getContractInfo(param)
    console.log('getContractInfo() : ',  JSON.stringify(data))
```

### 1.4.4 getContractAddress

> 接口说明

```
该接口用于根据交易Hash查询合约地址。
```

> 调用方法

```js
contract.getContractAddress(param)
```

> 请求参数

| 参数     | 类型    | 描述                              |
| -------- | ------- | --------------------------------- |
| hash     | String  | 创建合约交易的hash                |
| domainId | Integer | 选填，指定域ID，默认主共识域id(0) |

> 响应数据

| 参数                                     | 类型                      | 描述           |
| ---------------------------------------- | ------------------------- | -------------- |
| contractAddressInfos                     | List<ContractAddressInfo> | 合约地址列表   |
| contractAddressInfos[i].contract_address | String                    | 合约地址       |
| contractAddressInfos[i].operation_index  | Integer                   | 所在操作的下标 |

> 错误码

| 异常                   | 错误码 | 描述                                        |
| ---------------------- | ------ | ------------------------------------------- |
| INVALID_HASH_ERROR     | 11055  | Invalid transaction hash                    |
| CONNECTNETWORK_ERROR   | 11007  | Failed to connect to the network            |
| REQUEST_NULL_ERROR     | 12001  | Request parameter cannot be null            |
| SYSTEM_ERROR           | 20000  | System error                                |
| INVALID_DOMAINID_ERROR | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
    // 初始化请求参数
    let param = {
        hash: '59228dfa8fcd1e65b918dbe30096302f3a4b136d2762200029ed397496f96ada',
        domainId: '20'
    }
    let data = await sdk.contract.getContractAddress(param)
    console.log('getContractAddress() : ',  JSON.stringify(data))
```

### 1.4.5 contractQuery

> 接口说明

   	该接口用于调用合约查询接口。

> 调用方法

```js
contract.contractQuery(contractQueryOperation)
```

> 请求参数

| 参数            | 类型    | 描述                                           |
| --------------- | ------- | ---------------------------------------------- |
| sourceAddress   | String  | 选填，合约触发账户地址                         |
| contractAddress | String  | 必填，合约账户地址                             |
| input           | String  | 选填，合约入参                                 |
| gasPrice        | Long    | 选填，打包费用 (单位是PT)，默认100L            |
| feeLimit        | Long    | 选填，交易花费的手续费(单位是PT)，默认1000000L |
| domainId        | Integer | 选填，指定域ID，默认主共识域id(0)              |


> 响应数据

| 参数      | 类型      | 描述       |
| --------- | --------- | ---------- |
| queryRets | JSONArray | 查询结果集 |

> 错误码

| 异常                                      | 错误码 | 描述                                             |
| ----------------------------------------- | ------ | ------------------------------------------------ |
| INVALID_SOURCEADDRESS_ERROR               | 11002  | Invalid sourceAddress                            |
| INVALID_CONTRACTADDRESS_ERROR             | 11037  | Invalid contract address                         |
| SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR | 11040  | SourceAddress cannot be equal to contractAddress |
| REQUEST_NULL_ERROR                        | 12001  | Request parameter cannot be null                 |
| CONNECTNETWORK_ERROR                      | 11007  | Failed to connect to the network                 |
| SYSTEM_ERROR                              | 20000  | System error                                     |
| INVALID_DOMAINID_ERROR                    | 12007  | Domainid must be equal to or greater than 0      |

> 示例

```js
    // 初始化请求参数
	let contractQueryOperation = {
        sourceAddress:'',
        contractAddress:'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu',
        input:'',
        feeLimit: '',
        gasPrice: '',
        domainId: '20'
    }
    let data = await sdk.contract.contractQuery(contractQueryOperation)
    console.log('contractQuery() : ',  JSON.stringify(data))
```

### 1.4.6 contractInvoke

> 接口说明

   	该接口用于合约调用。

> 调用方法

```js
contract.contractInvoke(contractInvokeOperation)
```

> 请求参数

| 参数            | 类型    | 描述                                                         |
| --------------- | ------- | ------------------------------------------------------------ |
| senderAddress   | string  | 必填，交易源账号，即交易的发起方                             |
| feeLimit        | Long    | 选填，交易花费的手续费(单位是PT)，默认1000000L               |
| privateKey      | String  | 必填，交易源账户私钥                                         |
| ceilLedgerSeq   | Long    | 选填，区块高度限制, 如果大于0，则交易只有在该区块高度之前（包括该高度）才有效 |
| remarks         | String  | 选填，用户自定义给交易的备注                                 |
| contractAddress | String  | 必填，合约账户地址                                           |
| amount          | Long    | 必填，转账金额                                               |
| input           | String  | 选填，待触发的合约的main()入参                               |
| gasPrice        | Long    | 选填，打包费用 (单位是PT)，默认100L                          |
| domainId        | Integer | 选填，指定域ID，默认主共识域id(0)                            |

> 响应数据

| 参数 | 类型   | 描述     |
| ---- | ------ | -------- |
| hash | string | 交易hash |


> 错误码

| 异常                          | 错误码 | 描述                                          |
| ----------------------------- | ------ | --------------------------------------------- |
| INVALID_ADDRESS_ERROR         | 11006  | Invalid address                               |
| REQUEST_NULL_ERROR            | 12001  | Request parameter cannot be null              |
| PRIVATEKEY_NULL_ERROR         | 11057  | PrivateKeys cannot be empty                   |
| INVALID_CONTRACTADDRESS_ERROR | 11037  | Invalid contract address                      |
| INVALID_AMOUNT_ERROR          | 11024  | Amount must between 0 and max(int64)          |
| INVALID_FEELIMIT_ERROR        | 11050  | FeeLimit must be between 0 and Long.MAX_VALUE |
| SYSTEM_ERROR                  | 20000  | System error                                  |
| INVALID_GASPRICE_ERROR        | 11049  | GasPrice must be between 0 and Long.MAX_VALUE |
| INVALID_DOMAINID_ERROR        | 12007  | Domainid must be equal to or greater than 0   |


> 示例

```js
    // 初始化请求参数
	let contractInvokeOperation = {
        sourceAddress:'did:bid:efQMuPahc3zm7abBUBfj22xZokhZ7rED',
        privateKey:'priSPKqSR8vTVJ1y8Wu1skBNWMHPeu8nkaerZNKEzkRq3KJix4',
        contractAddress:'did:bid:efL7d2Ak1gyUpU4eiM3C9oxvbkhXr4Mu',
        ceilLedgerSeq:'',
        feeLimit:'',
        gasPrice: '',
        remarks:'contractInvoke',
        amount:0,
        input:'',
        domainId: '20'
    }
    let data = await sdk.contract.contractInvoke(contractInvokeOperation)
    console.log('contractInvoke() : ',  JSON.stringify(data))
```

### 1.4.7 batchContractInvoke

> 接口说明

   	该接口用于批量合约调用。

> 调用方法

```java
contract.batchContractInvoke(contractInvokeRequestOperation)
```

> 请求参数

| 参数          | 类型                             | 描述                                                         |
| ------------- | -------------------------------- | ------------------------------------------------------------ |
| senderAddress | string                           | 必填，交易源账号，即交易的发起方                             |
| gasPrice      | Long                             | 选填，打包费用 (单位是PT)默认，默认100L                      |
| feeLimit      | Long                             | 选填，交易花费的手续费(单位是PT)，默认1000000L               |
| privateKey    | String                           | 必填，交易源账户私钥                                         |
| ceilLedgerSeq | Long                             | 选填，区块高度限制, 如果大于0，则交易只有在该区块高度之前（包括该高度）才有效 |
| remarks       | String                           | 选填，用户自定义给交易的备注                                 |
| domainId      | Integer                          | 选填，指定域ID，默认主共识域id(0)                            |
| operations    | List<BIFContractInvokeOperation> | 必填，合约调用集合                                           |

| BIFContractInvokeOperation |        |                                |
| -------------------------- | ------ | ------------------------------ |
| contractAddress            | String | 必填，合约账户地址             |
| BIFAmount                  | Long   | 必填，转账金额                 |
| input                      | String | 选填，待触发的合约的main()入参 |



> 响应数据

| 参数 | 类型   | 描述     |
| ---- | ------ | -------- |
| hash | string | 交易hash |


> 错误码

| 异常                          | 错误码 | 描述                                          |
| ----------------------------- | ------ | --------------------------------------------- |
| INVALID_ADDRESS_ERROR         | 11006  | Invalid address                               |
| REQUEST_NULL_ERROR            | 12001  | Request parameter cannot be null              |
| PRIVATEKEY_NULL_ERROR         | 11057  | PrivateKeys cannot be empty                   |
| INVALID_CONTRACTADDRESS_ERROR | 11037  | Invalid contract address                      |
| INVALID_AMOUNT_ERROR          | 11024  | Amount must be between 0 and Long.MAX_VALUE   |
| INVALID_FEELIMIT_ERROR        | 11050  | FeeLimit must be between 0 and Long.MAX_VALUE |
| SYSTEM_ERROR                  | 20000  | System error                                  |


> 示例

```js
     let senderAddress = 'did:bid:efnVUgqQFfYeu97ABf6sGm3WFtVXHZB2'
    let senderPrivateKey = 'priSPKkWVk418PKAS66q4bsiE2c4dKuSSafZvNWyGGp2sJVtXL'
    let contractAddress = 'did:bid:efHtDebBjqEsgEVqyiwvHwdPWSnHmkzy'
    let amount = '0'
    const destAddress1 = sdk.keypair.getBidAndKeyPair().encAddress
    const destAddress2 = sdk.keypair.getBidAndKeyPair().encAddress
    let input1 = '{"method":"creation","params":{"document":{"@context": ["https://w3.org/ns/did/v1"],"context": "https://w3id.org/did/v1","id": "' + destAddress1 + '", "version": "1"}}}'
    let input2 = '{"method":"creation","params":{"document":{"@context": ["https://w3.org/ns/did/v1"],"context": "https://w3id.org/did/v1","id": "' + destAddress2 + '", "version": "1"}}}'

    let operations = []
    let contractInvokeOperation1 = {
        contractAddress: contractAddress,
        amount: amount,
        input: input1
    }
    let contractInvokeOperation2 = {
        contractAddress: contractAddress,
        amount: amount,
        input: input2
    }
    operations.push(contractInvokeOperation1)
    operations.push(contractInvokeOperation2)

    let contractInvokeRequestOperation = sdk.operaction.contractInvokeRequestOperation
    contractInvokeRequestOperation.setSenderAddress(senderAddress)
    contractInvokeRequestOperation.setPrivateKey(senderPrivateKey)
    contractInvokeRequestOperation.setRemarks('contract invoke')
    contractInvokeRequestOperation.setDomainId('0')
    contractInvokeRequestOperation.setCeilLedgerSeq('')
    contractInvokeRequestOperation.setOperations(operations)
    let data = await sdk.contract.batchContractInvoke(contractInvokeRequestOperation)
    console.log('batchContractInvoke() : ', JSON.stringify(data))
```



## 1.5 交易服务接口列表

​		交易服务接口主要是交易相关的接口，目前有4个接口：

| 序号 | 接口               | 说明                               |
| ---- | ------------------ | ---------------------------------- |
| 1    | gasSend            | 交易                               |
| 2    | getTransactionInfo | 该接口用于实现根据交易hash查询交易 |
| 3    | evaluateFee        | 该接口用于交易费用评估             |
| 4    | BIFSubmit          | 提交交易                           |
| 5    | getTxCacheSize     | 该接口用于获取交易池中交易条数     |
| 6    | batchEvaluateFee   | 该接口为批量费用评估接口           |
| 7    | getTxCacheData     | 该接口用于获取交易池中交易数据     |
| 8    | parseBlob          | blob数据解析                       |

### 1.5.1 gasSend

> 接口说明

   	该接口用于发起交易。

> 调用方法

```js
transaction.gasSend(gasSendOperation)
```

> 请求参数

| 参数          | 类型    | 描述                                                         |
| ------------- | ------- | ------------------------------------------------------------ |
| senderAddress | string  | 必填，交易源账号，即交易的发起方                             |
| privateKey    | String  | 必填，交易源账户私钥                                         |
| ceilLedgerSeq | Long    | 选填，区块高度限制, 如果大于0，则交易只有在该区块高度之前（包括该高度）才有效 |
| remarks       | String  | 选填，用户自定义给交易的备注                                 |
| destAddress   | String  | 必填，发起方地址                                             |
| amount        | Long    | 必填，转账金额                                               |
| gasPrice      | Long    | 选填，打包费用 (单位是PT)，默认100L                          |
| feeLimit      | Long    | 选填，交易花费的手续费(单位是PT)，默认1000000L               |
| domainId      | Integer | 选填，指定域ID，默认主共识域id(0)                            |

> 响应数据

| 参数 | 类型   | 描述     |
| ---- | ------ | -------- |
| hash | string | 交易hash |


> 错误码

| 异常                      | 错误码 | 描述                                           |
| ------------------------- | ------ | ---------------------------------------------- |
| INVALID_ADDRESS_ERROR     | 11006  | Invalid address                                |
| REQUEST_NULL_ERROR        | 12001  | Request parameter cannot be null               |
| PRIVATEKEY_NULL_ERROR     | 11057  | PrivateKeys cannot be empty                    |
| INVALID_DESTADDRESS_ERROR | 11003  | Invalid destAddress                            |
| INVALID_GAS_AMOUNT_ERROR  | 11026  | BIFAmount must be between 0 and Long.MAX_VALUE |
| SYSTEM_ERROR              | 20000  | System error                                   |
| INVALID_DOMAINID_ERROR    | 12007  | Domainid must be equal to or greater than 0    |


> 示例

```js
    // 初始化请求参数
    let gasSendOperation = {
        sourceAddress:'did:bid:efnVUgqQFfYeu97ABf6sGm3WFtVXHZB2',
        privateKey:'priSPKkWVk418PKAS66q4bsiE2c4dKuSSafZvNWyGGp2sJVtXL',
        destAddress:'did:bid:efYhALrHoHiaVnoZgRgJbCghZZdzkQUh',
        remarks:'gasSend',
        amount:'100000000',
        ceilLedgerSeq:'',
        feeLimit: '',
        gasPrice: '',
        domainId: '20'
    }
    let data = await sdk.transaction.gasSend(gasSendOperation)
    console.log('gasSend() : ',  JSON.stringify(data))
```

### 1.5.2 getTransactionInfo

> 接口说明

   	该接口用于实现根据交易hash查询交易。

> 调用方法

```js
transaction.getTransactionInfo(param)
```

> 请求参数

| 参数     | 类型    | 描述                              |
| -------- | ------- | --------------------------------- |
| hash     | String  | 交易hash                          |
| domainId | Integer | 选填，指定域ID，默认主共识域id(0) |

> 响应数据

| 参数                               | 类型               | 描述           |
| ---------------------------------- | ------------------ | -------------- |
| totalCount                         | Long               | 返回的总交易数 |
| transactions                       | TransactionHistory | 交易内容       |
| transactions.actual_fee            | String             | 交易实际费用   |
| transactions.close_time            | Long               | 交易确认时间   |
| transactions.error_code            | Long               | 交易错误码     |
| transactions.error_desc            | String             | 交易描述       |
| transactions.hash                  | String             | 交易hash       |
| transactions.ledger_seq            | Long               | 区块序列号     |
| transactions.transaction           | TransactionInfo    | 交易内容列表   |
| transactions.signatures            | Signature          | 签名列表       |
| transactions.signatures.sign_data  | Long               | 签名后数据     |
| transactions.signatures.public_key | Long               | 公钥           |
| transactions.tx_size: 303          | Long               | 交易大小       |

> 错误码

| 异常                   | 错误码 | 描述                                        |
| ---------------------- | ------ | ------------------------------------------- |
| INVALID_HASH_ERROR     | 11055  | Invalid transaction hash                    |
| REQUEST_NULL_ERROR     | 12001  | Request parameter cannot be null            |
| CONNECTNETWORK_ERROR   | 11007  | Failed to connect to the network            |
| SYSTEM_ERROR           | 20000  | System error                                |
| INVALID_DOMAINID_ERROR | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
    // 初始化请求参数
    let param = {
        hash: '0390905e5970f1bf262b37fc11d7b2b4b5e28d9a33006584c4940c60fd283518',
        domainId: '20'
    }
    let data = await sdk.transaction.getTransactionInfo(param)
    console.log('getTransactionInfo() : ',  JSON.stringify(data))
```

### 1.5.3 evaluateFee

> 接口说明

   	该接口用于交易费用评估。

> 调用方法

```js
transaction.evaluateFee(info)
```

> 请求参数

| 参数          | 类型                    | 描述                              |
| ------------- | ----------------------- | --------------------------------- |
| senderAddress | string                  | 必填，交易源账号，即交易的发起方  |
| privateKey    | String                  | 必填，交易源账户私钥              |
| operations    | [Operation](#Operation) | 必填，待提交的操作，不能为空      |
| gasPrice      | Long                    | 必填，打包费用 (单位是PT)         |
| feeLimit      | Long                    | 选填，交易花费的手续费(单位是PT)  |
| domainId      | Integer                 | 选填，指定域ID，默认主共识域id(0) |

#### Operation

| 序号 | 操作                         | 描述                         |
| ---- | ---------------------------- | ---------------------------- |
| 1    | accountCreateOperation       | 生成主链数字身份             |
| 2    | accountSetMetadataOperation  | 修改账户的metadatas信息      |
| 3    | accountSetPrivilegeOperation | 设置权限                     |
| 4    | contractCreateOperation      | 创建合约（暂不支持EVM 合约） |
| 5    | contractInvokeOperation      | 合约调用（暂不支持EVM 合约） |
| 6    | gasSendOperation             | 发起交易                     |

> 响应数据

| 参数     | 类型 | 描述               |
| -------- | ---- | ------------------ |
| feeLimit | Long | 交易要求的最低费用 |
| gasPrice | Long | 交易燃料单价       |

> 错误码

| 异常                          | 错误码 | 描述                                                    |
| ----------------------------- | ------ | ------------------------------------------------------- |
| INVALID_SOURCEADDRESS_ERROR   | 11002  | Invalid sourceAddress                                   |
| OPERATIONS_EMPTY_ERROR        | 11051  | Operations cannot be empty                              |
| OPERATIONS_ONE_ERROR          | 11053  | One of the operations cannot be resolved                |
| INVALID_SIGNATURENUMBER_ERROR | 11054  | SignagureNumber must be between 1 and Integer.MAX_VALUE |
| REQUEST_NULL_ERROR            | 12001  | Request parameter cannot be null                        |
| SYSTEM_ERROR                  | 20000  | System error                                            |
| INVALID_DOMAINID_ERROR        | 12007  | Domainid must be equal to or greater than 0             |



> 示例

```js
     // 初始化参数
    let privateContractCallOperation=sdk.operaction.privateContractCallOperation
    privateContractCallOperation.setType(0)
    privateContractCallOperation.setFrom('bDRE8iIfGdwDeQOcJqZabZQH5Nd6cfTOMOorudtgXjQ=')
    privateContractCallOperation.setTo(['bwPdcwfUEtSZnaDmi2Nvj9HTwOcRvCRDh0cRdvX9BFw='])
    privateContractCallOperation.setDestAddress('did:bid:efGSDpr4Fo4TEnHx1kBBSgSAfTt85kY6')
    privateContractCallOperation.setInput('{\"method\":\"queryBanance\",\"params\":{\"address\":\"567890哈哈=======\"}}')
 	
    let request = {
        sourceAddress: 'did:bid:efAsXt5zM2Hsq6wCYRMZBS5Q9HvG2EmK',
        privateKey: 'priSPKUudyVAi5WrhHJU1vCJZYyBL5DNd36MPhbYgHuDPz5E7r',
        operations: privateContractCallOperation,
        feeLimit: '',
        gasPrice: '',
        domainId: '20'
    }
    let data = await sdk.transaction.evaluateFee(request)
    console.log('evaluateFee() : ',  JSON.stringify(data))

```



### 1.5.4 BIFSubmit

> 接口说明

   	该接口用于交易提交。

> 调用方法

```js
transaction.submitTrans(serialization,signData)
```

> 请求参数

| 参数          | 类型   | 描述               |
| ------------- | ------ | ------------------ |
| serialization | String | 必填，交易序列化值 |
| signData      | String | 必填，签名数据     |
| privateKey    | String | 必填，签名者私钥   |

> 响应数据

| 参数 | 类型   | 描述     |
| ---- | ------ | -------- |
| hash | String | 交易hash |

> 错误码

| 异常                        | 错误码 | 描述                             |
| --------------------------- | ------ | -------------------------------- |
| INVALID_SERIALIZATION_ERROR | 11056  | Invalid serialization            |
| SIGNATURE_EMPTY_ERROR       | 11067  | The signatures cannot be empty   |
| SIGNDATA_NULL_ERROR         | 11059  | SignData cannot be empty         |
| PUBLICKEY_NULL_ERROR        | 11061  | PublicKey cannot be empty        |
| REQUEST_NULL_ERROR          | 12001  | Request parameter cannot be null |
| SYSTEM_ERROR                | 20000  | System error                     |

> 示例

```js
   // 初始化参数
    let serialization = 'sss'
    let privateKey = 'priSPKqYp19ghxeCykHUrepLRkCRD3a2a9y5MJGF8Kc4qfn2aK'
    // sign serialization
    let signData = sdk.transaction.signTransSerialization([ privateKey ]
    ,serialization)
    console.log('signData : ',  signData)
    //  submit transaction
    let transactionInfo = await sdk.transaction.submitTrans(
        serialization,
        signData
    })
    console.log('BIFSubmit() : ',  JSON.stringify(transactionInfo))

```

### 1.5.5 getTxCacheSize

> 接口说明

   	该接口用于获取交易池中交易条数。

> 调用方法

```js
transaction.getTxCacheSize(domainId)
```

 > 请求参数

| 参数     | 类型    | 描述                              |
| -------- | ------- | --------------------------------- |
| domainId | Integer | 选填，指定域ID，默认主共识域id(0) |

 > 响应数据

| 参数       | 类型 | 描述                 |
| ---------- | ---- | -------------------- |
| queue_size | Long | 返回交易池中交易条数 |

> 错误码

| 异常                 | 错误码 | 描述                             |
| -------------------- | ------ | -------------------------------- |
| CONNECTNETWORK_ERROR | 11007  | Failed to connect to the network |
| SYSTEM_ERROR         | 20000  | System error                     |

> 示例

```js
    it('test getTxCacheSize', async () => {
        let domainId='20'
        let data = await sdk.transaction.getTxCacheSize(domainId)
        console.log('getTxCacheSize() : ', JSON.stringify(data))
    })
```

### 1.5.6 batchEvaluateFee

> 接口说明

   	该接口为批量费用评估接口。

> 调用方法

```js
transaction.batchEvaluateFee(request)
```

> 请求参数

| 参数          | 类型                    | 描述                              |
| ------------- | ----------------------- | --------------------------------- |
| senderAddress | string                  | 必填，交易源账号，即交易的发起方  |
| privateKey    | String                  | 必填，交易源账户私钥              |
| operations    | [Operation](#Operation) | 必填，待提交的操作，不能为空      |
| gasPrice      | Long                    | 必填，打包费用 (单位是PT)         |
| feeLimit      | Long                    | 选填，交易花费的手续费(单位是PT)  |
| domainId      | Integer                 | 选填，指定域ID，默认主共识域id(0) |

#### Operation

| 序号 | 操作                    | 描述                         |
| ---- | ----------------------- | ---------------------------- |
| 1    | contractInvokeOperation | 合约调用（暂不支持EVM 合约） |

> 响应数据

| 参数     | 类型 | 描述               |
| -------- | ---- | ------------------ |
| feeLimit | Long | 交易要求的最低费用 |
| gasPrice | Long | 交易燃料单价       |

> 错误码

| 异常                          | 错误码 | 描述                                                    |
| ----------------------------- | ------ | ------------------------------------------------------- |
| INVALID_SOURCEADDRESS_ERROR   | 11002  | Invalid sourceAddress                                   |
| OPERATIONS_EMPTY_ERROR        | 11051  | Operations cannot be empty                              |
| OPERATIONS_ONE_ERROR          | 11053  | One of the operations cannot be resolved                |
| INVALID_SIGNATURENUMBER_ERROR | 11054  | SignagureNumber must be between 1 and Integer.MAX_VALUE |
| REQUEST_NULL_ERROR            | 12001  | Request parameter cannot be null                        |
| SYSTEM_ERROR                  | 20000  | System error                                            |
| INVALID_DOMAINID_ERROR        | 12007  | Domainid must be equal to or greater than 0             |



> 示例

```js
     let amount = '0'
    const destAddress1 = sdk.keypair.getBidAndKeyPairBySM2().encAddress
    const destAddress2 = sdk.keypair.getBidAndKeyPairBySM2().encAddress
    let input1 = '{"method":"creation","params":{"document":{"@context": ["https://w3.org/ns/did/v1"],"context": "https://w3id.org/did/v1","id": "' + destAddress1 + '", "version": "1"}}}'
    let input2 = '{"method":"creation","params":{"document":{"@context": ["https://w3.org/ns/did/v1"],"context": "https://w3id.org/did/v1","id": "' + destAddress2 + '", "version": "1"}}}'

    let operations = []
    let contractInvokeOperation1 = {
        contractAddress: destAddress1,
        amount: amount,
        input: input1
    }
    let contractInvokeOperation2 = {
        contractAddress: destAddress2,
        amount: amount,
        input: input2
    }
    operations.push(contractInvokeOperation1)
    operations.push(contractInvokeOperation2)

    let request = {
        sourceAddress: 'did:bid:efnVUgqQFfYeu97ABf6sGm3WFtVXHZB2',
        privateKey: 'priSPKkWVk418PKAS66q4bsiE2c4dKuSSafZvNWyGGp2sJVtXL',
        operations: operations,
        feeLimit: '20',
        gasPrice: '1',
        domainId: '0'
    }
    let data = await sdk.transaction.batchEvaluateFee(request)
    console.log('batchEvaluateFee() : ', JSON.stringify(data))
```

### 1.5.7 getTxCacheData

> 接口说明

   	该接口用于获取交易池中交易数据。

> 调用方法

```js
transaction.getTxCacheData(request)
```

> 请求参数

| 参数     | 类型    | 描述                              |
| -------- | ------- | --------------------------------- |
| hash     | String  | 选填，交易hash                    |
| domainId | Integer | 选填，指定域ID，默认主共识域id(0) |

> 响应数据

| 参数                           | 类型     | 描述                 |
| ------------------------------ | -------- | -------------------- |
| transactions                   | Object[] | 返回交易池中交易数据 |
| transactionsp[i].hash          | String   | 交易hash             |
| transactionsp[i].incoming_time | String   | 进入时间             |
| transactionsp[i].status        | String   | 状态                 |
| transactionsp[i].transaction   | Object   |                      |

> 错误码

| 异常                   | 错误码 | 描述                                        |
| ---------------------- | ------ | ------------------------------------------- |
| CONNECTNETWORK_ERROR   | 11007  | Failed to connect to the network            |
| SYSTEM_ERROR           | 20000  | System error                                |
| INVALID_DOMAINID_ERROR | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
    let request = {
        domainId: '0',
        hash: ''
    }
    let data = await sdk.transaction.getTxCacheData(request)
    console.log('getTxCacheData() : ', JSON.stringify(data))
```

### 1.5.8 parseBlob

> 接口说明

   	该接口用于blob数据解析。

> 调用方法

```js
transaction.parseBlob(transactionBlob)
```

> 请求参数

| 参数 | 类型   | 描述       |
| ---- | ------ | ---------- |
| blob | String | 必填，BLOB |

> 响应数据

| 参数          | 类型     | 描述                       |
| ------------- | -------- | -------------------------- |
| sourceAddress | String   | 交易源账号，即交易的发起方 |
| nonce         | String   | 账户交易序列号，必须大于0  |
| fee_limit     | String   | 交易要求的最低费用         |
| gas_price     | String   | 交易燃料单价               |
| domain_id     | String   | blob解析出的域ID值         |
| remarks       | String   | 用户自定义给交易的备注     |
| operations    | Object[] | 操作对象数组               |

> 错误码

| 异常                        | 错误码 | 描述                             |
| --------------------------- | ------ | -------------------------------- |
| INVALID_SERIALIZATION_ERROR | 11056  | Invalid serialization            |
| CONNECTNETWORK_ERROR        | 11007  | Failed to connect to the network |
| SYSTEM_ERROR                | 20000  | System error                     |

> 示例

```js
 let transactionBlob = '0A276469643A6269643A324E4A4C46343931536431553434323270476B50715467686946664B3337751003225C080712276469643A6269643A324E4A4C46343931536431553434323270476B50715467686946664B333775522F0A276469643A6269643A32695277744E53666841753739754A73624C6B78694333374A554C437235791080A9E0870430C0843D38E807'
    let data = await sdk.transaction.parseBlob(transactionBlob)
    console.log('parseBlob() : ', JSON.stringify(data))
```



## 1.6 区块服务接口列表 

​		区块服务接口主要是区块相关的接口，目前有6个接口：

| 序号 | 接口                | 说明                                    |
| ---- | ------------------- | --------------------------------------- |
| 1    | getBlockNumber      | 该接口用于查询最新的区块高度            |
| 2    | getTransactions     | 该接口用于查询指定区块高度下的所有交易3 |
| 3    | getBlockInfo        | 该接口用于获取区块信息                  |
| 4    | getBlockLatestInfo  | 该接口用于获取最新区块信息              |
| 5    | getValidators       | 该接口用于获取指定区块中所有验证节点数  |
| 6    | getLatestValidators | 该接口用于获取最新区块中所有验证节点数  |

### 1.6.1 getBlockNumber

> 接口说明

   	该接口用于查询最新的区块高度。

> 调用方法

```js
block.getBlockNumber(param)
```

> 请求参数

| 参数     | 类型    | 描述                              |
| -------- | ------- | --------------------------------- |
| domainId | Integer | 选填，指定域ID，默认主共识域id(0) |

> 响应数据

| 参数               | 类型        | 描述                            |
| ------------------ | ----------- | ------------------------------- |
| header             | BlockHeader | 区块头                          |
| header.blockNumber | Long        | 最新的区块高度，对应底层字段seq |

> 错误码

| 异常                   | 错误码 | 描述                                        |
| ---------------------- | ------ | ------------------------------------------- |
| CONNECTNETWORK_ERROR   | 11007  | Failed to connect to the network            |
| SYSTEM_ERROR           | 20000  | System error                                |
| INVALID_DOMAINID_ERROR | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
    // 初始化请求参数
    let param = {
        domainId: '20'
    }
	let data = await sdk.block.getBlockNumber(param)
    console.log('getBlockNumber() : ',  JSON.stringify(data))
```

### 1.6.2 getTransactions

> 接口说明

   	该接口用于查询指定区块高度下的所有交易。

> 调用方法

```js
block.getTransactions(param)
```

> 请求参数

| 参数        | 类型    | 描述                                  |
| ----------- | ------- | ------------------------------------- |
| blockNumber | Long    | 必填，最新的区块高度，对应底层字段seq |
| domainId    | Integer | 选填，指定域ID，默认主共识域id(0)     |

> 响应数据

| 参数         | 类型     | 描述           |
| ------------ | -------- | -------------- |
| totalCount   | Long     | 返回的总交易数 |
| transactions | String[] | 交易内容       |

> 错误码

| 异常                      | 错误码 | 描述                                        |
| ------------------------- | ------ | ------------------------------------------- |
| INVALID_BLOCKNUMBER_ERROR | 11060  | BlockNumber must bigger than 0              |
| REQUEST_NULL_ERROR        | 12001  | Request parameter cannot be null            |
| CONNECTNETWORK_ERROR      | 11007  | Failed to connect to the network            |
| SYSTEM_ERROR              | 20000  | System error                                |
| INVALID_DOMAINID_ERROR    | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
    // 初始化请求参数
    let param = {
        blockNumber: '1',
        domainId: '20'
    }
    let data = await sdk.block.getTransactions(param)
    console.log('getTransactions() : ',  JSON.stringify(data))
```

### 1.6.3 getBlockInfo

> 接口说明

   	该接口用于获取指定区块信息。

> 调用方法

```js
block.getBlockInfo(param)
```

> 请求参数

| 参数        | 类型    | 描述                              |
| ----------- | ------- | --------------------------------- |
| blockNumber | Long    | 必填，待查询的区块高度            |
| domainId    | Integer | 选填，指定域ID，默认主共识域id(0) |

> 响应数据

| 参数               | 类型           | 描述         |
| ------------------ | -------------- | ------------ |
| header             | BIFBlockHeader | 区块信息     |
| header.confirmTime | Long           | 区块确认时间 |
| header.number      | Long           | 区块高度     |
| header.txCount     | Long           | 交易总量     |
| header.version     | String         | 区块版本     |
| header.hash        | String         | 区块HASH     |

> 错误码

| 异常                      | 错误码 | 描述                                        |
| ------------------------- | ------ | ------------------------------------------- |
| INVALID_BLOCKNUMBER_ERROR | 11060  | BlockNumber must bigger than 0              |
| REQUEST_NULL_ERROR        | 12001  | Request parameter cannot be null            |
| CONNECTNETWORK_ERROR      | 11007  | Failed to connect to the network            |
| SYSTEM_ERROR              | 20000  | System error                                |
| INVALID_DOMAINID_ERROR    | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
    // 初始化请求参数
    let param = {
        blockNumber: '61360',
        domainId: '20'
    }
    let data = await sdk.block.getBlockInfo(param)
    console.log('getBlockInfo() : ',  JSON.stringify(data))
```

### 1.6.4 getBlockLatestInfo

> 接口说明

```
该接口用于获取最新区块信息。
```

> 调用方法

```js
block.getBlockLatestInfo(param)
```

> 请求参数

| 参数     | 类型    | 描述                              |
| -------- | ------- | --------------------------------- |
| domainId | Integer | 选填，指定域ID，默认主共识域id(0) |

> 响应数据

| 参数               | 类型           | 描述                      |
| ------------------ | -------------- | ------------------------- |
| header             | BIFBlockHeader | 区块信息                  |
| header.confirmTime | Long           | 区块确认时间              |
| header.number      | Long           | 区块高度，对应底层字段seq |
| header.txCount     | Long           | 交易总量                  |
| header.version     | String         | 区块版本                  |
| header.hash        | String         | 区块HASH                  |


> 错误码

| 异常                   | 错误码 | 描述                                        |
| ---------------------- | ------ | ------------------------------------------- |
| CONNECTNETWORK_ERROR   | 11007  | Failed to connect to the network            |
| SYSTEM_ERROR           | 20000  | System error                                |
| INVALID_DOMAINID_ERROR | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
    // 初始化请求参数
    let param = {
        domainId: '20'
    }
    let data = await sdk.block.getBlockLatestInfo(param)
    console.log('getBlockLatestInfo() : ',  JSON.stringify(data))
```

### 1.6.5 getValidators

> 接口说明

   	该接口用于获取指定区块中所有验证节点数。

> 调用方法

```js
block.getValidators(param)
```

> 请求参数

| 参数        | 类型    | 描述                              |
| ----------- | ------- | --------------------------------- |
| blockNumber | Long    | 必填，待查询的区块高度，必须大于0 |
| domainId    | Integer | 选填，指定域ID，默认主共识域id(0) |

> 响应数据

| 参数               | 类型     | 描述         |
| ------------------ | -------- | ------------ |
| validators         | String[] | 验证节点列表 |
| validators.address | String   | 共识节点地址 |

> 错误码

| 异常                      | 错误码 | 描述                                        |
| ------------------------- | ------ | ------------------------------------------- |
| INVALID_BLOCKNUMBER_ERROR | 11060  | BlockNumber must bigger than 0              |
| REQUEST_NULL_ERROR        | 12001  | Request parameter cannot be null            |
| CONNECTNETWORK_ERROR      | 11007  | Failed to connect to the network            |
| SYSTEM_ERROR              | 20000  | System error                                |
| INVALID_DOMAINID_ERROR    | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
    // 初始化请求参数
    let param = {
        blockNumber: '1',
        domainId: '20'
    }
    let data = await sdk.block.getValidators(param)
    console.log('getValidators() : ',  JSON.stringify(data))
```

### 1.6.6 getLatestValidators

> 接口说明

   	该接口用于获取最新区块中所有验证节点数。

> 调用方法

```js
block.getLatestValidators(param)
```

> 请求参数

| 参数     | 类型    | 描述                              |
| -------- | ------- | --------------------------------- |
| domainId | Integer | 选填，指定域ID，默认主共识域id(0) |

> 响应数据

| 参数               | 类型     | 描述         |
| ------------------ | -------- | ------------ |
| validators         | String[] | 验证节点列表 |
| validators.address | String   | 共识节点地址 |

> 错误码

| 异常                   | 错误码 | 描述                                        |
| ---------------------- | ------ | ------------------------------------------- |
| CONNECTNETWORK_ERROR   | 11007  | Failed to connect to the network            |
| SYSTEM_ERROR           | 20000  | System error                                |
| INVALID_DOMAINID_ERROR | 12007  | Domainid must be equal to or greater than 0 |

> 示例

```js
    // 初始化请求参数
    let param = {
        domainId: '20'
    }
    let data = await sdk.block.getLatestValidators(param)
    console.log('getLatestValidators() : ',  JSON.stringify(data))
```

## 1.7 错误码

| 异常                                      | 错误码 | 描述                                                         |
| ----------------------------------------- | ------ | ------------------------------------------------------------ |
| ACCOUNT_CREATE_ERROR                      | 11001  | Failed to create the account                                 |
| INVALID_SOURCEADDRESS_ERROR               | 11002  | Invalid sourceAddress                                        |
| INVALID_DESTADDRESS_ERROR                 | 11003  | Invalid destAddress                                          |
| INVALID_INITBALANCE_ERROR                 | 11004  | InitBalance must between 1 and max(int64)                    |
| SOURCEADDRESS_EQUAL_DESTADDRESS_ERROR     | 11005  | SourceAddress cannot be equal to destAddress                 |
| INVALID_ADDRESS_ERROR                     | 11006  | Invalid address                                              |
| CONNECTNETWORK_ERROR                      | 11007  | Failed to connect to the network                             |
| INVALID_ISSUE_AMOUNT_ERROR                | 11008  | Amount of the token to be issued must be between 1 and Long.MAX_VALUE |
| NO_METADATA_ERROR                         | 11010  | The account does not have the metadata                       |
| INVALID_DATAKEY_ERROR                     | 11011  | The length of key must between 1 and 1024                    |
| INVALID_DATAVALUE_ERROR                   | 11012  | The length of value must between 0 and 256000                |
| INVALID_DATAVERSION_ERROR                 | 11013  | The version must be equal to or greater than 0               |
| INVALID_MASTERWEIGHT_ERROR                | 11015  | MasterWeight must between 0 and max(uint32)                  |
| INVALID_SIGNER_ADDRESS_ERROR              | 11016  | Invalid signer address                                       |
| INVALID_SIGNER_WEIGHT_ERROR               | 11017  | Signer weight must between 0 and max(uint32)                 |
| INVALID_TX_THRESHOLD_ERROR                | 11018  | TxThreshold must between 0 and max(int64)                    |
| INVALID_OPERATION_TYPE_ERROR              | 11019  | Type of typeThreshold is invalid                             |
| INVALID_TYPE_THRESHOLD_ERROR              | 11020  | TypeThreshold must between 0 and max(int64)                  |
| INVALID_AMOUNT_ERROR                      | 11024  | Amount must between 0 and max(int64)                         |
| INVALID_CONTRACT_HASH_ERROR               | 11025  | Invalid transaction hash to create contract                  |
| INVALID_GAS_AMOUNT_ERROR                  | 11026  | bifAmount must be between 0 and Long.MAX_VALUE               |
| INVALID_ISSUER_ADDRESS_ERROR              | 11027  | Invalid issuer address                                       |
| INVALID_CONTRACTADDRESS_ERROR             | 11037  | Invalid contract address                                     |
| CONTRACTADDRESS_NOT_CONTRACTACCOUNT_ERROR | 11038  | ContractAddress is not a contract account                    |
| SOURCEADDRESS_EQUAL_CONTRACTADDRESS_ERROR | 11040  | SourceAddress cannot be equal to contractAddress             |
| INVALID_FROMADDRESS_ERROR                 | 11041  | Invalid fromAddress                                          |
| FROMADDRESS_EQUAL_DESTADDRESS_ERROR       | 11042  | FromAddress cannot be equal to destAddress                   |
| INVALID_SPENDER_ERROR                     | 11043  | Invalid spender                                              |
| INVALID_LOG_TOPIC_ERROR                   | 11045  | The length of log topic must between 1 and 128               |
| PAYLOAD_EMPTY_ERROR                       | 11044  | Payload cannot be empty                                      |
| INVALID_CONTRACT_TYPE_ERROR               | 11047  | Invalid contract type                                        |
| INVALID_NONCE_ERROR                       | 11048  | Nonce must between 1 and max(int64)                          |
| INVALID_GASPRICE_ERROR                    | 11049  | GasPrice must be between 0 and Long.MAX_VALUE                |
| INVALID_FEELIMIT_ERROR                    | 11050  | FeeLimit must be between 0 and Long.MAX_VALUE                |
| OPERATIONS_EMPTY_ERROR                    | 11051  | Perations cannot be empty                                    |
| INVALID_CEILLEDGERSEQ_ERROR               | 11052  | CeilLedgerSeq must be equal to or greater than 0             |
| OPERATIONS_ONE_ERROR                      | 11053  | One of operations error                                      |
| INVALID_SIGNATURENUMBER_ERROR             | 11054  | SignagureNumber must between 1 and max(int32)                |
| INVALID_HASH_ERROR                        | 11055  | Invalid transaction hash                                     |
| INVALID_SERIALIZATION_ERROR               | 11056  | Invalid serialization                                        |
| PRIVATEKEY_NULL_ERROR                     | 11057  | PrivateKeys cannot be empty                                  |
| PRIVATEKEY_ONE_ERROR                      | 11058  | One of privateKeys is invalid                                |
| SIGNDATA_NULL_ERROR                       | 11059  | SignData cannot be empty                                     |
| INVALID_BLOCKNUMBER_ERROR                 | 11060  | BlockNumber must be bigger than 0                            |
| PUBLICKEY_NULL_ERROR                      | 11061  | PublicKey cannot be empty                                    |
| URL_EMPTY_ERROR                           | 11062  | Url cannot be empty                                          |
| CONTRACTADDRESS_CODE_BOTH_NULL_ERROR      | 11063  | ContractAddress and code cannot be empty at the same time    |
| INVALID_OPTTYPE_ERROR                     | 11064  | OptType must between 0 and 2                                 |
| INVALID_SIGNATURE_ERROR                   | 15027  | Invalid signature                                            |
| GET_ALLOWANCE_ERROR                       | 11065  | Get allowance error                                          |
| SIGNATURE_EMPTY_ERROR                     | 11067  | The signatures cannot be empty                               |
| CONNECTN_BLOCKCHAIN_ERROR                 | 19999  | Failed to connect to the blockchain                          |
| SYSTEM_ERROR                              | 20000  | System error                                                 |
| REQUEST_NULL_ERROR                        | 12001  | Request parameter cannot be null                             |
| INVALID_CONTRACTBALANCE_ERROR             | 12002  | ContractBalance must be between 1 and Long.MAX_VALUE         |
| INVALID_PRITX_FROM_ERROR                  | 12003  | Invalid Private Transaction Sender                           |
| INVALID_PRITX_TO_ERROR                    | 12005  | Invalid Private Transaction recipient list                   |
| INVALID_PRITX_HASH_ERROR                  | 12006  | Invalid Private Transaction Hash                             |
| INVALID_NUMBER_OF_ARG                     | 12008  | Invalid number of arguments to the function                  |
| QUERY_RESULT_NOT_EXIST                    | 12009  | Query result not exist                                       |
| INVALID_ARGUMENTS                         | 12010  | Invalid arguments to the function                            |
| INVALID_DOMAINID_ERROR                    | 12007  | Domainid must be equal to or greater than 0                  |