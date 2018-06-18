import { latinLangs, getShopLang } from "/lib/api/helpers";

// dynamic import of slugiy/transliteration.slugify
let slugify;
async function lazyLoadSlugify() {
  let mod;
  // getting the shops base language
  const lang = getShopLang();
  // if slugify has been loaded but the language has changed
  // to be a non latin based language then load transliteration
  if (slugify && slugify.name === "replace" && latinLangs.indexOf(lang) === -1) {
    mod = await import("transliteration");
  } else if (slugify) {
    // if slugify/transliteration is loaded and no lang change
    return;
  } else if (latinLangs.indexOf(lang) >= 0) {
    // if the shops language use latin based chars load slugify else load transliterations's slugify
    mod = await import("slugify");
  } else {
    mod = await import("transliteration");
  }
  // slugify is exported to modules.default while transliteration is exported to modules.slugify
  if (mod.default) {
    slugify = mod.default;
    slugify.extend({
      " ": "-", "$": "-dlr-", "&": "-n-", "`": "-opn-qte-", ":": "-cln-", "<": "-l-an-br-", ">": "-r-an-br-",
      "[": "-l-sq-br-", "]": "-r-sq-br-", "{": "-l-cu-br-", "}": "-r-cu-br-", '"': "-qts-", "+": "-plus-", "#": "-otrp-",
      "%": "-pct-", "@": "-at-", "/": "-sls-", ";": "-scl-", "=": "-eql-", "?": "-qstn-", "\\": "-bsl-", "^": "-crt-",
      "|": "-or-", "~": "-tld-", ",": "-cma-"
    });
  } else {
    slugify = mod.slugify;
    slugify.config({
      replace: {
        " ": "-", "$": "-dlr-", "&": "-n-", "`": "-opn-qte-", ":": "-cln-", "<": "-l-an-br-", ">": "-r-an-br-",
        "[": "-l-sq-br-", "]": "-r-sq-br-", "{": "-l-cu-br-", "}": "-r-cu-br-", '"': "-qts-", "+": "-plus-", "#": "-otrp-",
        "%": "-pct-", "@": "-at-", "/": "-sls-", ";": "-scl-", "=": "-eql-", "?": "-qstn-", "\\": "-bsl-", "^": "-crt-",
        "|": "-or-", "~": "-tld-", ",": "-cma-"
      }
    });
  }
}

/**
 * @name getSlug
 * @summary Return a slugified string using "slugify" from transliteration
 * @see https://www.npmjs.com/package/transliteration
 * @method
 * @memberof Helpers
 * @locus Server
 * @param  {String} slugString - string to slugify
 * @return {String} slugified string
 */
export function getSlug(slugString) {
  let slug;
  Promise.await(lazyLoadSlugify());
  if (slugString && slugify) {
    slug = slugify(slugString.toLowerCase());
  } else {
    slug = "";
  }
  return slug;
}
