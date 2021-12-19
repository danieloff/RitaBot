/**
* Kakasi.js Japanese Transliteration
* @author Loreto Parisi (loreto at gmail dot com)
* @2017 Loreto Parisi
*/
const fs = require("fs");
const resolve = require("path").resolve;
const spawn = require("child_process").spawn;


/*
    * Recursively merge properties of two objects
    * @todo: moved to Util
    */
function mergeRecursive (obj1, obj2)
{

   // eslint-disable-next-line guard-for-in
   for (const p in obj2)
   {

      try
      {

         // Property in destination object set; update its value.
         if (obj2[p].constructor == Object)
         {

            obj1[p] = mergeRecursive(obj1[p], obj2[p]);

         }
         else
         {

            obj1[p] = obj2[p];

         }

      }
      catch (e)
      {

         // Property in destination object not set; create it and set its value.
         obj1[p] = obj2[p];

      }

   }
   return obj1;
   // mergeRecursive

}

class Kakasi
{

   /**
         * KAKASI - Kanji Kana Simple Inverter
         * @see https://github.com/loretoparisi/kakasi
         */
   constructor (options)
   {

      this.GetBinFolder = function GetBinFolder (filename)
      {

         const cdir = process.cwd();
         const pathComponents = __dirname.split("/");
         const root = pathComponents.slice(0, pathComponents.length).join("/");
         process.chdir(root);
         const binpath = resolve(`./bin/${process.platform}/${filename}`);

         process.env.ITAIJIDICTPATH = resolve("./data/itaijidict");
         process.env.KANWADICTPATH = resolve("./data/kanwadict");

         process.chdir(cdir);

         // check local binary path
         if (fs.existsSync(binpath))
         {

            return binpath;

         }
         return null;

      };
      this._options = {
         "bin": this.GetBinFolder("kakasi"),
         "child": {
            "detached": false
         },
         "cmd": {},
         "debug": false
      };
      mergeRecursive(this._options, options);
      // Kakasi

   }

   /**
         * Transliterate Japanese
         */
   transliterate (data)
   {

      return new Promise((resolve, reject) =>
      {

         let args = [
            "-i",
            "euc",
            "-Ha",
            "-Ka",
            "-Ja",
            "-Ea",
            "-ka",
            "-s",
            "-iutf8",
            "-outf8"
         ];
         const kakasi = spawn(this._options.bin, args, {});
         args = [
            data
         ];
         const echo = spawn("echo", args, {});

         echo.stdout.pipe(kakasi.stdin);
         let res = "";
         kakasi.stdout.on("data", (_data) =>
         {

            const data = Buffer.from(_data, "utf-8").toString();
            res += data;

         });
         kakasi.stdout.on("end", () => resolve(res));
         kakasi.on("error", (error) => reject(error));

         if (this._options.debug)
         {

            kakasi.stdout.pipe(process.stdout);

         }

      });

   }

}

module.exports = Kakasi;
