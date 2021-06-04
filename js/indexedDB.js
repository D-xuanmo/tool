class IndexedDB {
  /**
   * 打开数据库
   * @param {string} databaseName 数据库名称
   * @param {number} version 数据库版本
   */
  constructor(databaseName, version) {
    this.request = window.indexedDB.open(databaseName, version)

    this.db = null
  }

  /**
   * 初始化
   * @param {Object[]} tables 需要新建的表
   * @param {string} tables[].name 表名
   * @param {object} tables[].options indexedDB createObjectStore option
   * @returns {Promise}
   */
  ready(tables) {
    if (!Array.isArray(tables)) throw new Error(`[IndexedDB ready error]: Parameter is not an array, value is '${tables}'.`)
    return new Promise((resolve, reject) => {
      // 数据库打开失败
      this.request.onerror = event => reject(new Error(event))

      // 数据库打开成功
      this.request.onsuccess = event => {
        this.db = this.request.result
        resolve({
          request: this.request,
          db: this.db,
          instance: this
        })
      }

      this.request.onupgradeneeded = event => {
        const db = this.db = event.target.result
        tables.forEach(item => {
          // 如果表不存在则新建表
          if (!db.objectStoreNames.contains(item.name)) db.createObjectStore(item.name, item.options)
        })
      }
    })
  }

  _dbSuccess(resolve) {
    resolve()
  }

  _dbError(event, operation, reject) {
    reject(new Error(`[IndexedDB ${operation} error]: ${event.target.error}`))
  }

  /**
   * 新增数据
   * @param {string} name 表名
   * @param {any} data 新增的数据
   * @param {string} model 操作模式
   * @returns {Promise}
   */
  add(name, data, model = 'readwrite') {
    return new Promise((resolve, reject) => {
      const request = this.db.transaction(name, model).objectStore(name).add(data)
      request.onerror = event => this._dbError(event, 'add', reject)
      request.onsuccess = () => resolve()
    })
  }

  /**
   * 读取数据
   * @param {string} name 表名
   * @param {*} key 主键值
   * @returns {Promise}
   */
  read(name, key) {
    return new Promise((resolve, reject) => {
      const request = this.db.transaction(name).objectStore(name).get(key)
      request.onerror = event => this._dbError(event, 'read', reject)
      request.onsuccess = () => resolve(request.result)
    })
  }

  /**
   * 获取所有的数据
   * @param {string} name 表名
   * @returns {Promise}
   */
  readAll(name) {
    return new Promise((resolve, reject) => {
      const request = this.db.transaction(name).objectStore(name).openCursor()
      request.onerror = event => this._dbError(event, 'readAll', reject)

      // 保存读取的结果
      const response = []

      // 函数每次调用 continue 都会执行一次
      request.onsuccess = event => {
        const result = event.target.result
        if (result) {
          response.push(result.value)
          result.continue()
        } else {
          resolve(response)
        }
      }
    })
  }

  /**
   * 更新数据
   * @param {string} name 表名
   * @param {*} data 数据
   * @param {*} key 主键
   * @param {*} model 操作模式
   * @returns {Promise}
   */
  update(name, data, key, model = 'readwrite') {
    return new Promise((resolve, reject) => {
      const request = this.db.transaction(name, model).objectStore(name).put(data, key)
      request.onerror = event => this._dbError(event, 'update', reject)
      request.onsuccess = this._dbSuccess(resolve)
    })
  }

  /**
   * 删除数据
   * @param {string} name 表名
   * @param {*} key 主键
   * @param {*} model 操作模式
   * @returns {Promise}
   */
  delete(name, key, model = 'readwrite') {
    return new Promise((resolve, reject) => {
      const request = this.db.transaction(name, model).objectStore(name).delete(key)
      request.onerror = event => this._dbError(event, 'delete', reject)
      request.onsuccess = this._dbSuccess(resolve)
    })
  }
}
