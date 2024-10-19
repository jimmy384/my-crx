import { name as newName, age as newAge, sayHello as newSayHello } from './myModule1.js'
import * as myModule1 from './myModule1.js'
import myModule2 from './myModule2.js'

// es的数据类型
const userName = "jimmy"
console.log(typeof userName) // string


const age = 18.0
console.log(typeof age) // number


const isAdult = age >= 18
console.log(typeof isAdult) // boolean


newSayHello()
myModule1.sayHello()
myModule2.sayHello()



testArray()
testSet()
testMap()
testObj()
testClass()
testArrayJiegou()
testObjectJiegou()
tesPromise()

const func = () => { }
console.log(func) // [Function: func]

function testArray() {
    let array = [1, 2, 3, 4, 5]
    console.log(typeof array) // object
    console.log(array.size)
    array.push(6)
    let delItem = array.pop()
    console.log(delItem) // 6

    delItem = array.shift()
    console.log(delItem) // 1

    array.splice(1, 2) // 从下标1开始，删除2个元素
    console.log(array)

    array.reverse() // 翻转数组
    console.log(array)

    array.sort() // 排序
    console.log(array)

    array = [1, 2, 10, 20]
    array.sort() // 排序, 即使数组里是数字，默认也是按字符串排序，有点奇怪
    console.log(array)
    array.sort((a, b) => a - b) // 排序，按数字大小排序
    console.log(array)
    const filteredArray = array.filter((item) => item > 5) // 过滤
    console.log(filteredArray)

    const str = "hello"
    array = [...str] // 展开字符串
    console.log(array)

}

function testSet() {
    const set = new Set([1, 2, 3])
    console.log(typeof set) // object
    set.add(4)
    console.log(set.has(2))
    console.log(set.size)
    set.delete(2)
    console.log(set.has(2))
    let array = Array.from(set) // 将set转换为数组
    console.log(array)
    array = [...set] // 将set转换为数组
    console.log(array)
}

function testMap() {
    const map = new Map([
        ["name", userName],
        ["age", age],
        ["money", 0]
    ])
    console.log(typeof map) // object
    map.set("email", "jimmy@example.com")
    map.delete("age")
    console.log(map)
    console.log(map.size)

    for (let [key, value] of map) {
        console.log(key, value)
    }
    map.clear()
}

function testObj() {
    const obj = {
        name: "jimmy",
        age: 18
    }
    console.log(typeof obj) // object

    // 相比Map缺少obj.size, obj.has
    for (let key in obj) { // for...in循环遍历对象的所有可枚举属性, for...of会报错
        console.log(key);
    }

    const keys = Object.keys(obj)
    console.log(keys)

    const values = Object.values(obj)
    console.log(values)

    const entries = Object.entries(obj)
    console.log(entries)
}

function testClass() {
    class Base {
        #createdTime
        #id

        constructor(id) {
            this.#id = id
            this.#createdTime = new Date()
        }
        get createdTime() {
            return this.#createdTime
        }

        get id() {
            return this.#id
        }
    }

    class Person extends Base {
        #name // #代表是私有属性，只能在类内部访问, 必须声明出来
        #age

        constructor(name, age) {
            super(1)
            this.#name = name
            this.#age = age
        }
        sayHello() {
            console.log(`Hello, my name is ${this.name}`)
        }

        get name() {
            return this.#name
        }

        set name(name) {
            this.#name = name
        }

        get age() {
            return this.#age
        }
    }
    console.log(Person) // [class Person]
    const person = new Person("jimmy", 18)
    console.log(person)
    console.log(person.id)
    console.log(person.name)
    person.name = "John"
    console.log(person.name)
    try {
        person.age = 21 // 报错
    } catch (e) {

    }

}

function testArrayJiegou() {
    let [x, y, z] = [1, 2]
    console.log(x, y, z) // 1 2 undefined

    let [d, e, f = 0] = [1, 2] // 给f一个默认值
    console.log(d, e, f) // 1 2 0

    const [, , c] = [1, 2, 3] // 忽略前两个元素
    console.log(c)

    const [a, ...b] = [1, 2, 3, 4] // 剩余元素
    console.log(a, b) // 1 [2, 3, 4]

    // 解构互换变量
    let a1 = 1
    let b1 = 2; // 神奇，这里没分号会报错Cannot access 'b1' before initialization
    [a1, b1] = [b1, a1]
    console.log(a1, b1) // 2 1
}

function testObjectJiegou() {
    const { name, age } = { name: "jimmy", age: 18 }
    console.log(name, age) // jimmy 18

    const { name: userName, age: a } = { name: "jimmy", age: 18 } // 重命名
    console.log(userName, a) // jimmy 18

    const user = { name: "jimmy" }
    const userInfo = { email: "123@qq.com", ...user }
    console.log(userInfo) // {email: "123@qq.com", name: "jimmy"}
}

function tesPromise() {
    // Promise的三种状态pending, fulfilled, rejected
    const promise = new Promise((resolve, reject) => {
        // 随机生成一个boolean值
        setTimeout(() => {
            const success = Math.random() > 0.5
            if (success) {
                resolve("success")
            } else {
                reject("error")
            }
        }, 1000)
    })
    promise.then((value) => {
        console.log(value)
    }).catch((error) => {
        console.log(error)
    }).finally(() => {
        console.log("resolve还是reject都会执行")
    })

    promise.then((value) => { // then可以一次接收多个回调函数，包含成功和失败的
        console.log(value)
    }, (error) => {
        console.log(error)
    }).finally(() => {
        console.log("resolve还是reject都会执行")
    })
}

// 修改npm源的命令
// npm config set registry https://registry.npm.taobao.org
// 修改yarn源的命令
// yarn config set registry https://registry.npm.taobao.org

// 写一个axios的get请求的例子
function testAxios() {
    // axios默认的请求格式是json
    axios.get("https://api.github.com/users/octocat").then((response) => {
        console.log(response.status)
        console.log(response.data)
    }).catch((error) => {
        console.log(error)
    })
}