class myPromise {
  constructor(executor) {
    this._state = myPromise.PENDING
    this._value
    this.execute(executor)
  }
  execute(executor) {
    if (typeof executor !== 'function') {
      throw new Error('Promise resolver a is not a function')
    }
    executor(this.resolve.bind(this), this.reject.bind(this))
  }
  resolve(value) {
    this._state = myPromise.FULFILLED
    this._value = value
  }
  reject(value) {
    this._state = myPromise.REJECTED
    this._value = value
  }
  then(onFulfilled, onRejected) {
    let timer = null
    let ref
    let res = new myPromise(() => {})
    timer = setInterval(() => {
      if (
        (this._state === myPromise.FULFILLED &&
          typeof onFulfilled === 'function') ||
        (this._state === myPromise.REJECTED && typeof onRejected === 'function')
      ) {
        clearInterval(timer)
        try {
          if (this._state === myPromise.FULFILLED) {
            ref = onFulfilled(this._value)
          } else {
            ref = onRejected(this._value)
          }
          if (ref instanceof myPromise) {
            timer = setInterval(() => {
              if (
                ref._state === ref.FULFILLED ||
                ref._state === myPromise.REJECTED
              ) {
                res._state = ref._state
                res._value = ref.value
                clearInterval(timer)
              }
            }, 0)
          } else {
            res._state = myPromise.FULFILLED
            res._value = ref
          }
        } catch (error) {
          res._state = myPromise.REJECTED
          res._value = ref
        }
      }
    }, 0)
    return res
  }
}

new myPromise((resolve) => {
  console.log(1)
  setTimeout(() => {
    resolve('success')
    console.log(2)
  }, 0)
  console.log(3)
}).then((res) => {
  console.log(res)
})
console.log(4)

new Promise((resolve) => {
  console.log(1)
  setTimeout(() => {
    resolve('success')
    console.log(2)
  }, 0)
  console.log(3)
}).then((res) => {
  console.log(res)
})
console.log(44)
