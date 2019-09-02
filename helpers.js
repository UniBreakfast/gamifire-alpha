const run = fn => fn()

Array.prototype.exclude = item => {
  if (this.includes(item)) return this.splice(this.indexOf(item), 1)
  this.filter(item) //////////////////
}