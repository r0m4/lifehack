
var Morearty = require("morearty")


var ctx = Morearty.createContext({
  initialState:{
    words: ["123123", "oijoiasdf"]
  }
})


var b = ctx.getBinding()

var ww = b.get("words")
console.log("ww", ww)

var wv = b.get("words.0")
var wb = b.sub("words.0")


console.log("============")
console.log("wv", wv)
console.log("============")
console.log("wb", wb)
console.log("============")

wb.remove("")

var ww1 = b.get("words")

console.log("splice", ww1.splice)

console.log(ww1.splice(0,0,"qwerqwerqwerqwerewqr"))

console.log("ww1", ww1)
console.log("wb.get",wb.get())


