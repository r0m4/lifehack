
var Morearty = require('morearty');
var React = window.React = require('react/addons');
var Router = require('director').Router;
var Immutable = require('immutable');

var NOW_SHOWING = Object.freeze({ ALL: 'all', ACTIVE: 'active', COMPLETED: 'completed' });
var currentId = 4;

var words_dict = require('./dict')

function get_words_list(data){
  var words_list = []
  for(var w in data){
    var i = data[w]
    while(0<i--){
      words_list.push(w)
    }
  }
  return words_list
}

var words_list = get_words_list(words_dict)

function words_random_list(words_list, len){
  var result = []
  while(0 < len--){
    var idx = Math.floor(Math.random()*words_list.length)
    result.push(words_list[idx])
  }
  return result
}

var STRIDE_LENGTH = 40

var Ctx = Morearty.createContext({
  initialState: {
    eaten: [],
    words: [],
    cursor: {
      idx: 0,
      eaten: '',
      left: '',
      value: '',
      body:0
    }
  }
});

var $state
var $stats

function __uid(){
  return Math.floor((Math.random()*0x100000000)).toString(36)  
}

var clientid = __uid()

var wwb = Ctx.getBinding().sub('words')
var eeb = Ctx.getBinding().sub('eaten')
var ccb = Ctx.getBinding().sub('cursor')

function stateUpdate(op){
  if(op){
    console.log('docop', JSON.stringify(op))
    op.forEach(function(o){
      console.log('op', o)
      var p = o.p
      if(p.length === 0){
        if (o.oi.words && o.oi.eaten && (o.od === null || (o.od.words && o.od.eaten))){
          wwb.update(function(ww0){
            return Immutable.List(o.oi.words)
          })
          eeb.update(function(ww0){
            return Immutable.List(o.oi.eaten)
          })
          ccb.update(function(c){
            return Immutable.Map({
              idx:0,
              eaten:'',
              left:'',
              value:'',
              body:0
            })
          })
        }
      } else if(p.length === 2 && p[0] === 'words' && typeof p[1] === 'number'){
        console.log('words op', JSON.stringify(o))
        console.log('cursor', JSON.stringify(ccb.get().toJS()))
        if('li' in o && 'ld' in o){
          wwb.update(function(ww0){
            return ww0.splice(p[1],1,o.li)
          })
        } else if('li' in o && !('ld' in o)){
          wwb.update(function(ww0){
            return ww0.splice(p[1],0,o.li)
          })
        } else if(!('li' in o) && 'ld' in o){
          wwb.update(function(ww0){
            return ww0.splice(p[1],1)
          })
        } else {
          console.log('bad match, reject op')
        }
      } else if(p.length === 2 && p[0] === 'eaten' && typeof p[1] === 'number'){
        console.log('eaten op', JSON.stringify(o))
        if('li' in o && 'ld' in o){
          eeb.update(function(ww0){
            return ww0.splice(p[1],1,o.li)
          })
        } else if('li' in o && !('ld' in o)){
          eeb.update(function(ww0){
            return ww0.splice(p[1],0,o.li)
          })
        } else if(!('li' in o) && 'ld' in o){
          eeb.update(function(ww0){
            return ww0.splice(p[1],1)
          })
        } else {
          console.log('bad match, reject op')
        }
      }
    })
  } else {
    // first run
    wwb.update(function(ww0){
      var ww1 = $state.snapshot.words
      return ww0.concat(ww1)
    })
    eeb.update(function(ww0){
      var ww1 = $state.snapshot.eaten
      return ww0.concat(ww1)
    })
  }
}

// function stateUpdate(op){
//   if(op){
//     console.log('docop', JSON.stringify(op))
//     op.forEach(function(o){
//       var p = o.p
//       if(p.length === 2 && p[0] === 'words' && typeof p[1] === 'number'){
//         console.log('words op', JSON.stringify(o))
//         console.log('cursor', JSON.stringify(ccb.get().toJS()))
//         if('li' in o && 'ld' in o){
//           wwb.update(function(ww0){
//             return ww0.splice(p[1],1,o.li)
//           })
//         } else if('li' in o && !('ld' in o)){
//           wwb.update(function(ww0){
//             return ww0.splice(p[1],0,o.li)
//           })
//         } else if(!('li' in o) && 'ld' in o){
//           wwb.update(function(ww0){
//             return ww0.splice(p[1],1)
//           })
//         } else {
//           console.log('bad match, reject op')
//         }
//       } else if(p.length === 2 && p[0] === 'eaten' && typeof p[1] === 'number'){
//         console.log('eaten op', JSON.stringify(o))
//         if('li' in o && 'ld' in o){
//           eeb.update(function(ww0){
//             return ww0.splice(p[1],1,o.li)
//           })
//         } else if('li' in o && !('ld' in o)){
//           eeb.update(function(ww0){
//             return ww0.splice(p[1],0,o.li)
//           })
//         } else if(!('li' in o) && 'ld' in o){
//           eeb.update(function(ww0){
//             return ww0.splice(p[1],1)
//           })
//         } else {
//           console.log('bad match, reject op')
//         }
//       }
//     })
//   } else {
//     // first run
//     wwb.update(function(ww0){
//       var ww1 = $state.snapshot.words
//       return ww0.concat(ww1)
//     })
//     eeb.update(function(ww0){
//       var ww1 = $state.snapshot.eaten
//       return ww0.concat(ww1)
//     })
//   }
// }

var START = 0


setTimeout(function(){

  sharejs.open('words3', 'json', function(error, doc) {
	  $state = doc;
	  doc.on('change', function (op) {
		  stateUpdate(op)
	  })
	  if (doc.created) {
      console.log('doc newly created')
		  //clear()
		  //doc.submitOp([{p:[],od:null,oi:{words:[]}}])
      doc.set({
        eaten: [],
        words: ['danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing','danya:testing'],
      })
      console.log('and the document is ', JSON.stringify(doc.get()))
	  } else {
		  stateUpdate()
	  }
	  setTimeout(begin, 1000)
  })

  sharejs.open('stats', 'json', function(error, doc) {
	  $stats = doc;
  })

}, 0.1*1000)


function begin(){


  0 && setInterval(function(){

    var e0 = $state.snapshot.eaten[0]
    
    $state.submitOp({
      p: ['eaten', 0], ld: e0})

  },10*100)
}

var mstate = Ctx.getBinding()

try {
  var win = window
} catch (e){}

if(win){
  win.appctx = Ctx
}

var App = React.createClass({
  displayName: 'App',

  mixins: [Morearty.Mixin],

  // componentDidMount: function () {
  //   var binding = this.getDefaultBinding();
  //   Router({
  //     '/': binding.set.bind(binding, 'nowShowing', NOW_SHOWING.ALL),
  //     '/active': binding.set.bind(binding, 'nowShowing', NOW_SHOWING.ACTIVE),
  //     '/completed': binding.set.bind(binding, 'nowShowing', NOW_SHOWING.COMPLETED)
  //   }).init();
  // },

  render: function () {
    var binding = this.getDefaultBinding();

    return (
      <section id='wordsapp'>
        <WordsInput binding={ binding } />
      </section>
    );
  }
})

var WordsInput = React.createClass({
  displayName: 'WordsInput',

  mixins: [Morearty.Mixin],

  componentDidMount: function(){
    this.focus()
  },

  focus: function(){
    this.refs.myinput.getDOMNode().focus()
  },

  onMouseDown: function(event){
    console.log('mousedown')
    this.focus()
    event.stopPropagation()
    event.preventDefault()
  },

  onKeyDown: function(event){

    // console.log('keydown',event)
    var e = {
      _type: 'down',
      keyCode: event.keyCode,
      charCode: event.charCode
    }
    console.log(JSON.stringify(e))
    event.stopPropagation()

    if(event.keyCode < 65 || 90 <event.keyCode){
      if(event.keyCode === 39){
        // right arrow

        var binding = this.getDefaultBinding()
        var c = binding.sub('cursor')
        var cv = c.get().toJS()

        if (cv.eaten === '' && cv.left !== '') {
          c.update(function(){
            return Immutable.Map({
              idx:0,
              left:'',
              eaten: cv.left,
              value: '',
              body: cv.body
            })
          })
        }
        
        // console.log('cursor value', JSON.stringify(cv))

      } else if(event.keyCode === 0x20){
        // space

        var binding = this.getDefaultBinding()

        var c = binding.sub('cursor')
        var wwb = binding.sub('words')
        var eeb = binding.sub('eaten')
        var ww = wwb.get()
        var ee = eeb.get()

        console.log('wwb.get()', ww)
        
        var cv = c.get().toJS()

        if(cv.left === '' && cv.eaten !== ''){

          var t = Date.now() - START
          START = 0

          if(0 < ww.count()){

            var w = ww.get(0)

            c.update(function(){
              return Immutable.Map({
                idx:0,
                eaten:'',
                left:w.split(':')[1],
                value:'',
                body: cv.body+0.33333333
              })
            })

            $state.submitOp({p:['eaten', 100000], li: t+':'+cv.eaten})
            $state.submitOp({p:['words', 0], ld: w})
            
          } else {
            
            c.update(function(){
              return Immutable.Map({
                idx:0,
                eaten:'',
                left:'',
                value:'',
                body: cv.body+0.33333333
              })
            })

            $state.submitOp({p:['eaten', 100000], li: t+':'+cv.eaten})

          }

        }

        if(cv.eaten === '' && cv.left === '' && 0 < ww.count()){
          var w = ww.get(0)

          START = 0
          
          c.update(function(){
            return Immutable.Map({
              idx:0,
              left:w.split(':')[1],
              eaten:'',
              value: '',
              body: cv.body
            })
          })

          $state.submitOp({p:['words', 0], ld: w})

        }
        
        // console.log('cursor value', JSON.stringify(cv))


      }  else if (event.keyCode === 13){

        var WORDS = words_random_list(words_list, STRIDE_LENGTH).map(function(w){
          return clientid+':'+w
        })

        var words01 = $state.snapshot.eaten.slice()
        var stats0 = {}
        words01.some(function(tw){
          tw = tw.split(':')
          stats0[tw[1]] = parseInt(tw[0])
        })

        $state.set({
          words: WORDS,
          eaten: []
        })

        $stats.set(stats0)

      }  else if(event.keyCode === 8){
        // backspace

        var binding = this.getDefaultBinding()

        var c = binding.sub('cursor')
        var wwb = binding.sub('words')
        var eeb = binding.sub('eaten')
        var ww = wwb.get()
        var ee = eeb.get()

        console.log('wwb.get()', ww)
        
        var cv = c.get().toJS()

        if(cv.eaten === '' && 0 < ee.count()){

          var t = Date.now() - START
          START = 0

          var w = ee.get(ee.count()-1)

          c.update(function(){
            return Immutable.Map({
              idx:0,
              eaten:'',
              left:w.split(':')[1],
              value:'',
              body: cv.body
            })
          })

          if (cv.left !== ''){
            $state.submitOp({p:['eaten', ee.count()-1], ld: w})
            $state.submitOp({p:['words', 0], li: clientid+':'+cv.left})            
          } else {
            $state.submitOp({p:['eaten', ee.count()-1], ld: w})
          }


          

        }

      } else if (event.keyCode === 46){
        // delete
        var c = this.getDefaultBinding().sub('cursor')
        var cv = c.get().toJS()
        var wb = this.getDefaultBinding().sub('words')
        var ww = wb.get()
        
        if(cv.value === ''){
          // remove word to the right
          if(cv.idx < ww.count()){

            $state.removeAt(['words', cv.idx])

          }
        }
        
      }

      event.preventDefault()
    }
  },

  onKeyPress: function(event){
    // console.log('keydown',event)
    var e = {
      _type: 'press',
      keyCode: event.keyCode,
      charCode: event.charCode
    }
    //console.log(JSON.stringify(e))
    var keyValue = String.fromCharCode(event.charCode)

    var cb = this.getDefaultBinding().sub('cursor')
    var cv = cb.get().toJS()

    if(cv.left !== ''){

      if (START === 0){
        START = Date.now()
      }
      
      if (cv.left[0] === keyValue){
        cb.update(function(v){
          return Immutable.Map({
            idx:0,
            left:cv.left.slice(1),
            eaten: cv.eaten+cv.left[0],
            value:'',
            body: cv.body
          })
        })
      } else {
        cb.update(function(v){
          return Immutable.Map({
            idx:0,
            left:cv.left,
            eaten: cv.eaten,
            value:'',
            body: cv.body-1
          })
        })
      }
    }
    
    event.stopPropagation()
    event.preventDefault()
  },

  onKeyUp: function(event){
    event.stopPropagation()
    event.preventDefault()
  },

  render: function () {
    var binding = this.getDefaultBinding();

    var wwb = binding.sub('words');
    var eeb = binding.sub('eaten');
    var ww = wwb.get()
    var ee = eeb.get()

    function renderCursor(){
      var cb = binding.sub('cursor')
      return <Word binding={cb} cursor={true}/>
      
    }

    var renderWord = function(w,idx){

      var wb = wwb.sub(idx)
      return <Word binding={ wb }/>
    }

    function renderWords(ww){
      var cr = renderCursor()

      //var ci = binding.get('cursor.idx')
      //return ww.map(renderWord).splice(ci, 0, cr)
      var nn = ww.map(renderWord)

      return       nn.unshift(cr)
    }

    function renderEatenWord(w, idx){
      var eb = eeb.sub(idx)
      return <EatenWord binding={ eb }/>
    }

    function renderEatenWords(ee){
      return ee.map(renderEatenWord)
    }

    return (
      <section id='main' onMouseDown={this.onMouseDown}>
        <div className='inputContainer'>
          <input ref='myinput'
             type='text'
             tabindex='1'
             className='maininput'
             onKeyDown={this.onKeyDown}
             onKeyPress={this.onKeyPress} />
        </div>
        <div className='words-list' >
          { renderEatenWords(ee).toArray() }
          { renderWords(ww).toArray() }
        </div>
      </section>
    );
  }
});



var Word = React.createClass({
  displayName: 'Word',

  mixins: [Morearty.Mixin],

  render: function () {
    var binding = this.getDefaultBinding();
    var word = binding.get()

    function renderWord(w){
      var sw = w.split(':')
      //<span className='session'>{sw[0]}</span>
      return <div className='word'>
        <span className='word'>{sw[1]}</span>
      </div>
    }

    if(this.props.cursor){
      var eaten = binding.get('eaten');
      var left = binding.get('left');
      //<div className='car-icon'></div>

      var body = binding.get('body')
      var s = '==========================================='.slice(0,Math.floor(body))
      
      return (<div className='word cursor'>
          <span className='eaten'>{ eaten+'|'+s }</span>
          <span className='blink'>|</span>
          <span className='left'>{ left }</span>
        </div>);
    } else {
      return renderWord(word);
    }

  }
});

var EatenWord = React.createClass({
  displayName: 'EatenWord',

  mixins: [Morearty.Mixin],

  render: function () {
    var binding = this.getDefaultBinding();
    var word = binding.get();

    function renderWord(w){
      var sw = w.split(':')
      //<span className='session'>{sw[0]}</span>
      var h = Math.floor(parseInt(sw[0])/5)
      
      return <div className='word eaten' style={{height: h+'px'}}>
        <span className='word'>{sw[1]}</span>
        <span className='session'>{sw[0]}</span>
      </div>
    }

    if(this.props.cursor){
      return (<div className='word cursor'>{ word }<span className='blink'>|</span></div>
       );
    } else {
      return renderWord(word);
    }

  }
});



module.exports = {
  Ctx: Ctx,
  App: App
};
