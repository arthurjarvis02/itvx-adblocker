let version = "1.66.8";

function hash(value) {
   let t = 0x811c9dc5;
   for (let i = 0; i < value.length; i += 1)
       (t ^= value.charCodeAt(i)),
           (t = Math.imul(t, 0x1000193) >>> 0);
   return t;
}

function makeString(key, cipherHex) {
   return hash(`${version}|${key}|${cipherHex}`).toString(36);
}

function isEncrypted(value) {
   return "v1." === value.slice(0, 3);
}

class Encryption {
   getItem = (key) => {
        let encrypted = localStorage.getItem(key);

        if (null === encrypted || !isEncrypted(encrypted)) {
            return null;
        }

        let parts = encrypted.split(".");

        if (3 !== parts.length) {
            return null;
        }

        let [, tag, cipherHex] = parts;

        if (tag !== makeString(key, cipherHex) || cipherHex.length % 4 != 0) {
            return null;
        }
        let keystream = hash(`${version}|${key}`),
            decrypted = "";
        for (let idx = 0; idx < cipherHex.length / 4; idx += 1) {
            let code = parseInt(cipherHex.substr(4 * idx, 4), 16);
            if (Number.isNaN(code)) return null;
            decrypted += String.fromCharCode(
                code ^ ((keystream >>> (idx % 4 << 3)) & 255)
            );
        }

        return decrypted;
   };

   getLegacyItem = (key) => {
       let value = localStorage.getItem(key);
       return null === value || isEncrypted(value) ? null : value;
   };

   setItem = (key, value) => {
        let cipherHex = (function (key, value) {
            let keystream = hash(`${version}|${key}`),
                hex = "";
            for (let idx = 0; idx < value.length; idx += 1)
                hex += (
                    value.charCodeAt(idx) ^
                    ((keystream >>> (idx % 4 << 3)) & 255)
                )
                    .toString(16)
                    .padStart(4, "0");
           return hex;
       })(key, value);
       localStorage.setItem(
           key,
           ["v1", makeString(key, cipherHex), cipherHex].join(".")
       );
   };
}