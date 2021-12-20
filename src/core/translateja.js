/*
import Kuroshiro from "kuroshiro";
// Initialize kuroshiro with an instance of analyzer (You could check the [apidoc](#initanalyzer) for more information):
// For this example, you should npm install and import the kuromoji analyzer first
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";
// Instantiate
const kuroshiro = new Kuroshiro();
// Initialize
// Here uses async/await, you could also use Promise
await kuroshiro.init(new KuromojiAnalyzer());
*/

const Kuroshiro = require("kuroshiro").default;
const KuromojiAnalyzer = require("kuroshiro-analyzer-kuromoji");
const kuroshiro = new Kuroshiro();

// dummy impl
let init = false;

const loadAPI = async () => {
   if (init) return kuroshiro;
   await kuroshiro.init(new KuromojiAnalyzer());
   init = true;
   return kurosiro;
}

/*
kuroshiro.init(new KuromojiAnalyzer())
.then(function(){
   return kuroshiro.convert("感じ取れたら手を繋ごう、重なるのは人生のライン and レミリア最高！", { to: "hiragana" });
})
.then(function(result){
   console.log(result);
});
*/

async function outputJPTransliteration (text)
{
   // "退屈であくびばっかしていた毎日"
   // let output = "";
   // let prom = new Promise((resolve) => { resolve("hello"); } ); // kuroshiro.convert(text);
   let prom = (await loadAPI()).convert(text, {to: "romaji"});

   /*
   let prom = kk.transliterate( text ).then((results) => {
          // console.log("----------\n%s\n----------", results);
          return results;
          // output = results;
       }).catch((error) => {
          console.error(error);
          return "";
       });
   */

   // Promise.all([prom]);

   // return output;
   return prom;
}

exports.outputJPTransliteration = outputJPTransliteration;
