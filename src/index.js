import s1Crud from './s1-crud'

const install = Vue => {
  Vue.component('s1Crud', s1Crud)
}
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default Object.assign(s1Crud, { install })
